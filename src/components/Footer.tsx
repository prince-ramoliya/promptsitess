import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-border/30 bg-card/20 section-padding !py-12 relative">
    <div className="absolute inset-0 noise-bg opacity-20" />
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
      <Link to="/" className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
          <Zap className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
        <span className="font-bold text-foreground font-display tracking-tight">PromptLab</span>
      </Link>
      <div className="flex items-center gap-8">
        <Link to="/library" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">Library</Link>
        <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">Pricing</Link>
      </div>
      <p className="text-xs text-muted-foreground">© 2026 PromptLab. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
