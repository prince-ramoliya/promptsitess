import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Zap, Menu, X, Home, BookOpen, Tag, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `text-sm font-medium transition-all duration-300 relative ${
      isActive(path)
        ? 'text-foreground'
        : 'text-muted-foreground hover:text-foreground'
    }`;

  const activeDot = (path: string) =>
    isActive(path) ? (
      <motion.div
        layoutId="nav-dot"
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    ) : null;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow duration-300">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">PromptSites</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1.5 bg-card/40 backdrop-blur-xl border border-border/30 rounded-full px-2 py-2">
          {[
            { path: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
            { path: '/library', label: 'Library', icon: <BookOpen className="w-4 h-4" /> },
            { path: '/pricing', label: 'Pricing', icon: <Tag className="w-4 h-4" /> },
          ].map(({ path, label, icon }) => (
            <Link
              key={path}
              to={path}
              className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                isActive(path)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
              }`}
            >
              <span className="flex items-center gap-2">
                {icon}
                {label}
              </span>
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                isActive('/admin')
                  ? 'bg-accent/10 text-accent'
                  : 'text-accent/70 hover:text-accent hover:bg-accent/5'
              }`}
            >
              Admin
            </Link>
          )}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/30">
                {user.email}
              </span>
              <button
                onClick={signOut}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 font-medium"
              >
                Log In
              </Link>
              <Link
                to="/auth?mode=signup"
                className="glow-button text-sm !px-5 !py-2 flex items-center gap-1.5"
              >
                Get Started
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground p-2 rounded-xl hover:bg-muted/30 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border/30 bg-background/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="p-6 space-y-2">
              {[
                { path: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
                { path: '/library', label: 'Library', icon: <BookOpen className="w-4 h-4" /> },
                { path: '/pricing', label: 'Pricing', icon: <Tag className="w-4 h-4" /> },
              ].map(({ path, label, icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive(path)
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted/20'
                  }`}
                >
                  {icon}
                  {label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-accent"
                >
                  Admin
                </Link>
              )}
              <div className="pt-4 border-t border-border/30">
                {user ? (
                  <button
                    onClick={() => { signOut(); setMobileOpen(false); }}
                    className="text-sm text-muted-foreground w-full text-left px-4 py-3"
                  >
                    Log Out
                  </button>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setMobileOpen(false)}
                    className="glow-button text-sm block text-center !px-5 !py-3"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
