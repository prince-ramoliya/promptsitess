import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  BarChart3, LayoutGrid, FolderOpen, Users, DollarSign, Copy, TrendingUp, Crown, Sparkles
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface CopyStats {
  component_id: string;
  title: string;
  copy_count: number;
}

interface AnalyticsData {
  totalComponents: number;
  totalCategories: number;
  totalPurchases: number;
  totalRevenue: number;
  totalCopies: number;
  topCopied: CopyStats[];
  copiesPerDay: { date: string; copies: number }[];
  purchasesPerDay: { date: string; purchases: number }[];
  categoryDistribution: { name: string; count: number }[];
}

const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(262, 80%, 60%)',
  'hsl(190, 80%, 50%)',
  'hsl(45, 90%, 55%)',
  'hsl(340, 75%, 55%)',
  'hsl(160, 70%, 45%)',
  'hsl(20, 85%, 55%)',
];

const AdminAnalytics = () => {
  const [data, setData] = useState<AnalyticsData>({
    totalComponents: 0,
    totalCategories: 0,
    totalPurchases: 0,
    totalRevenue: 0,
    totalCopies: 0,
    topCopied: [],
    copiesPerDay: [],
    purchasesPerDay: [],
    categoryDistribution: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    const [compsRes, catsRes, purchasesRes, copiesRes, compCatsRes, allComps, allCats] = await Promise.all([
      supabase.from('components').select('id', { count: 'exact', head: true }),
      supabase.from('categories').select('id', { count: 'exact', head: true }),
      supabase.from('purchases').select('*'),
      supabase.from('prompt_copies').select('component_id, created_at'),
      supabase.from('component_categories').select('category_id'),
      supabase.from('components').select('id, title'),
      supabase.from('categories').select('id, name'),
    ]);

    const purchases = purchasesRes.data || [];
    const copies = copiesRes.data || [];
    const compMap = new Map((allComps.data || []).map((c: any) => [c.id, c.title]));
    const catMap = new Map((allCats.data || []).map((c: any) => [c.id, c.name]));

    // Copy counts per component
    const copyCountMap = new Map<string, number>();
    copies.forEach((c: any) => {
      copyCountMap.set(c.component_id, (copyCountMap.get(c.component_id) || 0) + 1);
    });
    const topCopied = Array.from(copyCountMap.entries())
      .map(([id, count]) => ({ component_id: id, title: compMap.get(id) || 'Unknown', copy_count: count }))
      .sort((a, b) => b.copy_count - a.copy_count)
      .slice(0, 8);

    // Copies per day (last 14 days)
    const copiesPerDay = getLast14Days(copies.map((c: any) => c.created_at));

    // Purchases per day (last 14 days)
    const purchasesPerDay = getLast14Days(purchases.map((p: any) => p.purchased_at));

    // Category distribution
    const catCountMap = new Map<string, number>();
    (compCatsRes.data || []).forEach((cc: any) => {
      catCountMap.set(cc.category_id, (catCountMap.get(cc.category_id) || 0) + 1);
    });
    const categoryDistribution = Array.from(catCountMap.entries())
      .map(([id, count]) => ({ name: catMap.get(id) || 'Unknown', count }))
      .sort((a, b) => b.count - a.count);

    setData({
      totalComponents: compsRes.count || 0,
      totalCategories: catsRes.count || 0,
      totalPurchases: purchases.length,
      totalRevenue: purchases.reduce((s, p: any) => s + Number(p.amount), 0),
      totalCopies: copies.length,
      topCopied,
      copiesPerDay,
      purchasesPerDay: purchasesPerDay.map(d => ({ date: d.date, purchases: d.copies })),
      categoryDistribution,
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalytics();
    const channel = supabase
      .channel('admin-analytics')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'prompt_copies' }, () => fetchAnalytics())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'purchases' }, () => fetchAnalytics())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'components' }, () => fetchAnalytics())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => fetchAnalytics())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'component_categories' }, () => fetchAnalytics())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading analytics...</p>;

  const statCards = [
    { label: 'Components', value: data.totalComponents, icon: LayoutGrid, color: 'bg-primary/10 text-primary' },
    { label: 'Categories', value: data.totalCategories, icon: FolderOpen, color: 'bg-accent/10 text-accent' },
    { label: 'Purchases', value: data.totalPurchases, icon: Users, color: 'bg-green-500/10 text-green-500' },
    { label: 'Revenue', value: `$${data.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'bg-[hsl(var(--yellow))]/10 text-[hsl(var(--yellow))]' },
    { label: 'Prompt Copies', value: data.totalCopies, icon: Copy, color: 'bg-purple-500/10 text-purple-500' },
    { label: 'Most Famous', value: data.topCopied[0]?.title || '—', icon: Crown, color: 'bg-pink-500/10 text-pink-500', small: true },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <BarChart3 className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Real-time
        </span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="glass-card p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className={`font-bold text-foreground truncate ${card.small ? 'text-base' : 'text-2xl'}`}>
                {card.value}
              </p>
              <p className="text-xs text-muted-foreground">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Copies Over Time */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Copy className="w-4 h-4 text-primary" /> Prompt Copies (Last 14 Days)
          </h3>
          {data.copiesPerDay.every(d => d.copies === 0) ? (
            <p className="text-xs text-muted-foreground py-8 text-center">No copy data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.copiesPerDay}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="copies" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Purchases Over Time */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-500" /> Purchases (Last 14 Days)
          </h3>
          {data.purchasesPerDay.every(d => d.purchases === 0) ? (
            <p className="text-xs text-muted-foreground py-8 text-center">No purchase data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.purchasesPerDay}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="purchases" fill="hsl(160, 70%, 45%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Copied Components */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Most Copied Components
          </h3>
          {data.topCopied.length === 0 ? (
            <p className="text-xs text-muted-foreground py-4 text-center">No copy data yet</p>
          ) : (
            <div className="space-y-2">
              {data.topCopied.map((item, i) => {
                const maxCount = data.topCopied[0]?.copy_count || 1;
                return (
                  <div key={item.component_id} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-muted-foreground w-5 text-center">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-foreground truncate">{item.title}</span>
                        <span className="text-xs font-semibold text-muted-foreground tabular-nums ml-2">{item.copy_count}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted/30 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${(item.copy_count / maxCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Category Distribution */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-accent" /> Components by Category
          </h3>
          {data.categoryDistribution.length === 0 ? (
            <p className="text-xs text-muted-foreground py-4 text-center">No category data yet</p>
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie
                    data={data.categoryDistribution}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    strokeWidth={2}
                    stroke="hsl(var(--background))"
                  >
                    {data.categoryDistribution.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {data.categoryDistribution.map((cat, i) => (
                  <div key={cat.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                    <span className="text-xs text-foreground truncate flex-1">{cat.name}</span>
                    <span className="text-xs font-semibold text-muted-foreground tabular-nums">{cat.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function getLast14Days(timestamps: string[]) {
  const days: { date: string; copies: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const count = timestamps.filter(t => t.slice(0, 10) === key).length;
    days.push({ date: label, copies: count });
  }
  return days;
}

export default AdminAnalytics;
