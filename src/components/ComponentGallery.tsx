import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ComponentCard from './ComponentCard';

interface ComponentData {
  id: string;
  title: string;
  preview_url: string | null;
  tags: string[] | null;
  secret_prompt: string;
  is_pro: boolean;
  categorySlugs: string[];
  categoryNames: string[];
}

const ComponentGallery = () => {
  const [components, setComponents] = useState<ComponentWithCategory[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [compsRes, catsRes] = await Promise.all([
      supabase.from('components').select('*, categories(name, slug)'),
      supabase.from('categories').select('*'),
    ]);
    if (compsRes.data) setComponents(compsRes.data as any);
    if (catsRes.data) setCategories(catsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    // Realtime subscription for components
    const channel = supabase
      .channel('public-components')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'components' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => fetchData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const filtered = components.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = selectedCategory === 'all' || c.categories?.slug === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <section id="gallery" className="section-padding relative">
      <div className="absolute inset-0 noise-bg opacity-30" />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="badge-tag text-[10px] mb-4 inline-block">CURATED COLLECTION</span>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 font-display tracking-tight">
            Component <span className="gradient-text">Library</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm md:text-base">
            Browse our collection of premium UI components with ready-to-use AI prompts.
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row gap-4 mb-10"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search components, tags..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-card/60 backdrop-blur-xl border border-border/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.15)] transition-all duration-300 text-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground mr-1 hidden md:block" />
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 ${selectedCategory === 'all' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-card/60 border border-border/40 text-muted-foreground hover:text-foreground hover:border-border/60'}`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 ${selectedCategory === cat.slug ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-card/60 border border-border/40 text-muted-foreground hover:text-foreground hover:border-border/60'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card animate-pulse">
                <div className="aspect-[16/10] bg-muted/20 rounded-t-2xl" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-muted/30 rounded-full w-2/3" />
                  <div className="h-3 bg-muted/20 rounded-full w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((comp, i) => (
              <motion.div
                key={comp.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
              >
                <ComponentCard
                  title={comp.title}
                  previewUrl={comp.preview_url}
                  categoryName={comp.categories?.name}
                  
                  secretPrompt={comp.secret_prompt}
                  isPro={comp.is_pro}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground text-sm">No components found. Check back soon!</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ComponentGallery;
