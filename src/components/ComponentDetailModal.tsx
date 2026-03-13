import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Share2, Bookmark, Crown, Sparkles, Link, X } from 'lucide-react';
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

const SharePopup = ({ shareUrl, title, onClose }: { shareUrl: string; title: string; onClose: () => void }) => {
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const socials = [
    {
      name: 'WhatsApp',
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: '#25D366',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    },
    {
      name: 'X (Twitter)',
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: '#000000',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: '#0A66C2',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: '#1877F2',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: 'Telegram',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      color: '#26A5E4',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.97 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-2xl bg-card/95 backdrop-blur-2xl border border-border/30 shadow-2xl p-6 space-y-5"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">Share</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Social buttons */}
        <div className="grid grid-cols-5 gap-3">
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 text-white"
                style={{ backgroundColor: s.color }}
              >
                {s.icon}
              </div>
              <span className="text-[10px] text-muted-foreground font-medium text-center leading-tight">
                {s.name}
              </span>
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border/40" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border/40" />
        </div>

        {/* Copy link section */}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted/20 border border-border/30 overflow-hidden">
            <Link className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-muted-foreground truncate">{shareUrl}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopyLink}
            className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors flex-shrink-0"
          >
            Copy
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

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
  const [showSharePopup, setShowSharePopup] = useState(false);
  const { user } = useAuth();
  const isPremiumUser = false;
  const canCopy = !isPro || isPremiumUser;

  const isVideo = (url: string) => /\.(mp4|webm|mov|avi)(\?|$)/i.test(url);
  const shareUrl = `${window.location.origin}/library?component=${id}`;

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
          
          {/* Preview area — compact, no scroll */}
          <div className="relative w-full h-[40vh] max-h-[360px] overflow-hidden rounded-t-2xl bg-muted/20">
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

          {/* Content */}
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

            {/* Blurred prompt preview */}
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

            {/* Action buttons — always visible */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCopy}
                className="glow-button flex items-center gap-2 text-sm !px-6 !py-3 flex-1 justify-center min-w-0"
              >
                {copied ? <Check className="w-4 h-4 flex-shrink-0" /> : <Copy className="w-4 h-4 flex-shrink-0" />}
                <span className="truncate">{copied ? 'Copied!' : 'Copy Prompt'}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSharePopup(true)}
                className="w-11 h-11 rounded-xl bg-muted/30 border border-border/30 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all flex-shrink-0 flex items-center justify-center"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBookmark}
                className={`w-11 h-11 rounded-xl border transition-all flex-shrink-0 flex items-center justify-center ${
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

      {/* Share popup */}
      <AnimatePresence>
        {showSharePopup && (
          <SharePopup
            shareUrl={shareUrl}
            title={title}
            onClose={() => setShowSharePopup(false)}
          />
        )}
      </AnimatePresence>

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default ComponentDetailModal;
