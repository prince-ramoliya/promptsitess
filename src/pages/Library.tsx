import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, LayoutGrid, List, FolderOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ComponentCard from '@/components/ComponentCard';

interface Category { id: string; name: string; slug: string; }
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

const Library = () => {
  const [components, setComponents] = useState<ComponentWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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
    const channel = supabase
      .channel('library-realtime')
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

  const getCategoryCount = (slug: string) =>
    components.filter(c => c.categories?.slug === slug).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border/30 bg-card/20 backdrop-blur-xl sticky top-16 h-[calc(100vh-4rem)] overflow-auto hidden lg:block">
          <div className="p-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Categories</h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  selectedCategory === 'all'
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <LayoutGrid className="w-4 h-4" />
                  All Components
                </span>
                <span className="text-xs opacity-60">{components.length}</span>
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                    selectedCategory === cat.slug
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <FolderOpen className="w-4 h-4" />
                    {cat.name}
                  </span>
                  <span className="text-xs opacity-60">{getCategoryCount(cat.slug)}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground font-display tracking-tight mb-2">
              Component <span className="gradient-text">Library</span>
            </h1>
            <p className="text-muted-foreground text-sm">
              Browse {components.length} premium UI components with ready-to-use AI prompts.
            </p>
          </motion.div>

          {/* Search + Mobile Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-8 space-y-4"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search components, tags..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-card/60 backdrop-blur-xl border border-border/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.15)] transition-all duration-300 text-sm"
              />
            </div>

            {/* Mobile category pills */}
            <div className="flex gap-2 flex-wrap lg:hidden">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${selectedCategory === 'all' ? 'bg-primary text-primary-foreground' : 'bg-card/60 border border-border/40 text-muted-foreground'}`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${selectedCategory === cat.slug ? 'bg-primary text-primary-foreground' : 'bg-card/60 border border-border/40 text-muted-foreground'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Results info */}
          <div className="mb-6 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {filtered.length} component{filtered.length !== 1 ? 's' : ''} found
            </span>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((comp, i) => (
                <motion.div
                  key={comp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
              <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground text-sm">No components found matching your criteria.</p>
            </motion.div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Library;
