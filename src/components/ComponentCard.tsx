import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Lock, Sparkles } from 'lucide-react';
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

  const isVideo = (url: string) => /\.(mp4|webm|mov|avi)(\?|$)/i.test(url);
  // TODO: Replace with real premium check when subscription is added
  const isPremiumUser = false;
  const canCopy = !isPro || isPremiumUser;

  const handleCopy = async () => {
    if (!canCopy) {
      toast.error('Upgrade to Pro to access this prompt');
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
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
    >
      {/* Preview */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-muted/20">
        {previewUrl ? (
          isVideo(previewUrl) ? (
            <video src={previewUrl} className="w-full h-full object-cover" muted loop playsInline autoPlay />
          ) : (
            <img src={previewUrl} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          )
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/8 via-accent/5 to-cyan/8 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-muted-foreground/30" />
          </div>
        )}

        {/* Hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center"
            >
              {canCopy ? (
                <motion.button
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  onClick={handleCopy}
                  className="glow-button flex items-center gap-2 text-sm !px-6 !py-3"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Prompt'}
                </motion.button>
               ) : (
                 <motion.div
                   initial={{ scale: 0.9 }}
                   animate={{ scale: 1 }}
                   className="flex flex-col items-center gap-2"
                 >
                   <Lock className="w-6 h-6 text-primary" />
                   <span className="text-sm text-foreground font-medium">Pro Content Locked</span>
                   <span className="text-xs text-muted-foreground">This is a premium prompt</span>
                 </motion.div>
               )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pro badge */}
        {isPro && (
          <div className="absolute top-3 right-3 badge-pro flex items-center gap-1 text-[10px]">
            <Lock className="w-3 h-3" /> PRO
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="p-5">
        <h3 className="font-semibold text-foreground text-sm mb-2 font-display">{title}</h3>
        {categoryName && (
          <span className="badge-tag text-xs mb-3 inline-block">{categoryName}</span>
        )}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {tags?.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] px-2.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground border border-border/30">{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ComponentCard;
