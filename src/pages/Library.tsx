import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Crown, SlidersHorizontal, Clock, Star, Sparkles, Lock, Bookmark, TrendingUp, X, LayoutGrid, List } from 'lucide-react';
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
type DiscoverTab = 'all' | 'featured' | 'newest' | 'bookmarks' | 'trending';

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
    setSelectedCategory(selectedCategory === cat.slug ? null : cat.slug);
    setDiscoverTab('all');
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
        discoverTab === 'featured' ? (c as any).is_featured === true :
        discoverTab === 'trending' ? (c as any).is_trending === true :
        discoverTab === 'newest' ? (c as any).is_newest === true :
        true;
      return matchSearch && matchCat && matchFilter && matchDiscover;
    })
    .sort((a, b) => {
      if (discoverTab === 'trending') return b.bookmarkCount - a.bookmarkCount;
      switch (sortMode) {
        case 'newest': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'a-z': return a.title.localeCompare(b.title);
        case 'z-a': return b.title.localeCompare(a.title);
        default: return 0;
      }
    });

  const sortOptions: {value: SortMode; label: string;}[] = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'a-z', label: 'A → Z' },
    { value: 'z-a', label: 'Z → A' },
  ];

  const filterOptions: {value: FilterMode; label: string;}[] = [
    { value: 'all', label: 'All' },
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro' },
  ];

  const discoverItems: { tab: DiscoverTab; label: string; icon: typeof Sparkles }[] = [
    { tab: 'all', label: 'All', icon: Sparkles },
    { tab: 'featured', label: 'Featured', icon: Star },
    { tab: 'newest', label: 'Newest', icon: Clock },
    { tab: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { tab: 'trending', label: 'Trending', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Sticky toolbar */}
      <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-xl border-b border-border/30">
        {/* Row 1: Search + Sort/Filter */}
        <div className="px-4 md:px-6 pt-3 pb-2 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search components..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted/30 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-all text-xs"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <span className="text-[11px] text-muted-foreground tabular-nums whitespace-nowrap hidden sm:block">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>

          {/* Sort dropdown */}
          <div ref={filterRef} className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                showFilters
                  ? 'bg-primary/10 border-primary/40 text-primary'
                  : 'bg-muted/30 border-border/30 text-muted-foreground hover:text-foreground hover:border-primary/30'
              }`}
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span className="hidden sm:inline">Filters</span>
            </button>
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-card border border-border/40 backdrop-blur-2xl shadow-2xl z-[100] p-2.5 space-y-2.5"
                >
                  <div>
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 px-1">Sort</div>
                    <div className="space-y-0.5">
                      {sortOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setSortMode(opt.value)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                            sortMode === opt.value ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-border/30 pt-2">
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 px-1">Show</div>
                    <div className="flex gap-1">
                      {filterOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setFilterMode(opt.value)}
                          className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
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

        {/* Row 2: Discover tabs + Category chips — horizontally scrollable */}
        <div className="px-4 md:px-6 pb-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {/* Discover tabs */}
          {discoverItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => handleDiscoverTab(item.tab)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${
                !selectedCategory && discoverTab === item.tab
                  ? 'bg-primary text-primary-foreground shadow-[0_0_12px_-3px_hsl(var(--primary)/0.5)]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
              }`}
            >
              <item.icon className="w-3 h-3" />
              {item.label}
              {item.tab === 'bookmarks' && bookmarkedIds.size > 0 && (
                <span className="text-[9px] tabular-nums bg-primary-foreground/20 px-1 py-0.5 rounded-full leading-none">
                  {bookmarkedIds.size}
                </span>
              )}
            </button>
          ))}

          {/* Separator */}
          <div className="w-px h-4 bg-border/40 flex-shrink-0 mx-1" />

          {/* Category chips */}
          {categories.map((cat) => {
            const isLocked = cat.is_pro && !isPremiumUser;
            const isActive = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                disabled={isLocked}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-[0_0_12px_-3px_hsl(var(--primary)/0.5)]'
                    : isLocked
                    ? 'text-muted-foreground/30 cursor-not-allowed'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
              >
                {cat.name}
                {cat.is_pro && (
                  <span className="flex items-center gap-0.5 text-[8px] font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-gradient-to-r from-[hsl(var(--yellow))] to-[hsl(45,100%,45%)] text-background leading-none">
                    <Crown className="w-2 h-2" />PRO
                  </span>
                )}
                {isLocked && <Lock className="w-2.5 h-2.5" />}
                <span className="text-[9px] opacity-50 tabular-nums">{getCategoryCount(cat.slug)}</span>
              </button>
            );
          })}
        </div>

        {/* Active filter pills */}
        {(selectedCategory || filterMode !== 'all') && (
          <div className="px-4 md:px-6 pb-2 flex items-center gap-2">
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-[10px] px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors flex items-center gap-1"
              >
                {categories.find((c) => c.slug === selectedCategory)?.name}
                <X className="w-2.5 h-2.5" />
              </button>
            )}
            {filterMode !== 'all' && (
              <button
                onClick={() => setFilterMode('all')}
                className="text-[10px] px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors flex items-center gap-1"
              >
                {filterMode === 'pro' ? 'Pro only' : 'Free only'}
                <X className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Grid content — full width, dense */}
      <div className="px-3 md:px-4 py-3">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="glass-card animate-pulse">
                <div className="aspect-[16/10] bg-muted/20 rounded-t-xl" />
                <div className="p-2.5 space-y-1.5">
                  <div className="h-3 bg-muted/30 rounded-full w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filtered.map((comp, i) => (
              <motion.div
                key={comp.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.3), duration: 0.25 }}
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="w-12 h-12 rounded-xl bg-muted/30 flex items-center justify-center mx-auto mb-3">
              {discoverTab === 'bookmarks' ? (
                <Bookmark className="w-5 h-5 text-muted-foreground/50" />
              ) : (
                <Search className="w-5 h-5 text-muted-foreground/50" />
              )}
            </div>
            <p className="text-muted-foreground text-xs">
              {discoverTab === 'bookmarks'
                ? 'No bookmarked components yet. Browse and bookmark your favorites!'
                : 'No components found matching your criteria.'}
            </p>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Library;
