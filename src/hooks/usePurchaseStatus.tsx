import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function usePurchaseStatus() {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsPremium(false);
      setLoading(false);
      return;
    }

    const checkPurchase = async () => {
      const { data } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .limit(1);

      setIsPremium(!!(data && data.length > 0));
      setLoading(false);
    };

    checkPurchase();

    // Listen for realtime changes to purchases
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
        () => checkPurchase()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { isPremium, loading };
}
