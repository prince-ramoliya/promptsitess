import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-12 md:pt-32 md:pb-0">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/15 rounded-full blur-[100px] md:blur-[150px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-[20%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-accent/12 rounded-full blur-[80px] md:blur-[130px] animate-glow-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px]" />
      
      {/* Noise texture */}
      <div className="absolute inset-0 noise-bg opacity-50" />

      {/* Hero content */}
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 badge-tag mb-6 md:mb-8"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-xs sm:text-sm">Premium UI Prompts for AI Tools</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-extrabold leading-[1.1] mb-5 md:mb-7 tracking-tight font-display"
        >
          Steal the Prompts
          <br />
          Behind{' '}
          <span className="gradient-text-animated">Beautiful</span>
          <br />
          <span className="gradient-text">Websites</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8 md:mb-12 leading-relaxed px-2"
        >
          Browse premium UI components and copy the exact AI prompts used to build them.
          Paste into Lovable, Cursor, or Bolt to generate instantly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <a href="#gallery" className="glow-button flex items-center gap-2.5 text-sm w-full sm:w-auto justify-center">
            Browse Components <ArrowRight className="w-4 h-4" />
          </a>
          <Link to="/pricing" className="glow-button-outline flex items-center gap-2.5 text-sm w-full sm:w-auto justify-center">
            Get Pro Access
          </Link>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 md:mt-20 flex items-center justify-center gap-8 md:gap-12 text-center"
        >
          {[
            { value: '100+', label: 'Components' },
            { value: '50+', label: 'Categories' },
            { value: '10K+', label: 'Prompts Copied' },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-xl md:text-3xl font-bold text-foreground font-display">{stat.value}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
