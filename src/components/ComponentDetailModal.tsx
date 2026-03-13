import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Share2, Bookmark, Crown, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import AuthModal from '@/components/AuthModal';

interface ComponentDetailModalProps {
  open: boolean;
  onClose: () => void;
  id?: string;
  title: string;
  previewUrl: string | null;
  secretPrompt: string;
  isPro: boolean;
  isBookmarked?: boolean;
  onToggleBookmark?: (componentId: string) => void;
}

const ComponentDetailModal = ({
  open,
  onClose,
  id,
  title,
  previewUrl,
  secretPrompt,
  isPro,
  isBookmarked,
  onToggleBookmark,
}: ComponentDetailModalProps) => {
  const [copied, setCopied] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  const isPremiumUser = false;
  const canCopy = !isPro || isPremiumUser;

  const isVideo = (url: string) => /\.(mp4|webm|mov|avi)(\?|$)/i.test(url);

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
      if (id) {
        await supabase.from('prompt_copies').insert({
          component_id: id,
          user_id: user.id,
        });
      }
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/library?component=${id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
      }
    } catch {
      // User cancelled share
    }
  };

  const handleBookmark = () => {
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
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="max-w-3xl w-[95vw] p-0 overflow-hidden border-border/30 bg-card/95 backdrop-blur-2xl rounded-2xl gap-0">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          
          {/* Fixed-ratio preview area — always 16:10 regardless of image/video size */}
          <div className="relative w-full overflow-hidden rounded-t-2xl bg-muted/20" style={{ paddingBottom: '62.5%' }}>
            <div className="absolute inset-0">
              {previewUrl ? (
                isVideo(previewUrl) ? (
                  <video src={previewUrl} className="w-full h-full object-cover" muted loop playsInline autoPlay />
                ) : (
                  <img src={previewUrl} alt={title} className="w-full h-full object-cover" />
                )
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/8 via-accent/5 to-cyan/8 flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-muted-foreground/30" />
                </div>
              )}
            </div>
          </div>

          {/* Content — fixed layout, never shifts */}
          <div className="p-6 space-y-4">
            {/* Title + Pro badge */}
            <div className="flex items-center gap-3 min-h-[32px]">
              <h2 className="text-xl font-bold text-foreground tracking-tight flex-1 truncate">{title}</h2>
              {isPro && (
                <span className="flex items-center gap-1 text-[9px] font-extrabold tracking-widest px-2.5 py-1 rounded-full bg-[hsl(var(--yellow))] text-background shadow-[0_0_16px_-4px_hsl(var(--yellow)/0.6)] flex-shrink-0">
                  <Crown className="w-3 h-3" /> PRO
                </span>
              )}
            </div>

            {/* Blurred prompt preview — fixed height */}
            <div className="relative rounded-xl bg-muted/20 border border-border/30 p-4 overflow-hidden h-[100px]">
              <p className="text-sm text-muted-foreground leading-relaxed select-none blur-[6px] line-clamp-4">
                {secretPrompt}
              </p>
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-muted-foreground/70 bg-card/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/30">
                  Copy to reveal prompt
                </span>
              </div>
            </div>

            {/* Action buttons — fixed layout */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCopy}
                className="glow-button flex items-center gap-2 text-sm !px-6 !py-3 flex-1 justify-center"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Prompt'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="p-3 rounded-xl bg-muted/30 border border-border/30 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all flex-shrink-0"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBookmark}
                className={`p-3 rounded-xl border transition-all flex-shrink-0 ${
                  isBookmarked
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-muted/30 border-border/30 text-muted-foreground hover:text-primary hover:border-primary/30'
                }`}
                title="Bookmark"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-primary' : ''}`} />
              </motion.button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default ComponentDetailModal;
