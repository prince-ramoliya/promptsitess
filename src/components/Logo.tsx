import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  linkTo?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
  sm: { text: 'text-lg', icon: 20 },
  md: { text: 'text-xl', icon: 26 },
  lg: { text: 'text-2xl', icon: 32 },
};

const LogoIcon = ({ size = 26 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="flex-shrink-0"
  >
    <defs>
      <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(217, 91%, 60%)" />
        <stop offset="100%" stopColor="hsl(330, 80%, 62%)" />
      </linearGradient>
    </defs>
    {/* Angular bracket / prompt symbol */}
    <path
      d="M8 8L2 16L8 24"
      stroke="url(#logo-grad)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M24 8L30 16L24 24"
      stroke="url(#logo-grad)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Center slash */}
    <path
      d="M19 6L13 26"
      stroke="url(#logo-grad)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

const Logo = ({ className = '', linkTo = '/', size = 'md' }: LogoProps) => {
  const config = sizeConfig[size];

  const content = (
    <span className={`inline-flex items-center gap-2 font-extrabold font-display tracking-tight ${config.text} ${className}`}>
      <LogoIcon size={config.icon} />
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
