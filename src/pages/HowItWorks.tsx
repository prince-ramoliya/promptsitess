import { motion } from 'framer-motion';
import { Search, Copy, Code2, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const steps = [
  { icon: Search, title: 'Browse Components', desc: 'Explore our curated library of premium UI sections and find the perfect design for your project.', color: 'from-primary/20 to-primary/5' },
  { icon: Copy, title: 'Copy the Prompt', desc: 'Each component comes with a secret AI prompt. One click to copy it to your clipboard.', color: 'from-accent/20 to-accent/5' },
  { icon: Code2, title: 'Paste into Your AI Tool', desc: 'Open Lovable, Cursor, or Bolt and paste the prompt. The AI will understand exactly what to build.', color: 'from-cyan/20 to-cyan/5' },
  { icon: Sparkles, title: 'Generate the UI', desc: 'Watch as the AI generates a pixel-perfect recreation of the component in seconds.', color: 'from-emerald/20 to-emerald/5' },
];

const HowItWorks = () => (
  <div className="min-h-screen bg-background relative">
    <div className="absolute inset-0 noise-bg opacity-30" />
    <Navbar />
    <section className="section-padding pt-32 relative z-10">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <span className="badge-tag text-[10px] mb-4 inline-block">HOW IT WORKS</span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-5 font-display tracking-tight">
            From Browse to <span className="gradient-text">Build</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto">
            From browsing to building in four simple steps.
          </p>
        </motion.div>

        <div className="space-y-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass-card p-8 flex flex-col md:flex-row items-center gap-8"
            >
              <div className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} border border-border/30 flex items-center justify-center relative`}>
                <step.icon className="w-8 h-8 text-foreground/70" />
                <div className="absolute -top-2 -left-2 w-7 h-7 rounded-lg bg-card border border-border/50 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary font-display">{i + 1}</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2 font-display">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default HowItWorks;
