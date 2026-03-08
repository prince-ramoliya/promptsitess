import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Crown, Code, Layers, Zap, Layout, Palette, MousePointerClick, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const features = [
  'Full library access',
  'Premium AI prompts',
  'Weekly new components',
  'Priority support',
  'Early access to new features',
  'Copy & paste workflow',
];

const FloatingOrb = ({ delay, duration, x, y, size, color }: { delay: number; duration: number; x: string; y: string; size: string; color: string }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl opacity-20 ${size} ${color}`}
    style={{ left: x, top: y }}
    animate={{
      y: [0, -30, 0, 30, 0],
      x: [0, 20, 0, -20, 0],
      scale: [1, 1.2, 1, 0.8, 1],
      opacity: [0.15, 0.3, 0.15, 0.25, 0.15],
    }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

const GridLine = ({ orientation, position, delay }: { orientation: 'h' | 'v'; position: string; delay: number }) => (
  <motion.div
    className={`absolute ${orientation === 'h' ? 'w-full h-px' : 'h-full w-px'} bg-gradient-to-${orientation === 'h' ? 'r' : 'b'} from-transparent via-primary/[0.07] to-transparent`}
    style={orientation === 'h' ? { top: position, left: 0 } : { left: position, top: 0 }}
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, 0.5, 0] }}
    transition={{ duration: 4, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

/* Floating icon elements for pricing context */
const FloatingIcon = ({ icon: Icon, x, y, delay, size = 24 }: { icon: any; x: string; y: string; delay: number; size?: number }) => (
  <motion.div
    className="absolute flex items-center justify-center w-14 h-14 rounded-2xl bg-card/50 backdrop-blur-md border border-border/30 text-muted-foreground/50 shadow-lg shadow-primary/5"
    style={{ left: x, top: y }}
    animate={{
      y: [0, -20, 0, 20, 0],
      rotate: [0, 8, 0, -8, 0],
      opacity: [0.3, 0.7, 0.3],
    }}
    transition={{ duration: 8 + delay, delay, repeat: Infinity, ease: 'easeInOut' }}
  >
    <Icon size={size} />
  </motion.div>
);

const Pricing = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 4,
        size: 2 + Math.random() * 3,
      })),
    []
  );

  return (
    <div className="min-h-screen bg-background smooth-scroll">
      <Navbar />

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Gradient mesh background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 80% 60% at 20% 30%, hsl(var(--cyan) / 0.15) 0%, transparent 70%),
                radial-gradient(ellipse 60% 80% at 80% 20%, hsl(var(--pink) / 0.12) 0%, transparent 70%),
                radial-gradient(ellipse 70% 50% at 50% 80%, hsl(var(--emerald) / 0.12) 0%, transparent 70%),
                radial-gradient(ellipse 50% 70% at 10% 70%, hsl(var(--yellow) / 0.1) 0%, transparent 70%)
              `,
            }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 60% 50% at 70% 60%, hsl(var(--cyan) / 0.1) 0%, transparent 60%),
                radial-gradient(ellipse 50% 60% at 30% 50%, hsl(var(--accent) / 0.1) 0%, transparent 60%),
                radial-gradient(ellipse 80% 40% at 60% 20%, hsl(var(--yellow) / 0.08) 0%, transparent 60%)
              `,
            }}
            animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.08, 1] }}
            transition={{ duration: 8, delay: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Animated gradient streaks */}
        <motion.div
          className="absolute w-[600px] h-[2px] top-[35%] -left-20 bg-gradient-to-r from-transparent via-[hsl(var(--cyan)/0.3)] to-transparent blur-sm"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
        />
        <motion.div
          className="absolute w-[500px] h-[2px] top-[65%] -right-20 bg-gradient-to-r from-transparent via-[hsl(var(--pink)/0.25)] to-transparent blur-sm"
          animate={{ x: ['200%', '-100%'] }}
          transition={{ duration: 7, delay: 2, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
        />
        <motion.div
          className="absolute w-[400px] h-[2px] top-[50%] -left-10 bg-gradient-to-r from-transparent via-[hsl(var(--yellow)/0.2)] to-transparent blur-sm"
          animate={{ x: ['-100%', '250%'] }}
          transition={{ duration: 8, delay: 4, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
        />

        {/* Floating orbs */}
        <FloatingOrb delay={0} duration={8} x="10%" y="20%" size="w-72 h-72" color="bg-[hsl(var(--cyan))]" />
        <FloatingOrb delay={2} duration={10} x="70%" y="10%" size="w-96 h-96" color="bg-[hsl(var(--accent))]" />
        <FloatingOrb delay={4} duration={12} x="50%" y="60%" size="w-64 h-64" color="bg-[hsl(var(--emerald))]" />
        <FloatingOrb delay={1} duration={9} x="85%" y="70%" size="w-56 h-56" color="bg-[hsl(var(--yellow))]" />
        <FloatingOrb delay={3} duration={7} x="20%" y="75%" size="w-48 h-48" color="bg-[hsl(var(--pink))]" />

        {/* Grid lines */}
        <GridLine orientation="h" position="25%" delay={0} />
        <GridLine orientation="h" position="50%" delay={1.5} />
        <GridLine orientation="h" position="75%" delay={3} />
        <GridLine orientation="v" position="25%" delay={0.5} />
        <GridLine orientation="v" position="50%" delay={2} />
        <GridLine orientation="v" position="75%" delay={3.5} />

        {/* Floating pricing/web concept icons */}
        <FloatingIcon icon={Code} x="8%" y="25%" delay={0} />
        <FloatingIcon icon={Layers} x="88%" y="30%" delay={1.5} />
        <FloatingIcon icon={Layout} x="15%" y="65%" delay={3} />
        <FloatingIcon icon={Palette} x="82%" y="68%" delay={2} />
        <FloatingIcon icon={Zap} x="45%" y="15%" delay={4} />
        <FloatingIcon icon={MousePointerClick} x="75%" y="85%" delay={1} />
        <FloatingIcon icon={Crown} x="25%" y="85%" delay={2.5} />
        <FloatingIcon icon={Sparkles} x="60%" y="80%" delay={3.5} />

        {/* Particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-primary/40"
            style={{ left: p.x, top: p.y, width: p.size, height: p.size }}
            animate={{ y: [0, -60, 0], opacity: [0, 0.8, 0] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="absolute inset-0 noise-bg opacity-30" />

      <section className="section-padding pt-32 pb-24 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <span className="badge-tag text-[10px] mb-4 inline-block">PRICING</span>
            <h1 className="text-2xl md:text-4xl font-extrabold mb-5 font-display tracking-tight">
              One Plan, <span className="gradient-text">Full Access</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
              No subscriptions, no recurring fees. Pay once and get lifetime access to everything.
            </p>
          </motion.div>

          {/* Single Plan Card */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="max-w-lg mx-auto">
            <div className="relative rounded-3xl p-10 bg-gradient-to-b from-[hsl(var(--primary)/0.08)] via-card/60 to-card/40 border-2 border-primary/25 shadow-[0_0_80px_-20px_hsl(var(--primary)/0.25)] backdrop-blur-xl">
              {/* Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 badge-pro flex items-center gap-1.5 px-4 py-1.5">
                <Crown className="w-3.5 h-3.5" /> Lifetime Access
              </div>

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mb-6 mx-auto border border-primary/20">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>

              {/* Price */}
              <div className="text-center mb-3">
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="text-6xl font-extrabold text-foreground font-display">$19</span>
                </div>
                {/* Lifetime highlight */}
                <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--emerald)/0.1)] border border-[hsl(var(--emerald)/0.25)]">
                  <span className="w-2 h-2 rounded-full bg-[hsl(var(--emerald))] animate-pulse" />
                  <span className="text-sm font-semibold text-[hsl(var(--emerald))]">One-time payment · Lifetime access</span>
                </div>
              </div>

              <p className="text-muted-foreground text-sm mt-4 mb-8 text-center">
                Pay once and unlock the entire component library & premium prompts forever. No subscriptions.
              </p>

              {/* Features */}
              <ul className="space-y-4 mb-10">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link to="/auth?mode=signup" className="glow-button block text-center w-full py-4 rounded-xl font-semibold text-sm">
                Get Lifetime Access — $19
              </Link>

              {/* Subtle note */}
              <p className="text-center text-muted-foreground/60 text-xs mt-4">One-time purchase. No hidden fees. No recurring charges.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
