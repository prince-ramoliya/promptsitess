import { motion } from 'framer-motion';
import { Check, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Get started with basic components',
    features: ['10 free components', 'Basic prompts', 'Community access', 'Copy & paste prompts'],
    cta: 'Get Started',
    highlighted: false,
    icon: Zap,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    description: 'Full access to the entire library',
    features: ['Full library access', 'Premium prompts', 'Weekly new components', 'Priority support', 'Early access to new features'],
    cta: 'Go Pro',
    highlighted: true,
    icon: Sparkles,
  },
];

const Pricing = () => (
  <div className="min-h-screen bg-background relative">
    <div className="absolute inset-0 noise-bg opacity-30" />
    <Navbar />
    <section className="section-padding pt-32 relative z-10">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <span className="badge-tag text-[10px] mb-4 inline-block">PRICING</span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-5 font-display tracking-tight">
            Simple <span className="gradient-text">Pricing</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto">
            Start free. Upgrade when you need the full power of PromptSites.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`relative rounded-2xl p-8 ${plan.highlighted
                ? 'bg-gradient-to-b from-primary/8 to-accent/4 border-2 border-primary/25 shadow-[0_0_60px_-15px_hsl(var(--primary)/0.2)]'
                : 'glass-card'}`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 badge-pro flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Most Popular
                </div>
              )}
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <plan.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2 font-display">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-extrabold text-foreground font-display">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
              </div>
              <p className="text-muted-foreground text-sm mb-7">{plan.description}</p>
              <ul className="space-y-3.5 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/auth?mode=signup"
                className={`block text-center w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${plan.highlighted ? 'glow-button' : 'glow-button-outline'}`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default Pricing;
