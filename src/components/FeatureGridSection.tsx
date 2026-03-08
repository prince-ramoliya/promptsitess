import { motion } from 'framer-motion';
import { BookOpen, Cpu, Search, LayoutGrid, Eye, ClipboardCopy, Heart, RefreshCw, Users } from 'lucide-react';

const platformBadges = [
  { name: 'Lovable', logo: '/logos/lovable.svg' },
  { name: 'Cursor', logo: '/logos/cursor.svg' },
  { name: 'Bolt', logo: '/logos/bolt.svg' },
  { name: 'React', logo: '/logos/react.svg' },
  { name: 'Tailwind', logo: '/logos/tailwind.svg' },
];

const featuredCards = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Smart Prompt Library',
    description: 'Access hundreds of premium UI prompts ready to generate sections instantly.',
    badge: 'Included',
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: 'Component Generator',
    description: 'Paste prompts into Lovable, Cursor, or Bolt and instantly generate production ready UI.',
    badge: 'Included',
  },
];

const otherFeatures = [
  {
    icon: <Search className="w-[18px] h-[18px]" />,
    title: 'Prompt Search',
    description: 'Quickly find prompts using tags, categories, and filters.',
    color: 'hsl(var(--primary))',
    borderColor: 'border-l-[hsl(var(--primary))]',
    bgHover: 'group-hover:bg-[hsl(var(--primary)/0.06)]',
    iconBg: 'bg-[hsl(var(--primary)/0.1)]',
  },
  {
    icon: <LayoutGrid className="w-[18px] h-[18px]" />,
    title: 'Prompt Categories',
    description: 'Browse prompts for hero sections, pricing tables, navbars, and more.',
    color: 'hsl(var(--accent))',
    borderColor: 'border-l-[hsl(var(--accent))]',
    bgHover: 'group-hover:bg-[hsl(var(--accent)/0.06)]',
    iconBg: 'bg-[hsl(var(--accent)/0.1)]',
  },
  {
    icon: <Eye className="w-[18px] h-[18px]" />,
    title: 'Prompt Preview',
    description: 'Preview UI sections before copying the prompt.',
    color: 'hsl(var(--emerald))',
    borderColor: 'border-l-[hsl(var(--emerald))]',
    bgHover: 'group-hover:bg-[hsl(var(--emerald)/0.06)]',
    iconBg: 'bg-[hsl(var(--emerald)/0.1)]',
  },
  {
    icon: <ClipboardCopy className="w-[18px] h-[18px]" />,
    title: 'Prompt Copy',
    description: 'Copy the secret prompt with one click.',
    color: 'hsl(var(--yellow))',
    borderColor: 'border-l-[hsl(var(--yellow))]',
    bgHover: 'group-hover:bg-[hsl(var(--yellow)/0.06)]',
    iconBg: 'bg-[hsl(var(--yellow)/0.1)]',
  },
  {
    icon: <Heart className="w-[18px] h-[18px]" />,
    title: 'Favorites',
    description: 'Save your favorite prompts and build your personal prompt library.',
    color: 'hsl(var(--pink))',
    borderColor: 'border-l-[hsl(var(--pink))]',
    bgHover: 'group-hover:bg-[hsl(var(--pink)/0.06)]',
    iconBg: 'bg-[hsl(var(--pink)/0.1)]',
  },
  {
    icon: <RefreshCw className="w-[18px] h-[18px]" />,
    title: 'Prompt Updates',
    description: 'New premium prompts added weekly.',
    color: 'hsl(var(--cyan))',
    borderColor: 'border-l-[hsl(var(--cyan))]',
    bgHover: 'group-hover:bg-[hsl(var(--cyan)/0.06)]',
    iconBg: 'bg-[hsl(var(--cyan)/0.1)]',
  },
  {
    icon: <Users className="w-[18px] h-[18px]" />,
    title: 'Community Prompts',
    description: 'Submit prompts and share with the community.',
    color: 'hsl(var(--emerald))',
    borderColor: 'border-l-[hsl(var(--emerald))]',
    bgHover: 'group-hover:bg-[hsl(var(--emerald)/0.06)]',
    iconBg: 'bg-[hsl(var(--emerald)/0.1)]',
  },
];

const FeatureGridSection = () => {
  return (
    <section className="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] sm:h-[600px] rounded-full bg-[hsl(var(--primary)/0.06)] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
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

          {/* Platform Badges */}
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

        {/* Featured Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 mb-8 sm:mb-10">
          {featuredCards.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="group relative"
            >
              <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-[hsl(var(--primary)/0.4)] via-[hsl(var(--primary)/0.1)] to-[hsl(var(--accent)/0.3)] opacity-60 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]" />
              <div className="relative rounded-2xl p-6 sm:p-7 lg:p-8 h-full bg-gradient-to-br from-[hsl(var(--primary)/0.12)] via-card to-[hsl(var(--primary)/0.05)] border border-[hsl(var(--primary)/0.2)] shadow-[0_0_60px_-20px_hsl(var(--primary)/0.2)] group-hover:shadow-[0_0_80px_-16px_hsl(var(--primary)/0.3)] transition-all duration-500">
                <div className="flex items-start justify-between mb-4 sm:mb-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[hsl(var(--primary)/0.25)] to-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]">
                    {feature.icon}
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-[hsl(var(--yellow)/0.15)] text-[hsl(var(--yellow))] border border-[hsl(var(--yellow)/0.25)]">
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-foreground font-semibold text-lg sm:text-xl mb-2 font-display">{feature.title}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Other Features — Clean list with colored left borders */}
        <div className="rounded-2xl border border-border/30 bg-background/80 backdrop-blur-sm overflow-hidden divide-y divide-border/15">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/15">
            {otherFeatures.slice(0, 3).map((feature, i) => (
              <FeatureItem key={feature.title} feature={feature} index={i} />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/15">
            {otherFeatures.slice(3, 6).map((feature, i) => (
              <FeatureItem key={feature.title} feature={feature} index={i + 3} />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/15">
            {otherFeatures.slice(6).map((feature, i) => (
              <FeatureItem key={feature.title} feature={feature} index={i + 6} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

interface FeatureItemProps {
  feature: typeof otherFeatures[number];
  index: number;
}

const FeatureItem = ({ feature, index }: FeatureItemProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.4, delay: index * 0.05 }}
    className={`group relative px-5 sm:px-6 py-5 sm:py-6 ${feature.bgHover} transition-all duration-300 cursor-default`}
  >
    {/* Colored left border indicator */}
    <div
      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 group-hover:h-8 rounded-r-full transition-all duration-300"
      style={{ backgroundColor: feature.color }}
    />

    <div className="flex items-start gap-3.5">
      <div
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${feature.iconBg}`}
        style={{ color: feature.color }}
      >
        {feature.icon}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-foreground font-semibold text-[13px] sm:text-sm font-display mb-1 group-hover:text-foreground/90 transition-colors">
          {feature.title}
        </h3>
        <p className="text-muted-foreground text-[11px] sm:text-xs leading-relaxed">
          {feature.description}
        </p>
      </div>
    </div>
  </motion.div>
);

export default FeatureGridSection;
