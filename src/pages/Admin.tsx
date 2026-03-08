import { useEffect, useState } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LayoutGrid, FolderOpen, LogOut, MessageSquarePlus } from 'lucide-react';
import logo from '@/assets/logo.png';

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  );

  if (!user || !isAdmin) return null;

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutGrid, exact: true },
    { path: '/admin/components', label: 'Components', icon: LayoutGrid },
    { path: '/admin/categories', label: 'Categories', icon: FolderOpen },
    { path: '/admin/suggestions', label: 'Suggestions', icon: MessageSquarePlus },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/50 bg-card/30 flex flex-col">
        <div className="p-6 border-b border-border/50">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="PromptSites" className="w-8 h-8 object-contain" />
            <span className="font-bold text-foreground">PromptSites</span>
          </Link>
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

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Admin;
