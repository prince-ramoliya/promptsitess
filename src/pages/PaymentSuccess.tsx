import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePurchaseStatus } from '@/hooks/usePurchaseStatus';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(8);
  const { isPremium, loading: purchaseLoading } = usePurchaseStatus();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/library');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  const handleRefresh = async () => {
    if (!user) return;
    setRefreshing(true);
    const { data } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', user.id)
      .in('status', ['active', 'succeeded'])
      .limit(1);

    setRefreshing(false);
    if (data && data.length > 0) {
      toast.success('Membership activated! Redirecting...');
      setTimeout(() => navigate('/library'), 1200);
    } else {
      toast.info('Payment is still processing. Please wait a moment and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-lg"
        >
          {/* Animated checkmark */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="mx-auto mb-6 w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl md:text-4xl font-bold mb-3"
          >
            Payment Successful!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground text-lg mb-2"
          >
            Welcome to <span className="text-primary font-semibold">PromptSites Pro</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-muted-foreground mb-8"
          >
            You now have lifetime access to all premium prompts and components.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col items-center gap-4"
          >
            <Button
              onClick={() => navigate('/library')}
              size="lg"
              className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8"
            >
              <Sparkles className="w-4 h-4" />
              Explore Pro Library
              <ArrowRight className="w-4 h-4" />
            </Button>

            <p className="text-sm text-muted-foreground">
              Redirecting to library in {countdown}s...
            </p>

            {/* Refresh membership status */}
            {!isPremium && !purchaseLoading && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mt-2 px-4 py-2 rounded-xl bg-muted/20 border border-border/30 hover:border-primary/30 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Checking...' : 'Refresh membership status'}
              </motion.button>
            )}

            {isPremium && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-primary font-medium flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Pro membership active
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
