import { motion } from 'framer-motion';
import { BookOpen, Cpu, Search, LayoutGrid, Eye, ClipboardCopy, Heart, RefreshCw, Users, Sparkles } from 'lucide-react';

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
    icon: <Search className="w-5 h-5" />,
    title: 'Prompt Search',
    description: 'Quickly find prompts using tags, categories, and filters.',
    accent: 'from-[hsl(var(--primary)/0.15)] to-[hsl(var(--cyan)/0.05)]',
    iconColor: 'text-[hsl(var(--primary))]',
  },
  {
    icon: <LayoutGrid className="w-5 h-5" />,
    title: 'Prompt Categories',
    description: 'Browse prompts for hero sections, pricing tables, navbars, bento grids, and more.',
    accent: 'from-[hsl(var(--accent)/0.12)] to-[hsl(var(--pink)/0.04)]',
    iconColor: 'text-[hsl(var(--accent))]',
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: 'Prompt Preview',
    description: 'Preview UI sections before copying the prompt.',
    accent: 'from-[hsl(var(--emerald)/0.12)] to-[hsl(var(--emerald)/0.03)]',
    iconColor: 'text-[hsl(var(--emerald))]',
  },
  {
    icon: <ClipboardCopy className="w-5 h-5" />,
    title: 'Prompt Copy',
    description: 'Copy the secret prompt with one click.',
    accent: 'from-[hsl(var(--yellow)/0.12)] to-[hsl(var(--yellow)/0.03)]',
    iconColor: 'text-[hsl(var(--yellow))]',
  },
  {
    icon: <Heart className="w-5 h-5" />,
    title: 'Favorites',
    description: 'Save your favorite prompts and build your personal prompt library.',
    accent: 'from-[hsl(var(--pink)/0.15)] to-[hsl(var(--accent)/0.04)]',
    iconColor: 'text-[hsl(var(--pink))]',
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    title: 'Prompt Updates',
    description: 'New premium prompts added weekly.',
    accent: 'from-[hsl(var(--cyan)/0.12)] to-[hsl(var(--primary)/0.04)]',
    iconColor: 'text-[hsl(var(--cyan))]',
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: 'Community Prompts',
    description: 'Submit prompts and share with the community.',
    accent: 'from-[hsl(var(--emerald)/0.1)] to-[hsl(var(--cyan)/0.04)]',
    iconColor: 'text-[hsl(var(--emerald))]',
  },
];

const bentoLayout = [
  'col-span-1',
  'col-span-1',
  'col-span-1',
  'col-span-1 sm:col-span-2',
  'col-span-1',
  'col-span-1',
  'col-span-1 sm:col-span-2 lg:col-span-1',
];

const FeatureGridSection = () => {
  return (
    <section className="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] sm:h-[600px] rounded-full bg-[hsl(var(--primary)/0.06)] blur-[120px]" />
        <div className="absolute top-1/4 right-1/4 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full bg-[hsl(var(--accent)/0.04)] blur-[100px]" />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 mb-4 sm:mb-6">
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

        {/* Other Features — Compact horizontal list style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {otherFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              whileHover={{ y: -3, scale: 1.01 }}
              className={`group relative ${bentoLayout[i]}`}
            >
              <div className="relative rounded-2xl p-5 sm:p-6 h-full border border-border/20 bg-card/40 backdrop-blur-sm overflow-hidden transition-all duration-400 hover:border-border/40 hover:bg-card/60">
                {/* Colored gradient corner */}
                <div className={`absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 rounded-br-full bg-gradient-to-br ${feature.accent} opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-secondary/60 ${feature.iconColor} group-hover:scale-110 transition-transform duration-300 mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-foreground font-semibold text-sm sm:text-[15px] font-display mb-1.5">{feature.title}</h3>
                  <p className="text-muted-foreground text-xs sm:text-[13px] leading-relaxed">{feature.description}</p>
                </div>

                <Sparkles className="absolute bottom-4 right-4 w-3.5 h-3.5 text-muted-foreground/0 group-hover:text-muted-foreground/30 transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGridSection;
