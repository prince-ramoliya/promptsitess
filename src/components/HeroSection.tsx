import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Copy } from 'lucide-react';
import { useState, useEffect } from 'react';

const rotatingWords = ['Beautiful', 'Stunning', 'Premium', 'Modern', 'Powerful'];

const HeroSection = () => {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 md:pt-32">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[150px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/5 w-[400px] h-[400px] bg-accent/12 rounded-full blur-[130px] animate-glow-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[hsl(var(--cyan))]/8 rounded-full blur-[180px] animate-glow-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px]" />
      
      {/* Noise texture */}
      <div className="absolute inset-0 noise-bg opacity-50" />

      {/* Floating UI elements */}
      <motion.div
        className="absolute top-28 right-[12%] glass-card p-5 w-56 hidden lg:block"
        animate={{ y: [0, -18, 0], rotate: [0, 1, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
            <Copy className="w-4 h-4 text-primary" />
          </div>
          <div className="h-2.5 bg-muted/60 rounded-full w-20" />
        </div>
        <div className="h-16 rounded-xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent mb-3 border border-border/30" />
        <div className="space-y-1.5">
          <div className="h-2 bg-muted/40 rounded-full w-full" />
          <div className="h-2 bg-muted/30 rounded-full w-3/4" />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-36 left-[8%] glass-card p-4 w-44 hidden lg:block"
        animate={{ y: [0, -22, 0], rotate: [0, -1, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      >
        <div className="h-20 rounded-xl bg-gradient-to-br from-accent/15 to-[hsl(var(--cyan))]/15 mb-3 border border-border/30 flex items-center justify-center">
          <Zap className="w-6 h-6 text-accent/50" />
        </div>
        <div className="h-2 bg-muted/40 rounded-full w-2/3" />
      </motion.div>

      <motion.div
        className="absolute top-56 left-[18%] glass-card p-3 w-40 hidden lg:block"
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      >
        <div className="flex gap-2 items-center">
          <div className="w-7 h-7 rounded-lg bg-[hsl(var(--emerald))]/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--emerald))]" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="h-2 bg-muted/40 rounded-full w-full" />
            <div className="h-2 bg-muted/25 rounded-full w-2/3" />
          </div>
        </div>
      </motion.div>

      {/* Hero content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 badge-tag mb-8"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Premium UI Prompts for AI Tools</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] mb-7 tracking-tight font-display"
        >
          Steal the Prompts
          <br />
          Behind{' '}
          <span className="inline-block relative h-[1.1em] align-bottom overflow-hidden" style={{ minWidth: '4ch' }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={rotatingWords[wordIndex]}
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                exit={{ y: '-100%', opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 gradient-text-animated"
              >
                {rotatingWords[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
          <br />
          <span className="gradient-text">Websites</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed"
        >
          Browse premium UI components and copy the exact AI prompts used to build them.
          Paste into Lovable, Cursor, or Bolt to generate instantly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#gallery" className="glow-button flex items-center gap-2.5 text-sm">
            Browse Components <ArrowRight className="w-4 h-4" />
          </a>
          <Link to="/pricing" className="glow-button-outline flex items-center gap-2.5 text-sm">
            Get Pro Access
          </Link>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20 flex items-center justify-center gap-12 text-center"
        >
          {[
            { value: '100+', label: 'Components' },
            { value: '50+', label: 'Categories' },
            { value: '10K+', label: 'Prompts Copied' },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-2xl md:text-3xl font-bold text-foreground font-display">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
