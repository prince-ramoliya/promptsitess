import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DollarSign } from 'lucide-react';

interface PricingConfig {
  id: string;
  base_price_usd: number;
  updated_at: string;
}

const AdminPricing = () => {
  const [config, setConfig] = useState<PricingConfig | null>(null);
  const [price, setPrice] = useState('19');
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    const { data } = await supabase.from('pricing_config').select('*').limit(1).single();
    if (data) {
      setConfig(data as PricingConfig);
      setPrice(String(data.base_price_usd));
    }
  };

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('admin-pricing')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pricing_config' }, () => fetchData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleSavePrice = async () => {
    if (!config) return;
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) { toast.error('Enter a valid price'); return; }
    setSaving(true);
    const { error } = await supabase
      .from('pricing_config')
      .update({ base_price_usd: numPrice, updated_at: new Date().toISOString() } as any)
      .eq('id', config.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success('Price updated! Changes are live.');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-8">Pricing Management</h1>

      {/* Base Price Card */}
      <div className="glass-card p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" /> Base Price
        </h3>
        <div className="flex items-end gap-4">
          <div className="flex-1 max-w-xs">
            <label className="text-xs text-muted-foreground mb-1 block">Price (USD)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                step="0.01"
                min="0"
                className="w-full pl-7 pr-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>
          <button onClick={handleSavePrice} disabled={saving} className="glow-button text-sm !px-6 !py-2.5 disabled:opacity-50">
            {saving ? 'Saving...' : 'Update Price'}
          </button>
        </div>
        {config && (
          <p className="text-xs text-muted-foreground mt-2">
            Last updated: {new Date(config.updated_at).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminPricing;
