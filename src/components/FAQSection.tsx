import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    q: 'What is PromptLab?',
    a: 'PromptLab is a curated library of premium UI prompts designed for AI coding tools like Lovable, Cursor, and Bolt. Browse beautiful components, copy the secret prompt behind them, and generate production-ready UI instantly.',
  },
  {
    q: 'How does it work?',
    a: 'Simply browse our component library, find a design you love, and click "Copy Prompt." Then paste it into your favorite AI tool — Lovable, Cursor, or Bolt — and watch it generate a pixel-perfect UI component in seconds.',
  },
  {
    q: 'What AI tools are supported?',
    a: 'Our prompts are optimized for Lovable, Cursor, and Bolt, but they work with any AI coding assistant that accepts natural language instructions. The prompts are crafted to produce high-quality React + Tailwind CSS output.',
  },
  {
    q: 'What is the difference between Free and Pro?',
    a: 'Free users can access a selection of basic component prompts. Pro members unlock the full library with 100+ premium prompts, pro-only categories, early access to new prompts, and priority support.',
  },
  {
    q: 'Can I submit my own prompts?',
    a: 'Yes! We have a community prompts feature where you can submit your own prompts and share them with the community. The best submissions get featured in our curated collection.',
  },
  {
    q: 'How often are new prompts added?',
    a: 'We add new premium prompts every week. Pro members get early access to all new additions. Our library is constantly growing with the latest UI trends and design patterns.',
  },
  {
    q: 'Do I need coding knowledge to use PromptLab?',
    a: 'Not at all! That\'s the beauty of it. Just copy a prompt and paste it into an AI tool. The AI handles all the coding. However, basic familiarity with React projects helps you integrate the generated components.',
  },
];

const FAQSection = () => {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[hsl(var(--ig-purple)/0.05)] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[720px] mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="badge-tag text-[10px] mb-4 inline-block">FAQ</span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-foreground font-display tracking-tight">
            Frequently Asked{' '}
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base mt-3 max-w-[480px] mx-auto leading-relaxed">
            Everything you need to know about PromptLab
          </p>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-border/30 bg-card/40 backdrop-blur-sm rounded-xl px-5 data-[state=open]:border-primary/20 data-[state=open]:bg-card/60 transition-all duration-300 overflow-hidden"
              >
                <AccordionTrigger className="text-sm sm:text-base font-medium text-foreground hover:text-foreground py-4 hover:no-underline [&[data-state=open]>svg]:text-primary">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
