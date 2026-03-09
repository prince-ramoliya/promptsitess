import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Crown, SlidersHorizontal, ArrowLeft, Clock, Star, Sparkles, Lock, Bookmark, TrendingUp, ChevronDown, ArrowUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ComponentCard from '@/components/ComponentCard';

interface Category {id: string;name: string;slug: string;is_pro: boolean;}
interface ComponentData {
  id: string;
  title: string;
  preview_url: string | null;
  category_id: string | null;
  tags: string[] | null;
  secret_prompt: string;
  is_pro: boolean;
  is_featured: boolean;
  created_at: string;
  categorySlugs: string[];
  categoryNames: string[];
  categoryIsPro: boolean;
  bookmarkCount: number;
}

type SortMode = 'newest' | 'oldest' | 'a-z' | 'z-a';
type FilterMode = 'all' | 'pro' | 'free';
type DiscoverTab = 'all' | 'newest' | 'bookmarks' | 'trending';

const Library = () => {
  const { user } = useAuth();
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [discoverTab, setDiscoverTab] = useState<DiscoverTab>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const filterRef = useRef<HTMLDivElement>(null);
  const sidebarScrollRef = useRef<HTMLDivElement>(null);
  const [sidebarScrolled, setSidebarScrolled] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setShowFilters(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchBookmarks = useCallback(async () => {
    if (!user) { setBookmarkedIds(new Set()); return; }
    const { data } = await supabase.from('bookmarks').select('component_id').eq('user_id', user.id);
    if (data) setBookmarkedIds(new Set(data.map((b: any) => b.component_id)));
  }, [user]);

  const fetchData = async () => {
    const [compsRes, catsRes, compCatsRes, bookmarkCountsRes] = await Promise.all([
      supabase.from('components').select('*'),
      supabase.from('categories').select('*'),
      supabase.from('component_categories').select('component_id, category_id'),
      supabase.from('bookmarks').select('component_id'),
    ]);
    const catsData = (catsRes.data || []) as Category[];
    const catMap = new Map(catsData.map(c => [c.id, c]));
    const compCatMap = new Map<string, string[]>();
    (compCatsRes.data || []).forEach((cc: any) => {
      const arr = compCatMap.get(cc.component_id) || [];
      arr.push(cc.category_id);
      compCatMap.set(cc.component_id, arr);
    });

    // Count bookmarks per component
    const bookmarkCounts = new Map<string, number>();
    (bookmarkCountsRes.data || []).forEach((b: any) => {
      bookmarkCounts.set(b.component_id, (bookmarkCounts.get(b.component_id) || 0) + 1);
    });

    if (compsRes.data) {
      setComponents(compsRes.data.map((c: any) => {
        const catIds = compCatMap.get(c.id) || (c.category_id ? [c.category_id] : []);
        const cats = catIds.map(id => catMap.get(id)).filter(Boolean) as Category[];
        return {
          ...c,
          categorySlugs: cats.map(cat => cat.slug),
          categoryNames: cats.map(cat => cat.name),
          categoryIsPro: cats.some(cat => cat.is_pro),
          bookmarkCount: bookmarkCounts.get(c.id) || 0,
        };
      }));
    }
    setCategories(catsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    fetchBookmarks();
    const channel = supabase
      .channel('library-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'components' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookmarks' }, () => { fetchData(); fetchBookmarks(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchBookmarks]);

  const toggleBookmark = async (componentId: string) => {
    if (!user) return;
    if (bookmarkedIds.has(componentId)) {
      await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('component_id', componentId);
      setBookmarkedIds(prev => { const n = new Set(prev); n.delete(componentId); return n; });
      toast.success('Bookmark removed');
    } else {
      await supabase.from('bookmarks').insert({ user_id: user.id, component_id: componentId });
      setBookmarkedIds(prev => new Set(prev).add(componentId));
      toast.success('Bookmarked!');
    }
  };

  const isEffectivelyPro = (comp: ComponentData) => comp.is_pro || comp.categoryIsPro;
  const getCategoryCount = (slug: string) => components.filter((c) => c.categorySlugs.includes(slug)).length;
  const isPremiumUser = false;

  const handleCategoryClick = (cat: Category) => {
    if (cat.is_pro && !isPremiumUser) {
      toast.error('Upgrade to Pro to access this category');
      return;
    }
    setSelectedCategory(cat.slug);
    setDiscoverTab('all'); // reset discover tab when selecting category
  };

  const handleDiscoverTab = (tab: DiscoverTab) => {
    setDiscoverTab(tab);
    setSelectedCategory(null);
    if (tab === 'newest') setSortMode('newest');
    if (tab === 'trending') setSortMode('newest');
  };

  const filtered = components
    .filter((c) => {
      const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchCat = !selectedCategory || c.categorySlugs.includes(selectedCategory);
      const matchFilter = filterMode === 'all' ? true :
        filterMode === 'pro' ? isEffectivelyPro(c) :
        !isEffectivelyPro(c);
      const matchDiscover = 
        discoverTab === 'all' ? true :
        discoverTab === 'bookmarks' ? bookmarkedIds.has(c.id) :
        discoverTab === 'trending' ? (c as any).is_trending === true :
        discoverTab === 'newest' ? (c as any).is_newest === true :
        true;
      return matchSearch && matchCat && matchFilter && matchDiscover;
    })
    .sort((a, b) => {
      // Pinned components always first
      const aPinned = (a as any).is_pinned === true;
      const bPinned = (b as any).is_pinned === true;
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;

      if (discoverTab === 'trending') {
        return b.bookmarkCount - a.bookmarkCount;
      }
      switch (sortMode) {
        case 'newest': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'a-z': return a.title.localeCompare(b.title);
        case 'z-a': return b.title.localeCompare(a.title);
        default: return 0;
      }
    });

  const sortOptions: {value: SortMode; label: string; icon: typeof Clock;}[] = [
    { value: 'newest', label: 'Newest', icon: Clock },
    { value: 'oldest', label: 'Oldest', icon: Clock },
    { value: 'a-z', label: 'A → Z', icon: Star },
    { value: 'z-a', label: 'Z → A', icon: Star },
  ];

  const filterOptions: {value: FilterMode; label: string;}[] = [
    { value: 'all', label: 'All' },
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro' },
  ];

  const discoverItems: { tab: DiscoverTab; label: string; icon: typeof Sparkles }[] = [
    { tab: 'all', label: 'All', icon: Sparkles },
    { tab: 'newest', label: 'Newest', icon: Clock },
    { tab: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { tab: 'trending', label: 'Trending', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-72 border-r-2 border-border/50 bg-card/40 backdrop-blur-xl sticky top-16 h-[calc(100vh-4rem)] hidden lg:flex flex-col shadow-[4px_0_24px_-6px_rgba(0,0,0,0.3)] z-20">
          {/* Header */}
          <div className="px-5 pt-6 pb-4 border-b border-border/20 relative z-30">
            <div className="flex items-center gap-2 mb-5">
              {selectedCategory &&
                <button onClick={() => setSelectedCategory(null)} className="p-1.5 rounded-lg hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </button>
              }
              <h3 className="text-sm font-semibold text-foreground">Categories</h3>
            </div>
            {/* Sidebar search + filter */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted/30 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-all text-xs"
                />
              </div>
              <div ref={filterRef} className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-lg border transition-all flex-shrink-0 ${
                    showFilters
                      ? 'bg-primary/10 border-primary/40 text-primary'
                      : 'bg-muted/30 border-border/30 text-muted-foreground hover:text-foreground hover:border-primary/30'
                  }`}
                  title="Filters"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-2 w-52 rounded-xl bg-card border border-border/40 backdrop-blur-2xl shadow-2xl z-[100] p-3 space-y-3"
                    >
                      <div>
                        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 px-1">Sort by</div>
                        <div className="space-y-0.5">
                          {sortOptions.map((opt) => (
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
                      <div className="border-t border-border/30 pt-3">
                        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 px-1">Show</div>
                        <div className="flex gap-1.5">
                          {filterOptions.map((opt) => (
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
          </div>

          {/* Scrollable content */}
          <div className="relative flex-1 min-h-0">
            <div
              ref={sidebarScrollRef}
              data-lenis-prevent
              onWheelCapture={(e) => e.stopPropagation()}
              onScroll={() => {
                if (sidebarScrollRef.current) {
                  setSidebarScrolled(sidebarScrollRef.current.scrollTop > 100);
                }
              }}
              className="sidebar-scroll-area h-full overflow-y-auto"
            >
          {/* Discover section */}
          <div className="px-3 pt-4 pb-2 space-y-0.5">
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-2">
              Discover
            </div>
            {discoverItems.map((item) => (
              <button
                key={item.tab}
                onClick={() => handleDiscoverTab(item.tab)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  !selectedCategory && discoverTab === item.tab
                    ? 'bg-muted/50 text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {item.tab === 'bookmarks' && bookmarkedIds.size > 0 && (
                  <span className="ml-auto text-[10px] tabular-nums bg-primary/15 text-primary px-1.5 py-0.5 rounded-full">
                    {bookmarkedIds.size}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="mx-5 border-t border-border/20" />

          {/* Categories List */}
          <div className="px-3 pt-4 pb-6">
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-2">
              Categories
            </div>
            <div className="space-y-0.5">
              {categories.map((cat) => {
                const count = getCategoryCount(cat.slug);
                const isLocked = cat.is_pro && !isPremiumUser;
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
                    <span className="flex items-center gap-2.5 truncate text-primary-foreground">
                      {cat.name}
                      {cat.is_pro && (
                        <span className="flex-shrink-0 flex items-center gap-1 text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-[hsl(var(--yellow))] to-[hsl(45,100%,45%)] text-background shadow-[0_0_12px_-2px_hsl(var(--yellow)/0.5)]">
                          <Crown className="w-3 h-3" />PRO
                        </span>
                      )}
                      {isLocked && <Lock className="w-3 h-3 text-muted-foreground/40 flex-shrink-0" />}
                    </span>
                    <span className="text-xs text-muted-foreground/60 tabular-nums">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
            </div>{/* end scrollable content */}

            {/* Scroll to top button */}
            <AnimatePresence>
              {sidebarScrolled && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => sidebarScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="absolute bottom-4 right-4 p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors z-10"
                  title="Scroll to top"
                >
                  <ArrowUp className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-10 bg-background">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-2">
              <span style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>Component</span> <span className="gradient-text" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>Library</span>
            </h1>
            <p className="text-muted-foreground text-sm">
              Browse {components.length} premium UI components with ready-to-use AI prompts.
            </p>
          </motion.div>

          {/* Mobile search + category chips */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-8 lg:hidden">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search components, tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-card/60 backdrop-blur-xl border border-border/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-all text-sm"
              />
            </div>

            {/* Mobile discover tabs */}
            <div className="flex gap-2 flex-wrap lg:hidden mt-4 mb-2">
              {discoverItems.map((item) => (
                <button
                  key={item.tab}
                  onClick={() => handleDiscoverTab(item.tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                    discoverTab === item.tab
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card/60 border border-border/40 text-muted-foreground'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile category chips */}
            <div className="flex gap-2 flex-wrap lg:hidden mt-2">
              {categories.map((cat) => {
                const isLocked = cat.is_pro && !isPremiumUser;
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
                    {cat.is_pro && (
                      <span className="flex items-center gap-1 text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-[hsl(var(--yellow))] to-[hsl(45,100%,45%)] text-background shadow-[0_0_12px_-2px_hsl(var(--yellow)/0.5)]">
                        <Crown className="w-2.5 h-2.5" />PRO
                      </span>
                    )}
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
                {categories.find((c) => c.slug === selectedCategory)?.name}
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
                    id={comp.id}
                    title={comp.title}
                    previewUrl={comp.preview_url}
                    secretPrompt={comp.secret_prompt}
                    isPro={isEffectivelyPro(comp)}
                    isBookmarked={bookmarkedIds.has(comp.id)}
                    onToggleBookmark={toggleBookmark}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
              <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto mb-4">
                {discoverTab === 'bookmarks' ? (
                  <Bookmark className="w-7 h-7 text-muted-foreground/50" />
                ) : (
                  <Search className="w-7 h-7 text-muted-foreground/50" />
                )}
              </div>
              <p className="text-muted-foreground text-sm">
                {discoverTab === 'bookmarks'
                  ? 'No bookmarked components yet. Browse and bookmark your favorites!'
                  : 'No components found matching your criteria.'}
              </p>
            </motion.div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Library;
