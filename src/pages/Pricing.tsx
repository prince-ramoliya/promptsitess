import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Crown, Code, Layers, Zap, Layout, Palette, MousePointerClick, Plus, Minus, Tag, X, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePurchaseStatus } from '@/hooks/usePurchaseStatus';
import { toast } from 'sonner';

interface GeoPricing {
  country: string;
  currency: string;
  symbol: string;
  localPrice: string;
  usdPrice: number;
}

const features = [
  'Full library access',
  'Premium AI prompts',
  'Weekly new components',
  'Priority support',
  'Early access to new features',
  'Copy & paste workflow',
];

const FloatingOrb = ({ delay, duration, x, y, size, color }: { delay: number; duration: number; x: string; y: string; size: string; color: string }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl opacity-20 ${size} ${color}`}
    style={{ left: x, top: y }}
    animate={{
      y: [0, -30, 0, 30, 0],
      x: [0, 20, 0, -20, 0],
      scale: [1, 1.2, 1, 0.8, 1],
      opacity: [0.15, 0.3, 0.15, 0.25, 0.15],
    }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

const GridLine = ({ orientation, position, delay }: { orientation: 'h' | 'v'; position: string; delay: number }) => (
  <motion.div
    className={`absolute ${orientation === 'h' ? 'w-full h-px' : 'h-full w-px'} bg-gradient-to-${orientation === 'h' ? 'r' : 'b'} from-transparent via-primary/[0.07] to-transparent`}
    style={orientation === 'h' ? { top: position, left: 0 } : { left: position, top: 0 }}
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, 0.5, 0] }}
    transition={{ duration: 4, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

/* Floating icon elements for pricing context */
const FloatingIcon = ({ icon: Icon, x, y, delay, size = 24 }: { icon: any; x: string; y: string; delay: number; size?: number }) => (
  <motion.div
    className="absolute flex items-center justify-center w-14 h-14 rounded-2xl bg-card/50 backdrop-blur-md border border-border/30 text-muted-foreground/50 shadow-lg shadow-primary/5"
    style={{ left: x, top: y }}
    animate={{
      y: [0, -20, 0, 20, 0],
      rotate: [0, 8, 0, -8, 0],
      opacity: [0.3, 0.7, 0.3],
    }}
    transition={{ duration: 8 + delay, delay, repeat: Infinity, ease: 'easeInOut' }}
  >
    <Icon size={size} />
  </motion.div>
);

const getPricingFaqs = (price: number) => [
  {
    question: 'Is this really a one-time payment?',
    answer: `Yes! You pay $${price} once and get lifetime access to the entire component library, all premium prompts, and every future update. No subscriptions, no recurring charges.`,
  },
  {
    question: 'What do I get with Pro access?',
    answer: 'Pro gives you access to all premium UI prompts, exclusive component categories, weekly new additions, priority support, and early access to new features.',
  },
  {
    question: 'Will I get access to future components?',
    answer: 'Absolutely! Your lifetime access includes all future components and updates. We add new premium prompts every week.',
  },
  {
    question: 'How does the copy & paste workflow work?',
    answer: 'Browse the library, find a component you like, copy the AI prompt, and paste it into tools like Lovable, Cursor, or Bolt. The AI generates the full production-ready component for you.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'We offer free components so you can try the platform before purchasing. Pro components are marked with a golden crown badge.',
  },
];

const PricingFAQ = ({ basePriceUsd }: { basePriceUsd: number }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section-padding relative z-10 pt-8 pb-24">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="badge-tag text-[10px] mb-4 inline-block">FAQ</span>
          <h2 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight">
            Common <span className="gradient-text">Questions</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {getPricingFaqs(basePriceUsd).map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className={`w-full text-left px-6 py-5 rounded-2xl glass-card transition-all duration-300 group ${
                  openIndex === i ? 'border-primary/30 shadow-[0_0_30px_-10px_hsl(var(--primary)/0.15)]' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-foreground">{faq.question}</span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    openIndex === i ? 'bg-primary/20 text-primary rotate-0' : 'bg-muted/30 text-muted-foreground'
                  }`}>
                    {openIndex === i ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </div>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [geoPricing, setGeoPricing] = useState<GeoPricing | null>(() => {
    // Instant currency detection via browser timezone/locale
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const tzCountryMap: Record<string, string> = {
        'Asia/Kolkata': 'IN', 'Asia/Calcutta': 'IN', 'Asia/Colombo': 'LK',
        'Europe/London': 'GB', 'Europe/Berlin': 'DE', 'Europe/Paris': 'FR',
        'Europe/Rome': 'IT', 'Europe/Madrid': 'ES', 'Europe/Amsterdam': 'NL',
        'Europe/Brussels': 'BE', 'Europe/Vienna': 'AT', 'Europe/Lisbon': 'PT',
        'Europe/Dublin': 'IE', 'Europe/Helsinki': 'FI', 'Europe/Athens': 'GR',
        'Asia/Tokyo': 'JP', 'Asia/Shanghai': 'CN', 'Asia/Seoul': 'KR',
        'America/Sao_Paulo': 'BR', 'America/Toronto': 'CA', 'Australia/Sydney': 'AU',
        'America/Mexico_City': 'MX', 'Europe/Moscow': 'RU', 'Europe/Istanbul': 'TR',
        'Asia/Riyadh': 'SA', 'Asia/Dubai': 'AE', 'Africa/Johannesburg': 'ZA',
        'Africa/Lagos': 'NG', 'Africa/Cairo': 'EG', 'Asia/Karachi': 'PK',
        'Asia/Dhaka': 'BD', 'Asia/Jakarta': 'ID', 'Asia/Bangkok': 'TH',
        'Asia/Ho_Chi_Minh': 'VN', 'Asia/Manila': 'PH', 'Asia/Kuala_Lumpur': 'MY',
        'Asia/Singapore': 'SG', 'Asia/Hong_Kong': 'HK', 'Asia/Taipei': 'TW',
        'Europe/Stockholm': 'SE', 'Europe/Oslo': 'NO', 'Europe/Copenhagen': 'DK',
        'Europe/Zurich': 'CH', 'Europe/Warsaw': 'PL', 'Europe/Prague': 'CZ',
        'Europe/Budapest': 'HU', 'Europe/Bucharest': 'RO', 'Asia/Jerusalem': 'IL',
        'America/Santiago': 'CL', 'America/Bogota': 'CO', 'America/Argentina/Buenos_Aires': 'AR',
        'America/Lima': 'PE', 'Pacific/Auckland': 'NZ', 'Africa/Nairobi': 'KE',
        'Africa/Accra': 'GH', 'Asia/Kathmandu': 'NP', 'Europe/Kiev': 'UA',
        'America/New_York': 'US', 'America/Chicago': 'US', 'America/Denver': 'US',
        'America/Los_Angeles': 'US',
      };
      const currencyMap: Record<string, { code: string; symbol: string; rate: number }> = {
        US: { code: 'USD', symbol: '$', rate: 1 }, IN: { code: 'INR', symbol: '₹', rate: 83 },
        GB: { code: 'GBP', symbol: '£', rate: 0.79 }, DE: { code: 'EUR', symbol: '€', rate: 0.92 },
        FR: { code: 'EUR', symbol: '€', rate: 0.92 }, IT: { code: 'EUR', symbol: '€', rate: 0.92 },
        ES: { code: 'EUR', symbol: '€', rate: 0.92 }, NL: { code: 'EUR', symbol: '€', rate: 0.92 },
        JP: { code: 'JPY', symbol: '¥', rate: 149 }, CN: { code: 'CNY', symbol: '¥', rate: 7.24 },
        KR: { code: 'KRW', symbol: '₩', rate: 1320 }, BR: { code: 'BRL', symbol: 'R$', rate: 4.97 },
        CA: { code: 'CAD', symbol: 'CA$', rate: 1.36 }, AU: { code: 'AUD', symbol: 'A$', rate: 1.53 },
        MX: { code: 'MXN', symbol: 'MX$', rate: 17.15 }, TR: { code: 'TRY', symbol: '₺', rate: 30.2 },
        SA: { code: 'SAR', symbol: 'ر.س', rate: 3.75 }, AE: { code: 'AED', symbol: 'د.إ', rate: 3.67 },
        ZA: { code: 'ZAR', symbol: 'R', rate: 18.6 }, NG: { code: 'NGN', symbol: '₦', rate: 1550 },
        PK: { code: 'PKR', symbol: '₨', rate: 278 }, BD: { code: 'BDT', symbol: '৳', rate: 110 },
        ID: { code: 'IDR', symbol: 'Rp', rate: 15600 }, TH: { code: 'THB', symbol: '฿', rate: 35.5 },
        VN: { code: 'VND', symbol: '₫', rate: 24500 }, PH: { code: 'PHP', symbol: '₱', rate: 56 },
        MY: { code: 'MYR', symbol: 'RM', rate: 4.65 }, SG: { code: 'SGD', symbol: 'S$', rate: 1.34 },
        HK: { code: 'HKD', symbol: 'HK$', rate: 7.82 }, TW: { code: 'TWD', symbol: 'NT$', rate: 31.5 },
        SE: { code: 'SEK', symbol: 'kr', rate: 10.5 }, NO: { code: 'NOK', symbol: 'kr', rate: 10.6 },
        CH: { code: 'CHF', symbol: 'CHF', rate: 0.88 }, PL: { code: 'PLN', symbol: 'zł', rate: 4.02 },
        CZ: { code: 'CZK', symbol: 'Kč', rate: 22.8 }, HU: { code: 'HUF', symbol: 'Ft', rate: 355 },
        IL: { code: 'ILS', symbol: '₪', rate: 3.65 }, NZ: { code: 'NZD', symbol: 'NZ$', rate: 1.64 },
        KE: { code: 'KES', symbol: 'KSh', rate: 153 }, LK: { code: 'LKR', symbol: 'Rs', rate: 325 },
        NP: { code: 'NPR', symbol: 'रू', rate: 133 }, UA: { code: 'UAH', symbol: '₴', rate: 37.5 },
      };
      const locale = navigator.language || 'en-US';
      let country = tzCountryMap[tz] || '';
      if (!country && locale.includes('-')) country = locale.split('-').pop()?.toUpperCase() || 'US';
      if (!country) country = 'US';
      const info = currencyMap[country] || currencyMap['US'];
      const price = 19;
      const converted = info.rate >= 10 ? Math.round(price * info.rate).toString() : (price * info.rate) % 1 === 0 ? (price * info.rate).toString() : (price * info.rate).toFixed(2);
      return { country, currency: info.code, symbol: info.symbol, localPrice: converted, usdPrice: price };
    } catch {
      return { country: 'US', currency: 'USD', symbol: '$', localPrice: '19', usdPrice: 19 };
    }
  });
  const [basePriceUsd, setBasePriceUsd] = useState(19);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number; amount: number } | null>(null);
  const [discountError, setDiscountError] = useState('');
  const [checkingCode, setCheckingCode] = useState(false);

  // Fetch base price from DB and update geo pricing
  useEffect(() => {
    const fetchPrice = async () => {
      const { data } = await supabase.from('pricing_config').select('base_price_usd').limit(1).single();
      if (data) {
        const price = Number((data as any).base_price_usd);
        setBasePriceUsd(price);
        setGeoPricing(prev => {
          if (!prev) return prev;
          const rate = prev.usdPrice > 0 ? Number(prev.localPrice) / prev.usdPrice : 1;
          const converted = rate >= 10 ? Math.round(price * rate).toString() : (price * rate) % 1 === 0 ? (price * rate).toString() : (price * rate).toFixed(2);
          return { ...prev, localPrice: converted, usdPrice: price };
        });
      }
    };
    fetchPrice();

    const channel = supabase
      .channel('pricing-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pricing_config' }, (payload: any) => {
        if (payload.new?.base_price_usd) {
          const price = Number(payload.new.base_price_usd);
          setBasePriceUsd(price);
          setGeoPricing(prev => {
            if (!prev) return prev;
            const rate = prev.usdPrice > 0 ? Number(prev.localPrice) / prev.usdPrice : 1;
            const converted = rate >= 10 ? Math.round(price * rate).toString() : (price * rate) % 1 === 0 ? (price * rate).toString() : (price * rate).toFixed(2);
            return { ...prev, localPrice: converted, usdPrice: price };
          });
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Calculate final price
  const finalPriceUsd = appliedDiscount
    ? appliedDiscount.percent > 0
      ? basePriceUsd * (1 - appliedDiscount.percent / 100)
      : Math.max(0, basePriceUsd - appliedDiscount.amount)
    : basePriceUsd;

  const geoRate = geoPricing && geoPricing.currency !== 'USD' ? Number(geoPricing.localPrice) / geoPricing.usdPrice : 1;
  const displayPrice = geoPricing && geoPricing.currency !== 'USD'
    ? `${geoPricing.symbol}${Math.round(finalPriceUsd * geoRate)}`
    : `$${finalPriceUsd % 1 === 0 ? finalPriceUsd : finalPriceUsd.toFixed(2)}`;
  const isLocalCurrency = geoPricing && geoPricing.currency !== 'USD';

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    setCheckingCode(true);
    setDiscountError('');
    const { data, error } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('code', discountCode.trim().toUpperCase())
      .eq('is_active', true)
      .limit(1)
      .single();

    setCheckingCode(false);
    if (error || !data) {
      setDiscountError('Invalid or expired code');
      setAppliedDiscount(null);
      return;
    }
    const d = data as any;
    if (d.expires_at && new Date(d.expires_at) < new Date()) {
      setDiscountError('This code has expired');
      setAppliedDiscount(null);
      return;
    }
    if (d.max_uses !== null && d.current_uses >= d.max_uses) {
      setDiscountError('This code has reached its max uses');
      setAppliedDiscount(null);
      return;
    }
    setAppliedDiscount({ code: d.code, percent: d.discount_percent, amount: Number(d.discount_amount) });
    setDiscountError('');
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode('');
    setDiscountError('');
  };

  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 4,
        size: 2 + Math.random() * 3,
      })),
    []
  );

  return (
    <div className="min-h-screen bg-background smooth-scroll relative overflow-hidden">
      <Navbar />

      {/* === Animated linear gradient background === */}
      <div className="fixed inset-0 pointer-events-none -z-20">
        {/* Cycling linear gradient that shifts hue */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'linear-gradient(135deg, hsl(var(--cyan) / 0.12) 0%, hsl(var(--pink) / 0.08) 50%, hsl(var(--yellow) / 0.06) 100%)',
              'linear-gradient(135deg, hsl(var(--yellow) / 0.10) 0%, hsl(var(--emerald) / 0.10) 50%, hsl(var(--cyan) / 0.08) 100%)',
              'linear-gradient(135deg, hsl(var(--pink) / 0.10) 0%, hsl(var(--cyan) / 0.08) 50%, hsl(var(--emerald) / 0.06) 100%)',
              'linear-gradient(135deg, hsl(var(--emerald) / 0.08) 0%, hsl(var(--yellow) / 0.10) 50%, hsl(var(--pink) / 0.08) 100%)',
              'linear-gradient(135deg, hsl(var(--cyan) / 0.12) 0%, hsl(var(--pink) / 0.08) 50%, hsl(var(--yellow) / 0.06) 100%)',
            ],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Diagonal animated gradient band */}
        <motion.div
          className="absolute -inset-[50%] opacity-30"
          style={{
            background: 'conic-gradient(from 0deg at 50% 50%, hsl(var(--cyan) / 0.2), hsl(var(--pink) / 0.15), hsl(var(--yellow) / 0.15), hsl(var(--emerald) / 0.15), hsl(var(--cyan) / 0.2))',
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* === Foreground background elements === */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Gradient mesh */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 80% 60% at 20% 30%, hsl(var(--cyan) / 0.15) 0%, transparent 70%),
                radial-gradient(ellipse 60% 80% at 80% 20%, hsl(var(--pink) / 0.12) 0%, transparent 70%),
                radial-gradient(ellipse 70% 50% at 50% 80%, hsl(var(--emerald) / 0.12) 0%, transparent 70%),
                radial-gradient(ellipse 50% 70% at 10% 70%, hsl(var(--yellow) / 0.1) 0%, transparent 70%)
              `,
            }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 60% 50% at 70% 60%, hsl(var(--cyan) / 0.1) 0%, transparent 60%),
                radial-gradient(ellipse 50% 60% at 30% 50%, hsl(var(--accent) / 0.1) 0%, transparent 60%),
                radial-gradient(ellipse 80% 40% at 60% 20%, hsl(var(--yellow) / 0.08) 0%, transparent 60%)
              `,
            }}
            animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.08, 1] }}
            transition={{ duration: 8, delay: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Animated gradient streaks */}
        <motion.div
          className="absolute w-[800px] h-[3px] top-[30%] -left-20 bg-gradient-to-r from-transparent via-[hsl(var(--cyan)/0.4)] to-transparent blur-[2px]"
          animate={{ x: ['-100%', '250%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
        />
        <motion.div
          className="absolute w-[600px] h-[3px] top-[55%] -right-20 bg-gradient-to-r from-transparent via-[hsl(var(--pink)/0.35)] to-transparent blur-[2px]"
          animate={{ x: ['250%', '-100%'] }}
          transition={{ duration: 6, delay: 2, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
        />
        <motion.div
          className="absolute w-[500px] h-[3px] top-[75%] -left-10 bg-gradient-to-r from-transparent via-[hsl(var(--yellow)/0.3)] to-transparent blur-[2px]"
          animate={{ x: ['-100%', '300%'] }}
          transition={{ duration: 7, delay: 4, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
        />
        <motion.div
          className="absolute w-[700px] h-[3px] top-[42%] -right-10 bg-gradient-to-r from-transparent via-[hsl(var(--emerald)/0.3)] to-transparent blur-[2px]"
          animate={{ x: ['200%', '-150%'] }}
          transition={{ duration: 8, delay: 1, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
        />

        {/* Glowing diamond shapes */}
        <motion.div
          className="absolute w-32 h-32 border border-primary/10 rotate-45 rounded-lg"
          style={{ left: '5%', top: '40%' }}
          animate={{ rotate: [45, 135, 45], opacity: [0.2, 0.5, 0.2], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-24 h-24 border border-[hsl(var(--pink)/0.15)] rotate-45 rounded-lg"
          style={{ right: '8%', top: '55%' }}
          animate={{ rotate: [45, -45, 45], opacity: [0.15, 0.4, 0.15], scale: [1, 1.15, 1] }}
          transition={{ duration: 12, delay: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-20 h-20 border border-[hsl(var(--yellow)/0.12)] rotate-45 rounded-lg"
          style={{ left: '50%', top: '20%' }}
          animate={{ rotate: [45, 225, 45], opacity: [0.1, 0.35, 0.1] }}
          transition={{ duration: 14, delay: 1, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Floating orbs */}
        <FloatingOrb delay={0} duration={8} x="10%" y="20%" size="w-72 h-72" color="bg-[hsl(var(--cyan))]" />
        <FloatingOrb delay={2} duration={10} x="70%" y="10%" size="w-96 h-96" color="bg-[hsl(var(--accent))]" />
        <FloatingOrb delay={4} duration={12} x="50%" y="60%" size="w-64 h-64" color="bg-[hsl(var(--emerald))]" />
        <FloatingOrb delay={1} duration={9} x="85%" y="70%" size="w-56 h-56" color="bg-[hsl(var(--yellow))]" />
        <FloatingOrb delay={3} duration={7} x="20%" y="75%" size="w-48 h-48" color="bg-[hsl(var(--pink))]" />

        {/* Grid lines */}
        <GridLine orientation="h" position="25%" delay={0} />
        <GridLine orientation="h" position="50%" delay={1.5} />
        <GridLine orientation="h" position="75%" delay={3} />
        <GridLine orientation="v" position="25%" delay={0.5} />
        <GridLine orientation="v" position="50%" delay={2} />
        <GridLine orientation="v" position="75%" delay={3.5} />

        {/* Floating pricing/web concept icons */}
        <FloatingIcon icon={Code} x="8%" y="25%" delay={0} />
        <FloatingIcon icon={Layers} x="88%" y="30%" delay={1.5} />
        <FloatingIcon icon={Layout} x="15%" y="65%" delay={3} />
        <FloatingIcon icon={Palette} x="82%" y="68%" delay={2} />
        <FloatingIcon icon={Zap} x="45%" y="15%" delay={4} />
        <FloatingIcon icon={MousePointerClick} x="75%" y="85%" delay={1} />
        <FloatingIcon icon={Crown} x="25%" y="85%" delay={2.5} />
        <FloatingIcon icon={Sparkles} x="60%" y="80%" delay={3.5} />

        {/* Particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-primary/40"
            style={{ left: p.x, top: p.y, width: p.size, height: p.size }}
            animate={{ y: [0, -60, 0], opacity: [0, 0.8, 0] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="absolute inset-0 noise-bg opacity-30" />

      {/* Left side animated gradient elements */}
      <div className="fixed left-0 top-0 w-1/3 h-full pointer-events-none -z-[5] overflow-hidden">
        <motion.div
          className="absolute w-[300px] h-[500px] -left-20 top-[15%] rounded-full blur-[100px]"
          animate={{
            background: [
              'radial-gradient(circle, hsl(var(--cyan) / 0.25) 0%, transparent 70%)',
              'radial-gradient(circle, hsl(var(--pink) / 0.2) 0%, transparent 70%)',
              'radial-gradient(circle, hsl(var(--emerald) / 0.2) 0%, transparent 70%)',
              'radial-gradient(circle, hsl(var(--cyan) / 0.25) 0%, transparent 70%)',
            ],
            y: [0, 80, -40, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[200px] h-[400px] left-10 top-[50%] rounded-full blur-[80px]"
          animate={{
            background: [
              'radial-gradient(circle, hsl(var(--yellow) / 0.2) 0%, transparent 70%)',
              'radial-gradient(circle, hsl(var(--cyan) / 0.18) 0%, transparent 70%)',
              'radial-gradient(circle, hsl(var(--pink) / 0.18) 0%, transparent 70%)',
              'radial-gradient(circle, hsl(var(--yellow) / 0.2) 0%, transparent 70%)',
            ],
            y: [0, -60, 30, 0],
          }}
          transition={{ duration: 12, delay: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Vertical animated line - left */}
        <motion.div
          className="absolute w-[2px] h-[200px] left-[40%] bg-gradient-to-b from-transparent via-[hsl(var(--cyan)/0.4)] to-transparent"
          animate={{ y: ['-100%', '500%'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
        />
      </div>

      {/* Right side animated gradient elements */}
      <div className="fixed right-0 top-0 w-1/3 h-full pointer-events-none -z-[5] overflow-hidden">
        <motion.div
          className="absolute w-[300px] h-[500px] -right-20 top-[20%] rounded-full blur-[100px]"
          animate={{
            background: [
              'radial-gradient(circle, hsl(var(--pink) / 0.25) 0%, transparent 70%)',
              'radial-gradient(circle, hsl(var(--yellow) / 0.2) 0%, transparent 70%)',
              'radial-gradient(circle, hsl(var(--cyan) / 0.2) 0%, transparent 70%)',
              'radial-gradient(circle, hsl(var(--pink) / 0.25) 0%, transparent 70%)',
            ],
            y: [0, -60, 50, 0],
          }}
          transition={{ duration: 11, delay: 1, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[200px] h-[400px] right-10 top-[55%] rounded-full blur-[80px]"
          animate={{
            background: [
              'radial-gradient(circle, hsl(var(--emerald) / 0.2) 0%, transparent 70%)',
              'radial-gradient(circle, hsl(var(--yellow) / 0.18) 0%, transparent 70%)',
              'radial-gradient(circle, hsl(var(--pink) / 0.18) 0%, transparent 70%)',
              'radial-gradient(circle, hsl(var(--emerald) / 0.2) 0%, transparent 70%)',
            ],
            y: [0, 50, -40, 0],
          }}
          transition={{ duration: 13, delay: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Vertical animated line - right */}
        <motion.div
          className="absolute w-[2px] h-[200px] right-[35%] bg-gradient-to-b from-transparent via-[hsl(var(--pink)/0.4)] to-transparent"
          animate={{ y: ['500%', '-100%'] }}
          transition={{ duration: 7, delay: 2, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
        />
      </div>

      <section className="section-padding pt-32 pb-24 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <span className="badge-tag text-[10px] mb-4 inline-block">PRICING</span>
            <h1 className="text-2xl md:text-4xl font-extrabold mb-5 font-display tracking-tight">
              One Plan, <span className="gradient-text">Full Access</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
              No subscriptions, no recurring fees. Pay once and get lifetime access to everything.
            </p>
          </motion.div>

          {/* Pricing Card — Full-width stacked horizontal */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            {/* Giant centered price hero */}
            <div className="text-center mb-10">
              <div className="badge-pro inline-flex items-center gap-1.5 px-5 py-2 mb-6">
                <Crown className="w-4 h-4" /> LIFETIME PRO
              </div>

              <div className="flex items-baseline justify-center gap-3 mb-2">
                {appliedDiscount && (
                  <span className="text-3xl font-bold text-muted-foreground line-through font-display">
                    {isLocalCurrency && geoPricing ? `${geoPricing.symbol}${Math.round(basePriceUsd * geoRate)}` : `$${basePriceUsd}`}
                  </span>
                )}
                <span className="text-8xl md:text-9xl font-extrabold text-foreground leading-none" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>{displayPrice}</span>
              </div>

              {isLocalCurrency && (
                <p className="text-sm text-muted-foreground mb-1">≈ ${finalPriceUsd % 1 === 0 ? finalPriceUsd : finalPriceUsd.toFixed(2)} USD</p>
              )}

              {appliedDiscount && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[hsl(var(--emerald)/0.15)] border border-[hsl(var(--emerald)/0.3)]"
                >
                  <Tag className="w-3.5 h-3.5 text-[hsl(var(--emerald))]" />
                  <span className="text-sm font-semibold text-[hsl(var(--emerald))]">
                    {appliedDiscount.percent > 0 ? `${appliedDiscount.percent}% off` : `$${appliedDiscount.amount} off`} — {appliedDiscount.code}
                  </span>
                  <button onClick={removeDiscount} className="ml-1 hover:text-foreground transition-colors">
                    <X className="w-3.5 h-3.5 text-[hsl(var(--emerald))]" />
                  </button>
                </motion.div>
              )}

              <div className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[hsl(var(--emerald)/0.1)] border border-[hsl(var(--emerald)/0.25)]">
                <span className="w-2 h-2 rounded-full bg-[hsl(var(--emerald))] animate-pulse" />
                <span className="text-sm font-semibold text-[hsl(var(--emerald))]">One-time payment · Forever yours</span>
              </div>
            </div>

            {/* Features row */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
              {features.map((f, i) => (
                <motion.div
                  key={f}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="glass-card p-4 text-center hover:border-primary/25 transition-colors"
                >
                  <Check className="w-5 h-5 text-primary mx-auto mb-2" />
                  <span className="text-xs font-medium text-foreground">{f}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA area */}
            <div className="max-w-md mx-auto">
              {/* Discount */}
              {!appliedDiscount && (
                <div className="mb-4">
                  <div className="flex gap-2">
                    <input
                      value={discountCode}
                      onChange={e => { setDiscountCode(e.target.value.toUpperCase()); setDiscountError(''); }}
                      placeholder="Discount code"
                      className="flex-1 px-4 py-3 rounded-xl bg-card/60 border border-border/40 text-foreground text-sm focus:outline-none focus:border-primary/40 transition-all uppercase placeholder:normal-case backdrop-blur-xl"
                    />
                    <button
                      onClick={handleApplyDiscount}
                      disabled={checkingCode || !discountCode.trim()}
                      className="px-6 py-3 rounded-xl bg-muted/50 border border-border/50 text-foreground text-sm font-medium hover:bg-muted/70 transition-all disabled:opacity-50"
                    >
                      {checkingCode ? '...' : 'Apply'}
                    </button>
                  </div>
                  {discountError && (
                    <p className="text-xs text-destructive mt-1.5">{discountError}</p>
                  )}
                </div>
              )}

              <button
                onClick={async () => {
                  if (!user) {
                    navigate('/auth?mode=signup&redirect=pricing');
                    return;
                  }
                  setCheckoutLoading(true);
                  try {
                    const { data, error } = await supabase.functions.invoke('create-checkout', {
                      body: {
                        return_url: window.location.origin + '/payment-success',
                        discount_code: appliedDiscount?.code || '',
                      },
                    });
                    if (error || !data?.checkout_url) {
                      toast.error('Failed to start checkout. Please try again.');
                      console.error('Checkout error:', error, data);
                      return;
                    }
                    window.location.href = data.checkout_url;
                  } catch (err) {
                    toast.error('Something went wrong. Please try again.');
                    console.error(err);
                  } finally {
                    setCheckoutLoading(false);
                  }
                }}
                disabled={checkoutLoading}
                className="glow-button flex items-center justify-center gap-2 w-full py-5 rounded-2xl font-bold text-base tracking-wide disabled:opacity-70"
              >
                {checkoutLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Get Lifetime Access — ${displayPrice}`
                )}
              </button>
              <p className="text-muted-foreground/50 text-xs mt-4 text-center">No hidden fees · No subscriptions · Instant access</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing FAQ */}
      <PricingFAQ basePriceUsd={basePriceUsd} />

      <Footer />
    </div>
  );
};

export default Pricing;
