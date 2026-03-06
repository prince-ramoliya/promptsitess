import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LayoutGrid, FolderOpen } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ components: 0, categories: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [comps, cats] = await Promise.all([
        supabase.from('components').select('id', { count: 'exact', head: true }),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
      ]);
      setStats({ components: comps.count || 0, categories: cats.count || 0 });
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <LayoutGrid className="w-6 h-6 text-primary" />
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
      </div>
    </div>
  );
};

export default AdminDashboard;
