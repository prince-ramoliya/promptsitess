import { motion } from 'framer-motion';
import { Search, Copy, Code2, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const steps = [
  { icon: Search, title: 'Browse Components', desc: 'Explore our curated library of premium UI sections and find the perfect design for your project.' },
  { icon: Copy, title: 'Copy the Prompt', desc: 'Each component comes with a secret AI prompt. One click to copy it to your clipboard.' },
  { icon: Code2, title: 'Paste into Your AI Tool', desc: 'Open Lovable, Cursor, or Bolt and paste the prompt. The AI will understand exactly what to build.' },
  { icon: Sparkles, title: 'Generate the UI', desc: 'Watch as the AI generates a pixel-perfect recreation of the component in seconds.' },
];

const HowItWorks = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="section-padding pt-32">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            How It <span className="gradient-text">Works</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            From browsing to building in four simple steps.
          </p>
        </motion.div>

        <div className="space-y-16">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row items-center gap-8"
            >
              <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-primary">STEP {i + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
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
