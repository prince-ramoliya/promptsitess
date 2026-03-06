import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Zap, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/60 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground font-display tracking-tight">PromptLab</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">Home</Link>
          <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">Pricing</Link>
          <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">How It Works</Link>
          {isAdmin && (
            <Link to="/admin" className="text-sm text-primary hover:text-primary/80 transition-colors duration-300 font-medium">Admin</Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <button onClick={signOut} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">Log Out</button>
            </>
          ) : (
            <>
              <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">Log In</Link>
              <Link to="/auth?mode=signup" className="glow-button text-sm !px-5 !py-2">Get Started</Link>
            </>
          )}
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border/30 bg-background/95 backdrop-blur-2xl p-6 space-y-4">
          <Link to="/" onClick={() => setMobileOpen(false)} className="block text-sm text-muted-foreground">Home</Link>
          <Link to="/pricing" onClick={() => setMobileOpen(false)} className="block text-sm text-muted-foreground">Pricing</Link>
          <Link to="/how-it-works" onClick={() => setMobileOpen(false)} className="block text-sm text-muted-foreground">How It Works</Link>
          {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="block text-sm text-primary font-medium">Admin</Link>}
          {user ? (
            <button onClick={() => { signOut(); setMobileOpen(false); }} className="text-sm text-muted-foreground">Log Out</button>
          ) : (
            <Link to="/auth" onClick={() => setMobileOpen(false)} className="glow-button text-sm inline-block !px-5 !py-2">Get Started</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
