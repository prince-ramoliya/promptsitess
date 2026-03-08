import { useEffect, useState } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LayoutDashboard, LayoutGrid, FolderOpen, LogOut, MessageSquarePlus, DollarSign, Users, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Logo from '@/components/Logo';

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadSuggestions, setUnreadSuggestions] = useState(0);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (!user || !isAdmin) return;

    const fetchUnread = async () => {
      const { count } = await supabase
        .from('suggestions')
        .select('id', { count: 'exact', head: true })
        .eq('is_read', false);
      setUnreadSuggestions(count || 0);
    };
    fetchUnread();

    const channel = supabase
      .channel('admin-sidebar-suggestions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'suggestions' }, () => fetchUnread())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, isAdmin]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  );

  if (!user || !isAdmin) return null;

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { path: '/admin/components', label: 'Components', icon: LayoutGrid },
    { path: '/admin/categories', label: 'Categories', icon: FolderOpen },
    { path: '/admin/suggestions', label: 'Suggestions', icon: MessageSquarePlus, badge: unreadSuggestions },
    { path: '/admin/subscriptions', label: 'Subscriptions', icon: Users },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/admin/pricing', label: 'Pricing', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 border-r border-border/50 bg-card/30 flex flex-col">
        <div className="p-6 border-b border-border/50">
          <Logo size="md" />
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const isActive = item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path) && item.path !== '/admin';
            const isExactActive = item.exact && location.pathname === item.path;
            const active = item.exact ? isExactActive : isActive;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-auto text-[10px] font-bold bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border/50">
          <button onClick={signOut} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground transition-colors w-full">
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Admin;
