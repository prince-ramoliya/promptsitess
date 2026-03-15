import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, CheckCircle, Calendar, CreditCard, Sparkles, Shield, Zap, BookOpen, Copy, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePurchaseStatus } from '@/hooks/usePurchaseStatus';
import Navbar from '@/components/Navbar';

interface PurchaseData {
  id: string;
  purchased_at: string;
  amount: number;
  currency: string;
  status: string;
  user_email: string;
}

const benefits = [
  { icon: <Copy className="w-5 h-5" />, title: 'Unlimited Pro Prompts', desc: 'Copy any prompt including all premium ones' },
  { icon: <Sparkles className="w-5 h-5" />, title: 'Lifetime Access', desc: 'One-time payment, no recurring fees ever' },
  { icon: <Zap className="w-5 h-5" />, title: 'Early Access', desc: 'Get new prompts before anyone else' },
  { icon: <BookOpen className="w-5 h-5" />, title: 'Full Library', desc: 'Access every component in the entire library' },
  { icon: <Shield className="w-5 h-5" />, title: 'Priority Support', desc: 'Get help faster when you need it' },
  { icon: <Star className="w-5 h-5" />, title: 'Future Updates', desc: 'All future prompts included at no extra cost' },
];

const Membership = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isPremium, loading: purchaseLoading } = usePurchaseStatus();
  const [purchase, setPurchase] = useState<PurchaseData | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user || !isPremium) return;
    const fetchPurchase = async () => {
      const { data } = await supabase
        .from('purchases')
        .select('id, purchased_at, amount, currency, status, user_email')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('purchased_at', { ascending: false })
        .limit(1)
        .single();
      if (data) setPurchase(data);
    };
    fetchPurchase();
  }, [user, isPremium]);

  if (authLoading || purchaseLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <Crown className="w-12 h-12 text-[hsl(var(--yellow))] mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">No Active Membership</h1>
            <p className="text-muted-foreground mb-6">Get lifetime access to all pro prompts with a single purchase.</p>
            <button onClick={() => navigate('/pricing')} className="glow-button text-sm !px-6 !py-3">
              Get Lifetime Access
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  const purchaseDate = purchase ? new Date(purchase.purchased_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : '—';

  const formattedAmount = purchase
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: purchase.currency }).format(purchase.amount)
    : '—';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--yellow))]/15 border border-[hsl(var(--yellow))]/30 mb-4">
            <Crown className="w-4 h-4 text-[hsl(var(--yellow))]" />
            <span className="text-sm font-semibold text-[hsl(var(--yellow))]">Pro Member</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display">Your Membership</h1>
        </motion.div>

        {/* Purchase details card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card-hover rounded-2xl p-6 md:p-8 mb-8"
        >
          <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Purchase Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-muted/15 rounded-xl p-4 border border-border/20">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Plan</p>
              <p className="font-semibold text-foreground">Lifetime Pro Access</p>
            </div>
            <div className="bg-muted/15 rounded-xl p-4 border border-border/20">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</p>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span className="font-semibold text-primary">Active</span>
              </div>
            </div>
            <div className="bg-muted/15 rounded-xl p-4 border border-border/20">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Purchase Date</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold text-foreground">{purchaseDate}</span>
              </div>
            </div>
            <div className="bg-muted/15 rounded-xl p-4 border border-border/20">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Amount Paid</p>
              <p className="font-semibold text-foreground">{formattedAmount}</p>
            </div>
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card-hover rounded-2xl p-6 md:p-8"
        >
          <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            What You Get
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-muted/10 border border-border/10"
              >
                <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">{b.icon}</div>
                <div>
                  <p className="font-medium text-sm text-foreground">{b.title}</p>
                  <p className="text-xs text-muted-foreground">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Membership;
