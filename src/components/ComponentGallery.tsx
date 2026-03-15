import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { usePurchaseStatus } from '@/hooks/usePurchaseStatus';
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
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const { isPremium, loading: purchaseLoading } = usePurchaseStatus();

  const fetchData = async () => {
    const [compsRes, catsRes, compCatsRes] = await Promise.all([
      supabase.from('components').select('*').order('display_order', { ascending: true }),
      supabase.from('categories').select('*'),
      supabase.from('component_categories').select('component_id, category_id'),
    ]);
    const catsData = catsRes.data || [];
    const catMap = new Map(catsData.map((c: any) => [c.id, c]));
    const compCatMap = new Map<string, string[]>();
    (compCatsRes.data || []).forEach((cc: any) => {
      const arr = compCatMap.get(cc.component_id) || [];
      arr.push(cc.category_id);
      compCatMap.set(cc.component_id, arr);
    });
    if (compsRes.data) {
      setComponents(compsRes.data.map((c: any) => {
        const catIds = compCatMap.get(c.id) || (c.category_id ? [c.category_id] : []);
        const cats = catIds.map((id: string) => catMap.get(id)).filter(Boolean);
        return {
          ...c,
          categorySlugs: cats.map((cat: any) => cat.slug),
          categoryNames: cats.map((cat: any) => cat.name),
        };
      }));
    }
    if (catsData) setCategories(catsData as any);
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

  const displayed = components.slice(0, 6);

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
            Prompt <span className="gradient-text">Library</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm md:text-base">
            Browse our collection of premium AI prompts — websites, logos, photography, graphics & more.
          </p>
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
        ) : displayed.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map((comp, i) => (
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
                  secretPrompt={comp.secret_prompt}
                  isPro={comp.is_pro}
                  isPremiumUser={isPremium}
                  premiumStatusLoading={purchaseLoading}
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
