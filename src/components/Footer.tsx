import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-border/50 bg-background/50 section-padding !py-12">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
        <span className="font-bold text-foreground">PromptLab</span>
      </Link>
      <div className="flex items-center gap-8">
        <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
        <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
      </div>
      <p className="text-sm text-muted-foreground">© 2026 PromptLab. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
