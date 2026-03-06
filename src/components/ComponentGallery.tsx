import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ComponentCard from './ComponentCard';

interface ComponentWithCategory {
  id: string;
  title: string;
  preview_url: string | null;
  category_id: string | null;
  tags: string[] | null;
  secret_prompt: string;
  is_pro: boolean;
  categories: { name: string; slug: string } | null;
}

const ComponentGallery = () => {
  const [components, setComponents] = useState<ComponentWithCategory[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [compsRes, catsRes] = await Promise.all([
        supabase.from('components').select('*, categories(name, slug)'),
        supabase.from('categories').select('*'),
      ]);
      if (compsRes.data) setComponents(compsRes.data as any);
      if (catsRes.data) setCategories(catsRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filtered = components.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = selectedCategory === 'all' || c.categories?.slug === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <section id="gallery" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Component <span className="gradient-text">Library</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Browse our collection of premium UI components with ready-to-use AI prompts.
          </p>
        </motion.div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search components..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors text-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedCategory === 'all' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border/50 text-muted-foreground hover:text-foreground'}`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat.slug ? 'bg-primary text-primary-foreground' : 'bg-card border border-border/50 text-muted-foreground hover:text-foreground'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card animate-pulse">
                <div className="aspect-[16/10] bg-muted/30 rounded-t-2xl" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-muted/50 rounded w-2/3" />
                  <div className="h-3 bg-muted/30 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((comp, i) => (
              <motion.div
                key={comp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <ComponentCard
                  title={comp.title}
                  previewUrl={comp.preview_url}
                  categoryName={comp.categories?.name}
                  tags={comp.tags || []}
                  secretPrompt={comp.secret_prompt}
                  isPro={comp.is_pro}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No components found. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ComponentGallery;
