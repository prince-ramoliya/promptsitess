import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Copy, Sparkles, Layers, Zap } from 'lucide-react';

const platformFeatures = [
  {
    icon: <Copy className="w-5 h-5" />,
    title: 'Copy Any Prompt',
    description: 'Browse components, click copy, and get the exact AI prompt used to build it.',
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: 'Paste & Generate',
    description: 'Drop the prompt into Lovable, Cursor, or Bolt and watch it come to life.',
  },
  {
    icon: <Layers className="w-5 h-5" />,
    title: 'Premium Library',
    description: 'Access 100+ hand-crafted UI components across 50+ categories.',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Ship 10x Faster',
    description: 'Stop writing prompts from scratch. Use battle-tested ones that actually work.',
  },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background subtle glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] sm:h-[500px] rounded-full bg-[hsl(var(--primary)/0.06)] blur-[140px]" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 flex flex-col items-center text-center gap-6 sm:gap-8 pt-28 sm:pt-32">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-border/40 bg-card/40 backdrop-blur-md text-muted-foreground"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Premium UI Prompts for AI Tools
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-foreground font-extrabold leading-[1.1] tracking-tight max-w-[900px] text-4xl sm:text-6xl lg:text-8xl font-display"
        >
          Steal the Prompts Behind{' '}
          <span className="gradient-text-animated">Beautiful</span>{' '}
          <span className="gradient-text">Websites</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-base sm:text-lg max-w-[640px] leading-relaxed"
        >
          Browse premium UI components and copy the exact AI prompts used to build them.
          Paste into Lovable, Cursor, or Bolt to generate instantly.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
        >
          <a href="#gallery" className="glow-button flex items-center gap-2.5 text-sm w-full sm:w-auto justify-center">
            Browse Components <ArrowRight className="w-4 h-4" />
          </a>
          <Link to="/pricing" className="glow-button-outline flex items-center gap-2.5 text-sm w-full sm:w-auto justify-center">
            Get Pro Access
          </Link>
        </motion.div>
      </div>

      {/* Platform Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="relative z-10 w-full max-w-[1100px] mx-auto px-6 mt-16 sm:mt-20 pb-10"
      >
        <div className="bg-card/50 backdrop-blur-xl border border-border/30 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {platformFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                className="flex flex-col gap-3 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-foreground font-semibold text-sm font-display">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
