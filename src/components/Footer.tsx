import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';
import { Zap } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-border/30 bg-card/20 section-padding !py-12 relative">
    <div className="absolute inset-0 noise-bg opacity-20" />
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
      <Link to="/">
        <img src={logo} alt="PromptSites" className="h-8 object-contain" />
      </Link>
      <div className="flex items-center gap-8">
        <Link to="/library" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">Library</Link>
        <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">Pricing</Link>
      </div>
      <p className="text-xs text-muted-foreground">© 2026 PromptSites. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
