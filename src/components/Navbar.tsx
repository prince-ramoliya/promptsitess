import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Home, BookOpen, Tag, ChevronRight, LogOut, Settings } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Logo from '@/components/Logo';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/', label: 'Home', icon: <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
  { path: '/library', label: 'Library', icon: <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
  { path: '/pricing', label: 'Pricing', icon: <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
];

const UserMenu = ({ user, isAdmin, signOut }: { user: any; isAdmin: boolean; signOut: () => void }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = user.email ? user.email.slice(0, 2).toUpperCase() : 'U';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full bg-muted/20 border border-border/30 hover:border-primary/30 transition-all duration-300"
      >
        <Avatar className="h-8 w-8 border-2 border-primary/30">
          <AvatarFallback className="bg-primary/15 text-primary text-xs font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-foreground max-w-[120px] truncate hidden lg:block">
          {user.email?.split('@')[0]}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-card/95 backdrop-blur-2xl border border-border/30 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.5)] overflow-hidden z-50"
          >
            <div className="px-4 py-3.5 border-b border-border/20 bg-muted/10">
              <p className="text-sm font-semibold text-foreground truncate">{user.email?.split('@')[0]}</p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
            </div>

            <div className="p-1.5">
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-muted/30 transition-colors"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => { setOpen(false); signOut(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
    <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ?
        'bg-background/60 backdrop-blur-xl border-b border-border/20' :
        'bg-transparent'}`
        }>
        
      {/* Mobile layout */}
      <div className="flex md:hidden items-center justify-between px-4 h-12 my-[18px] py-[36px]">
        <Logo size="md" />
        {user ? (
          <UserMenu user={user} isAdmin={isAdmin} signOut={signOut} />
        ) : (
          <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
            Log In
          </Link>
        )}
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex max-w-7xl mx-auto px-6 h-20 items-center justify-between">
        <Logo size="lg" />

        <div className="flex items-center gap-1.5 bg-card/50 backdrop-blur-2xl border border-border/40 rounded-full px-2 py-2 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.05)_inset]">
          {navItems.map(({ path, label, icon }) =>
            <Link
              key={path}
              to={path}
              className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              isActive(path) ?
              'bg-primary/10 text-primary' :
              'text-muted-foreground hover:text-foreground hover:bg-muted/30'}`
              }>
              <span className="flex items-center gap-2">
                {icon}
                {label}
              </span>
            </Link>
            )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <UserMenu user={user} isAdmin={isAdmin} signOut={signOut} />
          ) : (
            <>
              <Link
                to="/auth"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 font-medium">
                Log In
              </Link>
              <Link
                to="/auth?mode=signup"
                className="glow-button text-sm !px-5 !py-2 flex items-center gap-1.5">
                Get Started
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>

    {/* Mobile bottom nav */}
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-[60] flex justify-center">
      <div className="flex items-center gap-1 bg-card/60 backdrop-blur-2xl border border-border/30 rounded-full px-2 py-2 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)]">
        {navItems.map(({ path, label, icon }) =>
          <Link
            key={path}
            to={path}
            className={`relative px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
            isActive(path) ?
            'bg-primary/15 text-primary' :
            'text-muted-foreground hover:text-foreground'}`
            }>
            <span className="flex items-center gap-1.5">
              {icon}
              {label}
            </span>
          </Link>
          )}
      </div>
    </div>
    </>);
};

export default Navbar;