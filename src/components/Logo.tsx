import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  linkTo?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
};

const Logo = ({ className = '', linkTo = '/', size = 'md' }: LogoProps) => {
  const content = (
    <span className={`font-extrabold font-display tracking-tight ${sizeClasses[size]} ${className}`}>
      <span className="gradient-text">Prompt</span>
      <span className="text-foreground">Sites</span>
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
