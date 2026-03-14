import { motion } from 'framer-motion';
import { Search, Copy, Code2, Sparkles } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Browse Prompts',
    desc: 'Explore our curated library — website sections, photography prompts, logo designs, 3D art, illustrations, and more.',
    number: '01',
    glow: 'hsl(var(--cyan))',
  },
  {
    icon: Copy,
    title: 'Copy the Prompt',
    desc: 'Each creation includes a carefully crafted AI prompt. One click copies it to your clipboard — ready to use.',
    number: '02',
    glow: 'hsl(var(--pink))',
  },
  {
    icon: Code2,
    title: 'Paste into AI Tool',
    desc: 'Open Lovable, Cursor, Bolt, Midjourney, DALL·E, or any AI tool and paste the prompt to generate.',
    number: '03',
    glow: 'hsl(var(--yellow))',
  },
  {
    icon: Sparkles,
    title: 'Get Your Creation',
    desc: 'Watch as AI generates stunning results — websites, logos, photos, graphics, 3D models — all production-ready.',
    number: '04',
    glow: 'hsl(var(--emerald))',
  },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="section-padding relative z-10 overflow-hidden">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[hsl(var(--cyan))]/[0.02] blur-[150px]" />
    </div>

    <div className="max-w-6xl mx-auto relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16 md:mb-20"
      >
        <span className="badge-tag text-[10px] mb-4 inline-block">HOW IT WORKS</span>
        <h2 className="text-4xl md:text-6xl font-extrabold mb-5 font-display tracking-tight">
          From Browse to <span className="gradient-text">Build</span>
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
          Four simple steps to transform any design into production-ready code.
        </p>
      </motion.div>

      {/* Bento-style 2x2 grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group relative rounded-2xl border border-border/30 bg-card/30 backdrop-blur-xl p-8 md:p-10 transition-all duration-500 hover:border-border/50 overflow-hidden"
          >
            {/* Large faded number background */}
            <span
              className="absolute -top-4 -right-2 text-[120px] md:text-[160px] font-black leading-none select-none pointer-events-none opacity-[0.04] font-display transition-opacity duration-500 group-hover:opacity-[0.08]"
              style={{ color: step.glow }}
            >
              {step.number}
            </span>

            {/* Hover glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 30% 50%, ${step.glow}08, transparent 70%)`,
              }}
            />

            <div className="relative z-10">
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${step.glow}15, ${step.glow}05)`,
                  border: `1px solid ${step.glow}25`,
                }}
              >
                <step.icon className="w-5 h-5" style={{ color: step.glow }} />
              </div>

              {/* Step label */}
              <span
                className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3 inline-block"
                style={{ color: step.glow }}
              >
                Step {step.number}
              </span>

              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 font-display">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm md:text-[15px] leading-relaxed">
                {step.desc}
              </p>
            </div>

            {/* Bottom accent */}
            <div
              className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `linear-gradient(90deg, transparent, ${step.glow}30, transparent)`,
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
