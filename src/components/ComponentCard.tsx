import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Lock, Crown, Sparkles, Bookmark } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/AuthModal';

interface ComponentCardProps {
  id?: string;
  title: string;
  previewUrl: string | null;
  secretPrompt: string;
  isPro: boolean;
  isBookmarked?: boolean;
  onToggleBookmark?: (componentId: string) => void;
}

const ComponentCard = ({ id, title, previewUrl, categoryName, categoryNames, secretPrompt, isPro, isBookmarked, onToggleBookmark }: ComponentCardProps) => {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  const isVideo = (url: string) => /\.(mp4|webm|mov|avi)(\?|$)/i.test(url);
  const isPremiumUser = false;
  const canCopy = !isPro || isPremiumUser;

  const handleCopy = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
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

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (id && onToggleBookmark) {
      onToggleBookmark(id);
    }
  };

  return (
    <>
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
              {!user ? (
                <motion.button
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  onClick={handleCopy}
                  className="glow-button flex items-center gap-2 text-sm !px-6 !py-3"
                >
                  <Lock className="w-4 h-4" />
                  Sign in to Copy
                </motion.button>
              ) : canCopy ? (
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
      </div>

      {/* Card content */}
      <div className="p-5 flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground text-sm font-display truncate">{title}</h3>
            <button
              onClick={handleBookmark}
              className={`flex-shrink-0 p-1 rounded-md transition-all duration-200 ${
                isBookmarked
                  ? 'text-primary hover:text-primary/80'
                  : 'text-muted-foreground/40 hover:text-primary'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-primary' : ''}`} />
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {categoryNames && categoryNames.length > 0 ? (
              categoryNames.map((name) => (
                <span key={name} className="badge-tag text-xs inline-block">{name}</span>
              ))
            ) : categoryName ? (
              <span className="badge-tag text-xs inline-block">{categoryName}</span>
            ) : null}
          </div>
        </div>
        {isPro && (
          <span className="flex items-center gap-1 text-[9px] font-extrabold tracking-widest px-2.5 py-1 rounded-full bg-[hsl(var(--yellow))] text-background shadow-[0_0_16px_-4px_hsl(var(--yellow)/0.6)] flex-shrink-0">
            <Crown className="w-3 h-3" /> PRO
          </span>
        )}
      </div>
    </motion.div>
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default ComponentCard;
