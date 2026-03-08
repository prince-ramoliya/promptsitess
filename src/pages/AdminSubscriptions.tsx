import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Users, Trash2, Clock, DollarSign, Mail, Phone, User, Search } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Purchase {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone: string | null;
  amount: number;
  currency: string;
  status: string;
  purchased_at: string;
  created_at: string;
}

const AdminSubscriptions = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPurchases = async () => {
    const { data } = await supabase
      .from('purchases')
      .select('*')
      .order('purchased_at', { ascending: false });
    setPurchases((data as Purchase[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPurchases();

    const channel = supabase
      .channel('admin-purchases')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'purchases' }, () => fetchPurchases())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const { error } = await supabase.from('purchases').delete().eq('id', id);
    if (error) {
      toast.error('Failed to remove purchase');
    } else {
      toast.success('Purchase removed');
    }
    setDeleting(null);
  };

  const filtered = purchases.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.user_name.toLowerCase().includes(q) ||
      p.user_email.toLowerCase().includes(q) ||
      (p.user_phone && p.user_phone.includes(q))
    );
  });

  const totalRevenue = purchases.reduce((sum, p) => sum + Number(p.amount), 0);

  if (loading) return <p className="text-muted-foreground">Loading purchases...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Subscriptions</h2>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
            {purchases.length} members
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{purchases.length}</p>
            <p className="text-xs text-muted-foreground">Total Purchases</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">${totalRevenue.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/30 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-all text-sm"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <Users className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {search ? 'No matching purchases found.' : 'No purchases yet. Members will appear here when they make a purchase.'}
          </p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Member</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Contact</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Amount</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Date</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{p.user_name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          {p.user_email || '—'}
                        </div>
                        {p.user_phone && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            {p.user_phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-foreground">
                        ${Number(p.amount).toFixed(2)}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">{p.currency}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {format(new Date(p.purchased_at), 'MMM d, yyyy')}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        p.status === 'active'
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deleting === p.id}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                        title="Remove purchase"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubscriptions;
