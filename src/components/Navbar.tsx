import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Home, BookOpen, Tag, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Logo from '@/components/Logo';

const navItems = [
{ path: '/', label: 'Home', icon: <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
{ path: '/library', label: 'Library', icon: <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
{ path: '/pricing', label: 'Pricing', icon: <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> }];


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
        
      {/* Mobile layout: logo centered with top margin */}
      <div className="flex md:hidden items-center justify-center px-4 h-12 my-[18px] py-[36px]">
        <Link to="/" className="transition-transform duration-300 hover:scale-105 active:scale-95">
          <img src={logo} alt="PromptSites" className="h-6 object-contain" />
        </Link>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex max-w-7xl mx-auto px-6 h-20 items-center justify-between">
        <Link to="/" className="group transition-transform duration-300 hover:scale-105 active:scale-95">
          <img src={logo} alt="PromptSites" className="h-7 object-contain" />
        </Link>

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
          {isAdmin &&
            <Link
              to="/admin"
              className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
              isActive('/admin') ?
              'bg-accent/10 text-accent' :
              'text-accent/70 hover:text-accent hover:bg-accent/5'}`
              }>
              
              Admin
            </Link>
            }
        </div>

        <div className="flex items-center gap-3">
          {user ?
            <>
              <span className="text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/30">
                {user.email}
              </span>
              <button
                onClick={signOut}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
                
                Log Out
              </button>
            </> :

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
            }
        </div>
      </div>
    </nav>

    {/* Mobile bottom nav — independent fixed position */}
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