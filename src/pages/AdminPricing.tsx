import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DollarSign, Plus, Trash2, X, Pencil, Tag, ToggleLeft, ToggleRight } from 'lucide-react';

interface PricingConfig {
  id: string;
  base_price_usd: number;
  updated_at: string;
}

interface DiscountCode {
  id: string;
  code: string;
  discount_percent: number;
  discount_amount: number;
  is_active: boolean;
  max_uses: number | null;
  current_uses: number;
  expires_at: string | null;
  created_at: string;
}

const AdminPricing = () => {
  const [config, setConfig] = useState<PricingConfig | null>(null);
  const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
  const [price, setPrice] = useState('19');
  const [saving, setSaving] = useState(false);

  // Discount form
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DiscountCode | null>(null);
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  const fetchData = async () => {
    const [configRes, discountRes] = await Promise.all([
      supabase.from('pricing_config').select('*').limit(1).single(),
      supabase.from('discount_codes').select('*').order('created_at', { ascending: false }),
    ]);
    if (configRes.data) {
      setConfig(configRes.data as PricingConfig);
      setPrice(String(configRes.data.base_price_usd));
    }
    if (discountRes.data) setDiscounts(discountRes.data as DiscountCode[]);
  };

  useEffect(() => {
    fetchData();

    // Realtime subscriptions
    const channel = supabase
      .channel('admin-pricing')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pricing_config' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'discount_codes' }, () => fetchData())
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

  const resetForm = () => {
    setCode(''); setDiscountPercent(''); setDiscountAmount(''); setMaxUses(''); setExpiresAt('');
    setEditing(null); setShowForm(false);
  };

  const handleSaveDiscount = async () => {
    if (!code.trim()) { toast.error('Code is required'); return; }
    const pct = parseInt(discountPercent) || 0;
    const amt = parseFloat(discountAmount) || 0;
    if (pct === 0 && amt === 0) { toast.error('Set either a percentage or fixed discount'); return; }

    const payload: any = {
      code: code.trim().toUpperCase(),
      discount_percent: pct,
      discount_amount: amt,
      max_uses: maxUses ? parseInt(maxUses) : null,
      expires_at: expiresAt || null,
    };

    if (editing) {
      const { error } = await supabase.from('discount_codes').update(payload).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Discount updated!');
    } else {
      const { error } = await supabase.from('discount_codes').insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success('Discount created!');
    }
    resetForm();
  };

  const toggleActive = async (d: DiscountCode) => {
    const { error } = await supabase
      .from('discount_codes')
      .update({ is_active: !d.is_active } as any)
      .eq('id', d.id);
    if (error) toast.error(error.message);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('discount_codes').delete().eq('id', id);
    if (error) toast.error(error.message);
    else toast.success('Discount deleted');
  };

  const startEdit = (d: DiscountCode) => {
    setEditing(d);
    setCode(d.code);
    setDiscountPercent(String(d.discount_percent || ''));
    setDiscountAmount(String(d.discount_amount || ''));
    setMaxUses(d.max_uses ? String(d.max_uses) : '');
    setExpiresAt(d.expires_at ? d.expires_at.slice(0, 16) : '');
    setShowForm(true);
  };

  const currentPrice = config ? Number(config.base_price_usd) : 19;

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-8">Pricing Management</h1>

      {/* Base Price Card */}
      <div className="glass-card p-6 mb-8">
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

      {/* Discount Codes Section */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Tag className="w-4 h-4 text-primary" /> Discount Codes
        </h3>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="glow-button text-sm !px-5 !py-2 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Discount
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-foreground text-sm">{editing ? 'Edit Discount' : 'New Discount'}</h4>
            <button onClick={resetForm}><X className="w-4 h-4 text-muted-foreground" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Code *</label>
              <input
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="LAUNCH50"
                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50 uppercase"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Discount % (e.g. 50 for 50% off)</label>
              <input
                type="number"
                value={discountPercent}
                onChange={e => setDiscountPercent(e.target.value)}
                placeholder="0"
                min="0"
                max="100"
                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Or fixed discount ($)</label>
              <input
                type="number"
                value={discountAmount}
                onChange={e => setDiscountAmount(e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Max uses (leave empty for unlimited)</label>
              <input
                type="number"
                value={maxUses}
                onChange={e => setMaxUses(e.target.value)}
                placeholder="Unlimited"
                min="1"
                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Expires at (optional)</label>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={e => setExpiresAt(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50"
              />
            </div>
            <div className="flex items-end">
              {discountPercent && Number(discountPercent) > 0 && (
                <p className="text-sm text-muted-foreground">
                  Final price: <span className="text-foreground font-semibold">${(currentPrice * (1 - Number(discountPercent) / 100)).toFixed(2)}</span>
                </p>
              )}
              {discountAmount && Number(discountAmount) > 0 && !discountPercent && (
                <p className="text-sm text-muted-foreground">
                  Final price: <span className="text-foreground font-semibold">${Math.max(0, currentPrice - Number(discountAmount)).toFixed(2)}</span>
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button onClick={handleSaveDiscount} className="glow-button text-sm !px-8 !py-2.5">Save Discount</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {discounts.map(d => {
          const discountLabel = d.discount_percent > 0 ? `${d.discount_percent}% off` : `$${d.discount_amount} off`;
          const finalPrice = d.discount_percent > 0
            ? (currentPrice * (1 - d.discount_percent / 100)).toFixed(2)
            : Math.max(0, currentPrice - Number(d.discount_amount)).toFixed(2);
          const isExpired = d.expires_at && new Date(d.expires_at) < new Date();
          const isMaxed = d.max_uses !== null && d.current_uses >= d.max_uses;

          return (
            <div key={d.id} className="glass-card px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm font-bold text-foreground bg-muted/50 px-3 py-1 rounded-lg">{d.code}</span>
                <span className="text-sm text-muted-foreground">{discountLabel}</span>
                <span className="text-xs text-muted-foreground">→ ${finalPrice}</span>
                {d.max_uses !== null && (
                  <span className="text-xs text-muted-foreground">{d.current_uses}/{d.max_uses} uses</span>
                )}
                {isExpired && <span className="text-[10px] px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">Expired</span>}
                {isMaxed && <span className="text-[10px] px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">Maxed</span>}
                {!isExpired && !isMaxed && d.is_active && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[hsl(var(--emerald)/0.1)] text-[hsl(var(--emerald))] font-medium">Active</span>
                )}
                {!d.is_active && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">Inactive</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleActive(d)} className="p-2 rounded-lg hover:bg-muted/50 transition-colors" title={d.is_active ? 'Deactivate' : 'Activate'}>
                  {d.is_active
                    ? <ToggleRight className="w-5 h-5 text-[hsl(var(--emerald))]" />
                    : <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                  }
                </button>
                <button onClick={() => startEdit(d)} className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <Pencil className="w-4 h-4 text-muted-foreground" />
                </button>
                <button onClick={() => handleDelete(d.id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>
          );
        })}
        {discounts.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No discount codes yet.</p>}
      </div>
    </div>
  );
};

export default AdminPricing;
