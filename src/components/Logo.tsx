import { Link } from 'react-router-dom';
import logoMark from '@/assets/logo-mark.png';

interface LogoProps {
  className?: string;
  linkTo?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
  sm: { text: 'text-lg', icon: 22 },
  md: { text: 'text-xl', icon: 28 },
  lg: { text: 'text-2xl', icon: 34 },
};

const Logo = ({ className = '', linkTo = '/', size = 'md' }: LogoProps) => {
  const config = sizeConfig[size];

  const content = (
    <span className={`inline-flex items-center gap-2 font-extrabold font-display tracking-tight ${config.text} ${className}`}>
      <img
        src={logoMark}
        alt="PromptSites"
        width={config.icon}
        height={config.icon}
        className="flex-shrink-0"
      />
      <span>
        <span className="text-foreground">Prompt</span>
        <span className="text-primary font-accent">Sites</span>
      </span>
    </span>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="transition-transform duration-300 hover:scale-105 active:scale-95">
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
