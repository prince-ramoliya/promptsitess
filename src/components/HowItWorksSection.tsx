import { motion } from 'framer-motion';
import { Search, Copy, Code2, Sparkles } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Browse Components',
    desc: 'Explore our curated library of premium UI sections — hero blocks, pricing tables, feature grids, and more. Find the perfect design that matches your vision.',
    color: 'cyan',
    gradient: 'from-[hsl(var(--cyan))] to-[hsl(var(--cyan))]',
    glow: 'hsl(var(--cyan))',
    badge: 'Step 01',
  },
  {
    icon: Copy,
    title: 'Copy the Prompt',
    desc: 'Each component includes a carefully crafted AI prompt hidden behind the scenes. One click copies it to your clipboard — no code, no design files needed.',
    color: 'accent',
    gradient: 'from-[hsl(var(--pink))] to-[hsl(var(--pink))]',
    glow: 'hsl(var(--pink))',
    badge: 'Step 02',
  },
  {
    icon: Code2,
    title: 'Paste into Your AI Tool',
    desc: 'Open your favorite AI coding tool — Lovable, Cursor, or Bolt — and paste the prompt. The AI instantly understands the exact layout, styling, and interactions.',
    color: 'yellow',
    gradient: 'from-[hsl(var(--yellow))] to-[hsl(var(--yellow))]',
    glow: 'hsl(var(--yellow))',
    badge: 'Step 03',
  },
  {
    icon: Sparkles,
    title: 'Generate the UI',
    desc: 'Watch as the AI generates a pixel-perfect recreation of the component in seconds. Production-ready code, fully responsive, ready to ship.',
    color: 'emerald',
    gradient: 'from-[hsl(var(--emerald))] to-[hsl(var(--emerald))]',
    glow: 'hsl(var(--emerald))',
    badge: 'Step 04',
  },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="section-padding relative z-10 overflow-hidden">
    {/* Background decorative elements */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full bg-[hsl(var(--cyan))]/[0.03] blur-[120px]" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full bg-[hsl(var(--pink))]/[0.03] blur-[120px]" />
    </div>

    <div className="max-w-5xl mx-auto relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16 md:mb-24"
      >
        <span className="badge-tag text-[10px] mb-4 inline-block">HOW IT WORKS</span>
        <h2 className="text-4xl md:text-6xl font-extrabold mb-5 font-display tracking-tight">
          From Browse to <span className="gradient-text">Build</span>
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
          Four simple steps to transform any design into production-ready code using AI.
        </p>
      </motion.div>

      {/* Timeline layout */}
      <div className="relative">
        {/* Vertical connector line - desktop only */}
        <div className="hidden md:block absolute left-[39px] top-8 bottom-8 w-px bg-gradient-to-b from-[hsl(var(--cyan))]/40 via-[hsl(var(--pink))]/40 to-[hsl(var(--emerald))]/40" />

        <div className="space-y-6 md:space-y-0">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative md:pl-24 md:pb-16 last:pb-0"
            >
              {/* Step number circle - desktop */}
              <div
                className="hidden md:flex absolute left-0 top-0 w-[78px] h-[78px] rounded-2xl items-center justify-center z-10"
                style={{
                  background: `linear-gradient(135deg, ${step.glow}20, transparent)`,
                  border: `1px solid ${step.glow}30`,
                  boxShadow: `0 0 30px ${step.glow}15`,
                }}
              >
                <step.icon className="w-7 h-7" style={{ color: step.glow }} />
              </div>

              {/* Card */}
              <div
                className="group relative rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl p-6 md:p-8 transition-all duration-500 hover:border-border/60"
                style={{
                  boxShadow: `0 0 0 0 ${step.glow}00, 0 4px 30px -8px rgba(0,0,0,0.5)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 60px -10px ${step.glow}20, 0 4px 30px -8px rgba(0,0,0,0.5)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 0 0 ${step.glow}00, 0 4px 30px -8px rgba(0,0,0,0.5)`;
                }}
              >
                {/* Mobile icon + badge row */}
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div
                    className="md:hidden flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${step.glow}20, transparent)`,
                      border: `1px solid ${step.glow}30`,
                    }}
                  >
                    <step.icon className="w-6 h-6" style={{ color: step.glow }} />
                  </div>
                  <span
                    className="text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full"
                    style={{
                      color: step.glow,
                      background: `${step.glow}10`,
                      border: `1px solid ${step.glow}20`,
                    }}
                  >
                    {step.badge}
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 font-display">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl">
                  {step.desc}
                </p>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${step.glow}40, transparent)`,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
