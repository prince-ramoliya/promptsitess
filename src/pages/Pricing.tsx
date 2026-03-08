import { motion } from 'framer-motion';
import { Check, Sparkles, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
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

const Pricing = () => (
  <div className="min-h-screen bg-background smooth-scroll">
    <Navbar />

    {/* Animated gradient background blobs — same as homepage */}
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[hsl(var(--cyan)/0.08)] blur-[120px] animate-pulse" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-[hsl(var(--pink)/0.07)] blur-[120px] animate-pulse [animation-delay:2s]" />
      <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full bg-[hsl(var(--emerald)/0.06)] blur-[120px] animate-pulse [animation-delay:4s]" />
    </div>

    <div className="absolute inset-0 noise-bg opacity-30" />

    <section className="section-padding pt-32 pb-24 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="badge-tag text-[10px] mb-4 inline-block">PRICING</span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-5 font-display tracking-tight">
            One Plan, <span className="gradient-text">Full Access</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto">
            No tiers, no confusion. Get everything with a single subscription.
          </p>
        </motion.div>

        {/* Single Plan Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="max-w-lg mx-auto"
        >
          <div className="relative rounded-3xl p-10 bg-gradient-to-b from-[hsl(var(--primary)/0.08)] via-card/60 to-card/40 border-2 border-primary/25 shadow-[0_0_80px_-20px_hsl(var(--primary)/0.25)] backdrop-blur-xl">
            {/* Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 badge-pro flex items-center gap-1.5 px-4 py-1.5">
              <Crown className="w-3.5 h-3.5" /> Pro Access
            </div>

            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mb-6 mx-auto border border-primary/20">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>

            {/* Price */}
            <div className="text-center mb-8">
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-6xl font-extrabold text-foreground font-display">$19</span>
                <span className="text-muted-foreground text-base">/month</span>
              </div>
              <p className="text-muted-foreground text-sm mt-3">
                Full access to the entire component library & premium prompts.
              </p>
            </div>

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
            <Link
              to="/auth?mode=signup"
              className="glow-button block text-center w-full py-4 rounded-xl font-semibold text-sm"
            >
              Get Started Now
            </Link>

            {/* Subtle note */}
            <p className="text-center text-muted-foreground/60 text-xs mt-4">
              Cancel anytime. No hidden fees.
            </p>
          </div>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default Pricing;
