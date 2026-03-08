import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const COUNTRY_CURRENCY: Record<string, { code: string; symbol: string; rate: number }> = {
  US: { code: 'USD', symbol: '$', rate: 1 },
  IN: { code: 'INR', symbol: '₹', rate: 83 },
  GB: { code: 'GBP', symbol: '£', rate: 0.79 },
  DE: { code: 'EUR', symbol: '€', rate: 0.92 },
  FR: { code: 'EUR', symbol: '€', rate: 0.92 },
  IT: { code: 'EUR', symbol: '€', rate: 0.92 },
  ES: { code: 'EUR', symbol: '€', rate: 0.92 },
  NL: { code: 'EUR', symbol: '€', rate: 0.92 },
  BE: { code: 'EUR', symbol: '€', rate: 0.92 },
  AT: { code: 'EUR', symbol: '€', rate: 0.92 },
  PT: { code: 'EUR', symbol: '€', rate: 0.92 },
  IE: { code: 'EUR', symbol: '€', rate: 0.92 },
  FI: { code: 'EUR', symbol: '€', rate: 0.92 },
  GR: { code: 'EUR', symbol: '€', rate: 0.92 },
  JP: { code: 'JPY', symbol: '¥', rate: 149 },
  CN: { code: 'CNY', symbol: '¥', rate: 7.24 },
  KR: { code: 'KRW', symbol: '₩', rate: 1320 },
  BR: { code: 'BRL', symbol: 'R$', rate: 4.97 },
  CA: { code: 'CAD', symbol: 'CA$', rate: 1.36 },
  AU: { code: 'AUD', symbol: 'A$', rate: 1.53 },
  MX: { code: 'MXN', symbol: 'MX$', rate: 17.15 },
  RU: { code: 'RUB', symbol: '₽', rate: 92 },
  TR: { code: 'TRY', symbol: '₺', rate: 30.2 },
  SA: { code: 'SAR', symbol: 'ر.س', rate: 3.75 },
  AE: { code: 'AED', symbol: 'د.إ', rate: 3.67 },
  ZA: { code: 'ZAR', symbol: 'R', rate: 18.6 },
  NG: { code: 'NGN', symbol: '₦', rate: 1550 },
  EG: { code: 'EGP', symbol: 'E£', rate: 30.9 },
  PK: { code: 'PKR', symbol: '₨', rate: 278 },
  BD: { code: 'BDT', symbol: '৳', rate: 110 },
  ID: { code: 'IDR', symbol: 'Rp', rate: 15600 },
  TH: { code: 'THB', symbol: '฿', rate: 35.5 },
  VN: { code: 'VND', symbol: '₫', rate: 24500 },
  PH: { code: 'PHP', symbol: '₱', rate: 56 },
  MY: { code: 'MYR', symbol: 'RM', rate: 4.65 },
  SG: { code: 'SGD', symbol: 'S$', rate: 1.34 },
  HK: { code: 'HKD', symbol: 'HK$', rate: 7.82 },
  TW: { code: 'TWD', symbol: 'NT$', rate: 31.5 },
  SE: { code: 'SEK', symbol: 'kr', rate: 10.5 },
  NO: { code: 'NOK', symbol: 'kr', rate: 10.6 },
  DK: { code: 'DKK', symbol: 'kr', rate: 6.87 },
  CH: { code: 'CHF', symbol: 'CHF', rate: 0.88 },
  PL: { code: 'PLN', symbol: 'zł', rate: 4.02 },
  CZ: { code: 'CZK', symbol: 'Kč', rate: 22.8 },
  HU: { code: 'HUF', symbol: 'Ft', rate: 355 },
  RO: { code: 'RON', symbol: 'lei', rate: 4.57 },
  IL: { code: 'ILS', symbol: '₪', rate: 3.65 },
  CL: { code: 'CLP', symbol: 'CL$', rate: 890 },
  CO: { code: 'COP', symbol: 'COL$', rate: 3950 },
  AR: { code: 'ARS', symbol: 'AR$', rate: 850 },
  PE: { code: 'PEN', symbol: 'S/', rate: 3.72 },
  NZ: { code: 'NZD', symbol: 'NZ$', rate: 1.64 },
  KE: { code: 'KES', symbol: 'KSh', rate: 153 },
  GH: { code: 'GHS', symbol: 'GH₵', rate: 12.5 },
  LK: { code: 'LKR', symbol: 'Rs', rate: 325 },
  NP: { code: 'NPR', symbol: 'रू', rate: 133 },
  UA: { code: 'UAH', symbol: '₴', rate: 37.5 },
};

function formatPrice(amount: number, rate: number): string {
  const converted = amount * rate;
  if (rate >= 100) return Math.round(converted).toString();
  if (rate >= 10) return Math.round(converted).toString();
  return converted % 1 === 0 ? converted.toString() : converted.toFixed(2);
}

const DEFAULT_BASE_PRICE = 19;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Fetch base price from DB
    let basePriceUsd = DEFAULT_BASE_PRICE;
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data } = await supabase.from('pricing_config').select('base_price_usd').limit(1).single();
      if (data) basePriceUsd = Number(data.base_price_usd);
    } catch (e) {
      console.error('Failed to fetch pricing config:', e);
    }

    // Detect country - try multiple methods
    let countryCode = 'US';

    // 1. Check request body for client-provided IP hint
    let clientIp: string | null = null;
    try {
      if (req.method === 'POST') {
        const body = await req.clone().json();
        if (body?.clientIp) clientIp = body.clientIp;
      }
    } catch {}

    // 2. Check forwarded headers
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const cfCountry = req.headers.get('cf-ipcountry');
    
    if (cfCountry && cfCountry !== 'XX') {
      countryCode = cfCountry.toUpperCase();
    } else {
      // Use IP geolocation API
      const ip = clientIp || (forwardedFor ? forwardedFor.split(',')[0].trim() : realIp);
      
      if (ip && ip !== '127.0.0.1' && !ip.startsWith('10.') && !ip.startsWith('192.168.')) {
        try {
          const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`);
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            if (geoData.countryCode) countryCode = geoData.countryCode;
          }
        } catch (e) {
          console.error('IP geolocation failed:', e);
        }
      }

      // If still US, try without IP (uses the edge function server's IP as fallback)
      if (countryCode === 'US' && !ip) {
        try {
          const geoRes = await fetch('http://ip-api.com/json/?fields=countryCode');
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            if (geoData.countryCode) countryCode = geoData.countryCode;
          }
        } catch (e) {
          console.error('IP geolocation fallback failed:', e);
        }
      }
    }

    const currencyInfo = COUNTRY_CURRENCY[countryCode] || COUNTRY_CURRENCY['US'];
    const convertedPrice = formatPrice(basePriceUsd, currencyInfo.rate);

    return new Response(JSON.stringify({
      country: countryCode,
      currency: currencyInfo.code,
      symbol: currencyInfo.symbol,
      localPrice: convertedPrice,
      usdPrice: basePriceUsd,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Geo pricing error:', error);
    return new Response(JSON.stringify({
      country: 'US',
      currency: 'USD',
      symbol: '$',
      localPrice: String(DEFAULT_BASE_PRICE),
      usdPrice: DEFAULT_BASE_PRICE,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
