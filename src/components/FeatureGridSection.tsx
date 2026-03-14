import { motion } from 'framer-motion';
import { BookOpen, Cpu, Search, LayoutGrid } from 'lucide-react';

const platformBadges = [
  { name: 'Lovable', logo: '/logos/lovable.svg' },
  { name: 'Cursor', logo: '/logos/cursor.svg' },
  { name: 'Bolt', logo: '/logos/bolt.svg' },
  { name: 'React', logo: '/logos/react.svg' },
  { name: 'Tailwind', logo: '/logos/tailwind.svg' },
];

const allFeatures = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Multi-Category Library',
    description: 'Prompts for UI components, photography, logos, graphics, illustrations, 3D animations, and much more.',
    badge: 'Included',
    gradient: 'from-[hsl(var(--primary)/0.15)] via-transparent to-[hsl(var(--accent)/0.1)]',
    borderGlow: 'from-[hsl(var(--primary)/0.4)] via-[hsl(var(--primary)/0.08)] to-[hsl(var(--accent)/0.35)]',
    iconColor: 'text-[hsl(var(--primary))]',
    iconBg: 'from-[hsl(var(--primary)/0.2)] to-[hsl(var(--primary)/0.08)]',
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: 'Instant Generation',
    description: 'Paste any prompt into Lovable, Cursor, Bolt, Midjourney, DALL·E, or any AI tool to generate instantly.',
    badge: 'Included',
    gradient: 'from-[hsl(var(--primary)/0.12)] via-transparent to-[hsl(var(--pink)/0.12)]',
    borderGlow: 'from-[hsl(var(--primary)/0.35)] via-[hsl(var(--primary)/0.06)] to-[hsl(var(--pink)/0.4)]',
    iconColor: 'text-[hsl(var(--primary))]',
    iconBg: 'from-[hsl(var(--primary)/0.2)] to-[hsl(var(--primary)/0.08)]',
  },
  {
    icon: <Search className="w-6 h-6" />,
    title: 'Smart Search',
    description: 'Quickly find the perfect prompt using tags, categories, and filters across all creative domains.',
    gradient: 'from-[hsl(var(--cyan)/0.1)] via-transparent to-[hsl(var(--primary)/0.08)]',
    borderGlow: 'from-[hsl(var(--cyan)/0.3)] via-[hsl(var(--cyan)/0.05)] to-[hsl(var(--primary)/0.25)]',
    iconColor: 'text-[hsl(var(--cyan))]',
    iconBg: 'from-[hsl(var(--cyan)/0.18)] to-[hsl(var(--cyan)/0.06)]',
  },
  {
    icon: <LayoutGrid className="w-6 h-6" />,
    title: 'Rich Categories',
    description: 'Browse prompts for websites, buttons, cards, backgrounds, logos, photography, 3D art, and more.',
    gradient: 'from-[hsl(var(--accent)/0.1)] via-transparent to-[hsl(var(--pink)/0.08)]',
    borderGlow: 'from-[hsl(var(--accent)/0.3)] via-[hsl(var(--accent)/0.05)] to-[hsl(var(--pink)/0.3)]',
    iconColor: 'text-[hsl(var(--accent))]',
    iconBg: 'from-[hsl(var(--accent)/0.18)] to-[hsl(var(--accent)/0.06)]',
  },
];

const FeatureGridSection = () => {
  return (
    <section className="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] sm:h-[600px] rounded-full bg-[hsl(var(--primary)/0.06)] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-4xl lg:text-[48px] font-bold text-foreground font-display tracking-tight"
          >
            All The Tools You Need
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted-foreground text-sm sm:text-base lg:text-lg mt-3 sm:mt-4 max-w-[560px] mx-auto leading-relaxed px-2"
          >
            AI powered tools to build and generate modern UI components instantly
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-5 sm:mt-6"
          >
            {platformBadges.map((badge) => (
              <motion.span
                key={badge.name}
                whileHover={{ scale: 1.08, boxShadow: '0 0 20px -4px hsl(var(--primary) / 0.3)' }}
                className="inline-flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-border/40 bg-card/60 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground hover:border-primary/30 cursor-default"
              >
                <img src={badge.logo} alt={badge.name} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {badge.name}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Features — 2x2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {allFeatures.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} large />
          ))}
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  feature: typeof allFeatures[number];
  index: number;
  large?: boolean;
}

const FeatureCard = ({ feature, index, large }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.5, delay: index * 0.06 }}
    whileHover={{ y: -4 }}
    className="group relative"
  >
    {/* Gradient border glow */}
    <div className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-br ${feature.borderGlow} opacity-50 group-hover:opacity-100 transition-opacity duration-500 blur-[0.5px]`} />

    {/* Card */}
    <div className={`relative rounded-2xl ${large ? 'p-6 sm:p-7 lg:p-8' : 'p-5 sm:p-6'} h-full bg-card/80 backdrop-blur-sm border border-border/10 overflow-hidden transition-all duration-500`}>
      {/* Bottom gradient wash */}
      <div className={`absolute inset-0 bg-gradient-to-b ${feature.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
      
      {/* Bottom edge colored line */}
      <div className={`absolute bottom-0 left-[15%] right-[15%] h-[1px] bg-gradient-to-r ${feature.borderGlow} opacity-40 group-hover:opacity-80 group-hover:left-[5%] group-hover:right-[5%] transition-all duration-500`} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4 sm:mb-5">
          <div className={`${large ? 'w-11 h-11 sm:w-12 sm:h-12' : 'w-10 h-10'} rounded-xl flex items-center justify-center bg-gradient-to-br ${feature.iconBg} ${feature.iconColor} transition-transform duration-300 group-hover:scale-110`}>
            {feature.icon}
          </div>
          {feature.badge && (
            <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-[hsl(var(--yellow)/0.15)] text-[hsl(var(--yellow))] border border-[hsl(var(--yellow)/0.25)]">
              {feature.badge}
            </span>
          )}
        </div>
        <h3 className={`text-foreground font-semibold ${large ? 'text-lg sm:text-xl' : 'text-[15px] sm:text-base'} mb-1.5 sm:mb-2 font-display`}>
          {feature.title}
        </h3>
        <p className={`text-muted-foreground ${large ? 'text-xs sm:text-sm' : 'text-[11px] sm:text-xs'} leading-relaxed`}>
          {feature.description}
        </p>
      </div>
    </div>
  </motion.div>
);

export default FeatureGridSection;
