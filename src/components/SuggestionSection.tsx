import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Send, MessageSquarePlus, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';

const SuggestionSection = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !message.trim()) return;

    const trimmed = message.trim();
    if (trimmed.length > 500) {
      toast.error('Suggestion must be under 500 characters.');
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from('suggestions').insert({
      user_id: user.id,
      user_email: user.email,
      message: trimmed,
    });
    setSubmitting(false);

    if (error) {
      toast.error('Failed to submit suggestion.');
    } else {
      toast.success('Thank you! Your suggestion has been submitted.');
      setMessage('');
    }
  };

  return (
    <section className="py-16 md:py-24 px-5 sm:px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 badge-tag mb-4">
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span className="text-xs sm:text-sm">We'd love your ideas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground font-display mb-3">
            Drop a <span className="gradient-text">Suggestion</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
            Have a component idea or feature request? Let us know and we'll build it for the community.
          </p>
        </motion.div>

        {user ? (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-5 sm:p-6 text-left"
          >
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe the component or feature you'd love to see..."
              maxLength={500}
              className="bg-background/50 border-border/50 focus:border-primary/50 min-h-[100px] resize-none text-sm"
            />
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-muted-foreground">{message.length}/500</span>
              <button
                type="submit"
                disabled={submitting || !message.trim()}
                className="glow-button text-sm flex items-center gap-2 !px-5 !py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Sending...' : 'Submit'} <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-8 flex flex-col items-center gap-4"
          >
            <LogIn className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Please log in to submit a suggestion.</p>
            <Link to="/auth" className="glow-button text-sm !px-5 !py-2 flex items-center gap-2">
              Log In to Continue
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default SuggestionSection;
