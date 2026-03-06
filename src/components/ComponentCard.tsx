import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface ComponentCardProps {
  title: string;
  previewUrl: string | null;
  categoryName?: string;
  tags: string[];
  secretPrompt: string;
  isPro: boolean;
}

const ComponentCard = ({ title, previewUrl, categoryName, tags, secretPrompt, isPro }: ComponentCardProps) => {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { user } = useAuth();

  const handleCopy = async () => {
    if (isPro && !user) {
      toast.error('Sign in to access Pro prompts');
      return;
    }
    try {
      await navigator.clipboard.writeText(secretPrompt);
      setCopied(true);
      toast.success('Prompt copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <motion.div
      className="glass-card-hover group relative overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Preview image */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-muted/30">
        {previewUrl ? (
          <img src={previewUrl} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Preview</span>
          </div>
        )}

        {/* Hover overlay */}
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center"
          >
            <button onClick={handleCopy} className="glow-button flex items-center gap-2 text-sm !px-5 !py-2.5">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Prompt'}
            </button>
          </motion.div>
        )}

        {/* Pro badge */}
        {isPro && (
          <div className="absolute top-3 right-3 badge-pro flex items-center gap-1">
            <Lock className="w-3 h-3" /> PRO
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-foreground text-sm">{title}</h3>
        </div>
        {categoryName && (
          <span className="badge-tag text-[11px] mb-3 inline-block">{categoryName}</span>
        )}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {tags?.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ComponentCard;
