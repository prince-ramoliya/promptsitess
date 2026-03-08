import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Country to currency mapping with exchange rates (approximate, USD base)
const COUNTRY_CURRENCY: Record<string, { code: string; symbol: string; rate: number }> = {
  US: { code: 'USD', symbol: '$', rate: 1 },
  IN: { code: 'INR', symbol: '₹', rate: 83 },
  GB: { code: 'GBP', symbol: '£', rate: 0.79 },
  EU: { code: 'EUR', symbol: '€', rate: 0.92 },
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

const BASE_PRICE_USD = 19;

function formatPrice(amount: number, rate: number): string {
  const converted = Math.round(amount * rate);
  // For currencies where the converted value is very large, use no decimals
  if (rate > 100) return converted.toString();
  if (rate > 10) return converted.toString();
  // For currencies close to USD, show two decimals
  const val = amount * rate;
  return val % 1 === 0 ? val.toString() : val.toFixed(2);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get country from Cloudflare/Deno headers
    const country = req.headers.get('cf-ipcountry') 
      || req.headers.get('x-vercel-ip-country')
      || req.headers.get('x-country-code')
      || null;

    const countryCode = country?.toUpperCase() || 'US';
    const currencyInfo = COUNTRY_CURRENCY[countryCode] || COUNTRY_CURRENCY['US'];
    
    const convertedPrice = formatPrice(BASE_PRICE_USD, currencyInfo.rate);

    return new Response(JSON.stringify({
      country: countryCode,
      currency: currencyInfo.code,
      symbol: currencyInfo.symbol,
      localPrice: convertedPrice,
      usdPrice: BASE_PRICE_USD,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Geo pricing error:', error);
    return new Response(JSON.stringify({
      country: 'US',
      currency: 'USD',
      symbol: '$',
      localPrice: '19',
      usdPrice: 19,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
