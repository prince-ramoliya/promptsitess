import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-150 object-left-top origin-top-left"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260207_050933_33e2620d-09cd-43a2-80ef-4cdbb42f4194.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/80" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 flex flex-col items-center text-center gap-8">
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
          className="text-foreground font-extrabold leading-[1.1] tracking-tight max-w-[900px] text-[44px] sm:text-[72px] lg:text-[100px] font-display"
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
    </section>
  );
};

export default HeroSection;
