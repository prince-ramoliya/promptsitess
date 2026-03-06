import { motion } from 'framer-motion';
import { Search, Copy, Code2, Sparkles } from 'lucide-react';

const steps = [
  { icon: Search, title: 'Browse Components', desc: 'Explore our curated library of premium UI sections and find the perfect design for your project.' },
  { icon: Copy, title: 'Copy the Prompt', desc: 'Each component comes with a secret AI prompt. One click to copy it to your clipboard.' },
  { icon: Code2, title: 'Paste into Your AI Tool', desc: 'Open Lovable, Cursor, or Bolt and paste the prompt. The AI will understand exactly what to build.' },
  { icon: Sparkles, title: 'Generate the UI', desc: 'Watch as the AI generates a pixel-perfect recreation of the component in seconds.' },
];

const HowItWorksSection = () => (
  <section className="py-32 px-6 relative">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
    <div className="max-w-5xl mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="badge-tag text-[10px] mb-4 inline-block">HOW IT WORKS</span>
        <h2 className="text-3xl md:text-5xl font-extrabold mb-4 font-display tracking-tight">
          From Browse to <span className="gradient-text">Build</span>
        </h2>
        <p className="text-muted-foreground text-base max-w-lg mx-auto">
          Four simple steps to go from inspiration to implementation.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="glass-card p-7 flex items-start gap-5 group hover:border-primary/20 transition-colors duration-500"
          >
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 border border-border/30 flex items-center justify-center relative">
              <step.icon className="w-6 h-6 text-foreground/60 group-hover:text-primary transition-colors duration-300" />
              <div className="absolute -top-2 -left-2 w-6 h-6 rounded-lg bg-card border border-border/50 flex items-center justify-center">
                <span className="text-[10px] font-bold text-primary font-display">{i + 1}</span>
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground mb-1.5 font-display">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
