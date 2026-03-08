import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Crown, SlidersHorizontal, ArrowLeft, Clock, Star, Sparkles, Lock, ChevronDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ComponentCard from '@/components/ComponentCard';

interface Category { id: string; name: string; slug: string; is_pro: boolean; }
interface ComponentWithCategory {
  id: string;
  title: string;
  preview_url: string | null;
  category_id: string | null;
  tags: string[] | null;
  secret_prompt: string;
  is_pro: boolean;
  created_at: string;
  categories: { name: string; slug: string; is_pro: boolean } | null;
}

type SortMode = 'newest' | 'oldest' | 'a-z' | 'z-a';
type FilterMode = 'all' | 'pro' | 'free';

const Library = () => {
  const { user } = useAuth();
  const [components, setComponents] = useState<ComponentWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setShowFilters(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchData = async () => {
    const [compsRes, catsRes] = await Promise.all([
      supabase.from('components').select('*, categories(name, slug, is_pro)'),
      supabase.from('categories').select('*'),
    ]);
    if (compsRes.data) setComponents(compsRes.data as any);
    if (catsRes.data) setCategories(catsRes.data as any);
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

  const isEffectivelyPro = (comp: ComponentWithCategory) =>
    comp.is_pro || (comp.categories?.is_pro ?? false);

  const getCategoryCount = (slug: string) =>
    components.filter(c => c.categories?.slug === slug).length;

  // TODO: Replace with real premium check when subscription is added
  const isPremiumUser = false;

  const handleCategoryClick = (cat: Category) => {
    if (cat.is_pro && !isPremiumUser) {
      toast.error('Upgrade to Pro to access this category');
      return;
    }
    setSelectedCategory(cat.slug);
  };

  const filtered = components
    .filter(c => {
      const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchCat = !selectedCategory || c.categories?.slug === selectedCategory;
      const matchFilter = filterMode === 'all' ? true :
        filterMode === 'pro' ? isEffectivelyPro(c) :
        !isEffectivelyPro(c);
      return matchSearch && matchCat && matchFilter;
    })
    .sort((a, b) => {
      switch (sortMode) {
        case 'newest': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'a-z': return a.title.localeCompare(b.title);
        case 'z-a': return b.title.localeCompare(a.title);
        default: return 0;
      }
    });

  const sortOptions: { value: SortMode; label: string; icon: typeof Clock }[] = [
    { value: 'newest', label: 'Newest', icon: Clock },
    { value: 'oldest', label: 'Oldest', icon: Clock },
    { value: 'a-z', label: 'A → Z', icon: Star },
    { value: 'z-a', label: 'Z → A', icon: Star },
  ];

  const filterOptions: { value: FilterMode; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 flex min-h-screen">
        {/* Sidebar — Reference style */}
        <aside className="w-72 border-r border-border/30 bg-card/30 backdrop-blur-xl sticky top-16 h-[calc(100vh-4rem)] overflow-auto hidden lg:flex flex-col">
          {/* Header */}
          <div className="px-5 pt-6 pb-4 border-b border-border/20">
            <div className="flex items-center gap-2 mb-5">
              {selectedCategory && (
                <button onClick={() => setSelectedCategory(null)} className="p-1.5 rounded-lg hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <h3 className="text-sm font-semibold text-foreground">Categories</h3>
            </div>
            {/* Sidebar search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted/30 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-all text-xs"
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div className="px-3 pt-4 pb-2 space-y-0.5">
            <button
              onClick={() => { setSortMode('newest'); setSelectedCategory(null); setFilterMode('all'); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                !selectedCategory && sortMode === 'newest' && filterMode === 'all'
                  ? 'bg-muted/50 text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Featured
            </button>
            <button
              onClick={() => { setSortMode('newest'); setSelectedCategory(null); setFilterMode('all'); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-muted-foreground hover:text-foreground hover:bg-muted/20`}
            >
              <Clock className="w-4 h-4" />
              Newest
            </button>
          </div>

          {/* Categories List */}
          <div className="px-3 pt-2 pb-6 flex-1">
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-2">
              Categories
            </div>
            <div className="space-y-0.5">
              {categories.map(cat => {
                const count = getCategoryCount(cat.slug);
                const isLocked = cat.is_pro && !user;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all group ${
                      selectedCategory === cat.slug
                        ? 'bg-muted/50 text-foreground font-medium'
                        : isLocked
                          ? 'text-muted-foreground/50 cursor-not-allowed'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
                    }`}
                    disabled={isLocked}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      {cat.name}
                      {cat.is_pro && <Crown className="w-3 h-3 text-accent flex-shrink-0" />}
                      {isLocked && <Lock className="w-3 h-3 text-muted-foreground/40 flex-shrink-0" />}
                    </span>
                    <span className="text-xs text-muted-foreground/60 tabular-nums">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground font-display tracking-tight mb-2">
              Component <span className="gradient-text">Library</span>
            </h1>
            <p className="text-muted-foreground text-sm">
              Browse {components.length} premium UI components with ready-to-use AI prompts.
            </p>
          </motion.div>

          {/* Search + Filter bar */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-8">
            <div className="flex gap-3">
              <div className="relative flex-1 lg:hidden">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search components, tags..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-card/60 backdrop-blur-xl border border-border/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-all text-sm"
                />
              </div>

              {/* Filter dropdown */}
              <div ref={filterRef} className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-3.5 rounded-xl border text-sm font-medium transition-all duration-300 ${
                    showFilters
                      ? 'bg-primary/10 border-primary/40 text-primary'
                      : 'bg-card/60 backdrop-blur-xl border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/30'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="hidden sm:inline">Filters</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 rounded-xl bg-card border border-border/40 backdrop-blur-2xl shadow-2xl z-50 p-3 space-y-3"
                    >
                      {/* Sort */}
                      <div>
                        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 px-1">Sort by</div>
                        <div className="space-y-0.5">
                          {sortOptions.map(opt => (
                            <button
                              key={opt.value}
                              onClick={() => setSortMode(opt.value)}
                              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors ${
                                sortMode === opt.value ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                              }`}
                            >
                              <opt.icon className="w-3.5 h-3.5" />
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Filter */}
                      <div className="border-t border-border/30 pt-3">
                        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 px-1">Show</div>
                        <div className="flex gap-1.5">
                          {filterOptions.map(opt => (
                            <button
                              key={opt.value}
                              onClick={() => setFilterMode(opt.value)}
                              className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                filterMode === opt.value
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted/30 text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile category chips */}
            <div className="flex gap-2 flex-wrap lg:hidden mt-4">
              {categories.map(cat => {
                const isLocked = cat.is_pro && !user;
                return (
                  <button
                    key={cat.id}
                    onClick={() => !isLocked && setSelectedCategory(selectedCategory === cat.slug ? null : cat.slug)}
                    disabled={isLocked}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                      selectedCategory === cat.slug
                        ? 'bg-primary text-primary-foreground'
                        : isLocked
                          ? 'bg-card/40 border border-border/20 text-muted-foreground/40 cursor-not-allowed'
                          : 'bg-card/60 border border-border/40 text-muted-foreground'
                    }`}
                  >
                    {cat.name}
                    {cat.is_pro && <Crown className="w-3 h-3" />}
                    {isLocked && <Lock className="w-2.5 h-2.5" />}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Result count + active filters */}
          <div className="mb-6 flex items-center gap-3 flex-wrap">
            <span className="text-sm text-muted-foreground">
              {filtered.length} component{filtered.length !== 1 ? 's' : ''}
            </span>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors flex items-center gap-1"
              >
                {categories.find(c => c.slug === selectedCategory)?.name}
                <span className="ml-1">×</span>
              </button>
            )}
            {filterMode !== 'all' && (
              <button
                onClick={() => setFilterMode('all')}
                className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors flex items-center gap-1"
              >
                {filterMode === 'pro' ? 'Pro only' : 'Free only'}
                <span className="ml-1">×</span>
              </button>
            )}
          </div>

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
                    isPro={isEffectivelyPro(comp)}
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
