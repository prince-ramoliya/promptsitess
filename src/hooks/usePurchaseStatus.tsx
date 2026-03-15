import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function usePurchaseStatus() {
  const { user, loading: authLoading } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }

    if (!user) {
      setIsPremium(false);
      setLoading(false);
      return;
    }

    let isCancelled = false;

    const checkPurchase = async () => {
      const { data, error } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', user.id)
        .in('status', ['active', 'succeeded'])
        .order('purchased_at', { ascending: false })
        .limit(1);

      if (isCancelled) return;

      if (error) {
        console.error('Failed to check purchase status:', error.message);
        setIsPremium(false);
      } else {
        setIsPremium((data?.length ?? 0) > 0);
      }

      setLoading(false);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void checkPurchase();
      }
    };

    const handleFocus = () => {
      void checkPurchase();
    };

    void checkPurchase();

    const pollId = window.setInterval(() => {
      void checkPurchase();
    }, 5000);

    const channel = supabase
      .channel(`purchase-status-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'purchases',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          void checkPurchase();
        }
      )
      .subscribe();

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      isCancelled = true;
      window.clearInterval(pollId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      supabase.removeChannel(channel);
    };
  }, [authLoading, user?.id]);

  return { isPremium, loading };
}
