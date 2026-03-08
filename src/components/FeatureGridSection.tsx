import { motion } from 'framer-motion';
import { BookOpen, Cpu, Search, LayoutGrid, Eye, ClipboardCopy, Heart, RefreshCw, Users } from 'lucide-react';

const platformBadges = [
  { name: 'Lovable', icon: '💜' },
  { name: 'Cursor', icon: '⚡' },
  { name: 'Bolt', icon: '🔩' },
  { name: 'React', icon: '⚛️' },
  { name: 'Tailwind', icon: '🎨' },
];

const features = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Smart Prompt Library',
    description: 'Access hundreds of premium UI prompts ready to generate sections instantly.',
    featured: true,
    badge: 'Included',
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: 'Component Generator',
    description: 'Paste prompts into Lovable, Cursor, or Bolt and instantly generate production ready UI.',
    featured: true,
    badge: 'Included',
  },
  {
    icon: <Search className="w-6 h-6" />,
    title: 'Prompt Search',
    description: 'Quickly find prompts using tags, categories, and filters.',
  },
  {
    icon: <LayoutGrid className="w-6 h-6" />,
    title: 'Prompt Categories',
    description: 'Browse prompts for hero sections, pricing tables, navbars, bento grids, and more.',
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: 'Prompt Preview',
    description: 'Preview UI sections before copying the prompt.',
  },
  {
    icon: <ClipboardCopy className="w-6 h-6" />,
    title: 'Prompt Copy',
    description: 'Copy the secret prompt with one click.',
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Favorites',
    description: 'Save your favorite prompts and build your personal prompt library.',
  },
  {
    icon: <RefreshCw className="w-6 h-6" />,
    title: 'Prompt Updates',
    description: 'New premium prompts added weekly.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Community Prompts',
    description: 'Submit prompts and share with the community.',
  },
];

const FeatureGridSection = () => {
  return (
    <section className="relative py-28 sm:py-36 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-[hsl(var(--primary)/0.06)] blur-[120px]" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[hsl(var(--accent)/0.04)] blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl lg:text-[48px] font-bold text-foreground font-display tracking-tight"
          >
            All The Tools You Need
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted-foreground text-base sm:text-lg mt-4 max-w-[560px] mx-auto leading-relaxed"
          >
            AI powered tools to build and generate modern UI components instantly
          </motion.p>

          {/* Platform Badges */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-2.5 mt-6"
          >
            {platformBadges.map((badge) => (
              <motion.span
                key={badge.name}
                whileHover={{ scale: 1.08, boxShadow: '0 0 20px -4px hsl(var(--primary) / 0.3)' }}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full border border-border/40 bg-card/60 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground hover:border-primary/30 cursor-default"
              >
                <span className="text-sm">{badge.icon}</span>
                {badge.name}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="group relative"
            >
              {/* Gradient outline glow on hover */}
              <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-[hsl(var(--primary)/0.3)] via-transparent to-[hsl(var(--accent)/0.2)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]" />

              <div
                className={`relative rounded-2xl p-6 sm:p-7 h-full transition-all duration-500 border ${
                  feature.featured
                    ? 'bg-gradient-to-br from-[hsl(var(--primary)/0.12)] via-card to-[hsl(var(--primary)/0.05)] border-[hsl(var(--primary)/0.2)] shadow-[0_0_60px_-20px_hsl(var(--primary)/0.2)]'
                    : 'bg-card/60 border-border/30 backdrop-blur-sm'
                } group-hover:shadow-[0_0_50px_-12px_hsl(var(--primary)/0.15)] group-hover:border-primary/25`}
              >
                {/* Top row: icon + badge */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      feature.featured
                        ? 'bg-gradient-to-br from-[hsl(var(--primary)/0.25)] to-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]'
                        : 'bg-[hsl(var(--muted)/0.6)] text-muted-foreground group-hover:text-[hsl(var(--primary))]'
                    } transition-colors duration-300`}
                  >
                    {feature.icon}
                  </div>
                  {feature.badge && (
                    <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-[hsl(var(--yellow)/0.15)] text-[hsl(var(--yellow))] border border-[hsl(var(--yellow)/0.25)]">
                      {feature.badge}
                    </span>
                  )}
                </div>

                {/* Content */}
                <h3 className="text-foreground font-semibold text-lg mb-2 font-display">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGridSection;
