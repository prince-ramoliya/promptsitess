import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LayoutDashboard, FolderOpen, Copy, TrendingUp, DollarSign, Users } from 'lucide-react';

interface CopyStats {
  component_id: string;
  title: string;
  copy_count: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState({ components: 0, categories: 0, totalCopies: 0, totalRevenue: 0, totalPurchases: 0 });
  const [topCopied, setTopCopied] = useState<CopyStats[]>([]);

  const fetchStats = async () => {
    const [comps, cats, copies, components, purchases] = await Promise.all([
      supabase.from('components').select('id', { count: 'exact', head: true }),
      supabase.from('categories').select('id', { count: 'exact', head: true }),
      supabase.from('prompt_copies').select('component_id'),
      supabase.from('components').select('id, title'),
      supabase.from('purchases').select('amount'),
    ]);

    const copyData = copies.data || [];
    const compMap = new Map((components.data || []).map((c: any) => [c.id, c.title]));
    const purchaseData = purchases.data || [];

    const countMap = new Map<string, number>();
    copyData.forEach((c: any) => {
      countMap.set(c.component_id, (countMap.get(c.component_id) || 0) + 1);
    });

    const topList: CopyStats[] = Array.from(countMap.entries())
      .map(([id, count]) => ({ component_id: id, title: compMap.get(id) || 'Unknown', copy_count: count }))
      .sort((a, b) => b.copy_count - a.copy_count)
      .slice(0, 10);

    const totalRevenue = purchaseData.reduce((sum: number, p: any) => sum + Number(p.amount), 0);

    setStats({
      components: comps.count || 0,
      categories: cats.count || 0,
      totalCopies: copyData.length,
      totalRevenue,
      totalPurchases: purchaseData.length,
    });
    setTopCopied(topList);
  };

  useEffect(() => {
    fetchStats();

    const channel = supabase
      .channel('dashboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'prompt_copies' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'components' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'purchases' }, () => fetchStats())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground">{stats.components}</p>
            <p className="text-sm text-muted-foreground">Components</p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
            <FolderOpen className="w-6 h-6 text-accent" />
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground">{stats.categories}</p>
            <p className="text-sm text-muted-foreground">Categories</p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Copy className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground">{stats.totalCopies}</p>
            <p className="text-sm text-muted-foreground">Prompt Copies</p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground">${stats.totalRevenue.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Revenue</p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground">{stats.totalPurchases}</p>
            <p className="text-sm text-muted-foreground">Purchases</p>
          </div>
        </div>
      </div>

      {/* Top Copied Components */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Most Copied Components</h2>
        </div>
        {topCopied.length === 0 ? (
          <p className="text-sm text-muted-foreground">No copy data yet. Copies will appear here in real time.</p>
        ) : (
          <div className="space-y-2">
            {topCopied.map((item, i) => (
              <div key={item.component_id} className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-muted-foreground w-6 text-center">{i + 1}</span>
                  <span className="text-sm font-medium text-foreground">{item.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground tabular-nums">{item.copy_count}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
