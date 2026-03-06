import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-glow-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan/10 rounded-full blur-[150px] animate-glow-pulse" style={{ animationDelay: '3s' }} />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Floating UI preview elements */}
      <motion.div
        className="absolute top-32 right-[15%] glass-card p-4 w-48 hidden lg:block"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="h-20 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 mb-2" />
        <div className="h-2 bg-muted rounded w-3/4 mb-1" />
        <div className="h-2 bg-muted rounded w-1/2" />
      </motion.div>

      <motion.div
        className="absolute bottom-40 left-[10%] glass-card p-4 w-40 hidden lg:block"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <div className="h-16 rounded-lg bg-gradient-to-br from-accent/20 to-cyan/20 mb-2" />
        <div className="h-2 bg-muted rounded w-2/3" />
      </motion.div>

      <motion.div
        className="absolute top-60 left-[20%] glass-card p-3 w-36 hidden lg:block"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      >
        <div className="flex gap-2 mb-2">
          <div className="w-6 h-6 rounded bg-primary/30" />
          <div className="flex-1">
            <div className="h-2 bg-muted rounded w-full mb-1" />
            <div className="h-2 bg-muted rounded w-2/3" />
          </div>
        </div>
      </motion.div>

      {/* Hero content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 badge-tag mb-8"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Premium UI Prompts for AI Tools</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold leading-tight mb-6"
        >
          Steal the Prompts Behind{' '}
          <span className="gradient-text">Beautiful Websites</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Browse premium UI components and copy the exact AI prompts used to build them.
          Paste into Lovable, Cursor, or Bolt to generate instantly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#gallery" className="glow-button flex items-center gap-2">
            Browse Components <ArrowRight className="w-4 h-4" />
          </a>
          <Link to="/pricing" className="glow-button-outline flex items-center gap-2">
            Get Pro Access
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
