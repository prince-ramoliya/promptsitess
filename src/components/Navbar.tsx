import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X, Home, BookOpen, Tag, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo.png';

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
      className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl md:bg-transparent md:backdrop-blur-none"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="group transition-transform duration-300 hover:scale-105 active:scale-95">
          <img src={logo} alt="PromptSites" className="h-6 sm:h-7 object-contain" />
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden fixed inset-0 top-0 z-[60] bg-background flex flex-col"
          >
            {/* Mobile menu header */}
            <div className="flex items-center justify-between px-6 h-20 border-b border-border/30">
              <Link to="/" onClick={() => setMobileOpen(false)} className="transition-transform duration-300 hover:scale-105 active:scale-95">
                <img src={logo} alt="PromptSites" className="h-6 object-contain" />
              </Link>
              <button
                className="text-foreground p-2 rounded-xl hover:bg-muted/30 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile menu content */}
            <div className="flex-1 flex flex-col justify-center px-8 space-y-2">
              {[
                { path: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
                { path: '/library', label: 'Library', icon: <BookOpen className="w-5 h-5" /> },
                { path: '/pricing', label: 'Pricing', icon: <Tag className="w-5 h-5" /> },
              ].map(({ path, label, icon }) => (
                <motion.div
                  key={path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Link
                    to={path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-lg font-semibold transition-all ${
                      isActive(path)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted/20 hover:text-foreground'
                    }`}
                  >
                    {icon}
                    {label}
                  </Link>
                </motion.div>
              ))}
              {isAdmin && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-4 px-5 py-4 rounded-2xl text-lg font-semibold text-accent hover:bg-accent/5"
                  >
                    Admin
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Mobile menu footer */}
            <div className="px-8 pb-10 pt-4 border-t border-border/30">
              {user ? (
                <button
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="text-sm text-muted-foreground w-full text-left px-5 py-4"
                >
                  Log Out
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="glow-button text-base block text-center !px-6 !py-4 w-full"
                >
                  Get Started
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
