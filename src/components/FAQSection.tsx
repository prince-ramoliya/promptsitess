import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const getFaqs = (price: number) => [
  {
    question: 'What is PromptSites?',
    answer: 'PromptSites is a curated library of premium AI prompts for everything — website UI, photography, logos, graphics, illustrations, 3D animations, backgrounds, cards, buttons, and much more. Copy any prompt and paste it into your favorite AI tool to generate instantly.',
  },
  {
    question: 'What kinds of prompts do you offer?',
    answer: 'We offer prompts across a wide range of creative categories: website sections (hero, pricing, navbars), logo designs, photography styles, graphic designs, illustrations, 3D animations, backgrounds, buttons, cards, and more. New categories are added regularly.',
  },
  {
    question: 'Which AI tools are supported?',
    answer: 'Our prompts work with a wide range of AI tools — Lovable, Cursor, and Bolt for websites; Midjourney, DALL·E, and Stable Diffusion for images; and any AI assistant that accepts natural language prompts.',
  },
  {
    question: 'Is there a free plan?',
    answer: `Yes! We offer free prompts so you can try the platform. Pro prompts are available with a one-time payment of $${price} for lifetime access to the entire library across all categories.`,
  },
  {
    question: 'How often are new prompts added?',
    answer: 'We add new premium prompts every week across all categories — website components, photography styles, logo concepts, graphic designs, illustrations, 3D art, and more.',
  },
  {
    question: 'Can I submit my own prompts?',
    answer: 'Absolutely! Our community feature lets you submit and share prompts with other users. Help the community grow by contributing your best creative work.',
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [basePriceUsd, setBasePriceUsd] = useState(19);

  useEffect(() => {
    const fetchPrice = async () => {
      const { data } = await supabase.from('pricing_config').select('base_price_usd').limit(1).single();
      if (data) setBasePriceUsd(Number((data as any).base_price_usd));
    };
    fetchPrice();

    const channel = supabase
      .channel('faq-pricing-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pricing_config' }, (payload: any) => {
        if (payload.new?.base_price_usd) setBasePriceUsd(Number(payload.new.base_price_usd));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const faqs = getFaqs(basePriceUsd);

  return (
    <section className="relative py-20 sm:py-28 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[500px] sm:w-[700px] h-[300px] sm:h-[400px] rounded-full bg-[hsl(var(--primary)/0.04)] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[740px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <span className="inline-block text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3 px-3 py-1 rounded-full border border-border/40 bg-card/60">
            FAQ
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-bold text-foreground font-display tracking-tight">
            Frequently Asked Questions
          </h2>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <div className={`group relative rounded-xl border transition-all duration-300 ${isOpen ? 'border-[hsl(var(--primary)/0.3)] bg-card/60' : 'border-border/20 bg-card/30 hover:border-border/40 hover:bg-card/40'}`}>
                  {/* Glow on open */}
                  {isOpen && (
                    <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-[hsl(var(--primary)/0.15)] to-[hsl(var(--accent)/0.1)] blur-[1px] -z-10" />
                  )}

                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left cursor-pointer"
                  >
                    <span className={`font-semibold text-sm sm:text-[15px] font-display transition-colors duration-200 ${isOpen ? 'text-foreground' : 'text-foreground/80'}`}>
                      {faq.question}
                    </span>
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isOpen ? 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]' : 'bg-secondary/50 text-muted-foreground'}`}>
                      {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 sm:px-6 pb-4 sm:pb-5 text-muted-foreground text-xs sm:text-sm leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
