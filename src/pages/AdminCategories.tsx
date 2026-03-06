import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, X, Crown } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  is_pro: boolean;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [isPro, setIsPro] = useState(false);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
    if (data) setCategories(data as any);
  };

  useEffect(() => { fetchCategories(); }, []);

  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSave = async () => {
    if (!name.trim()) { toast.error('Name is required'); return; }
    const slug = slugify(name);

    if (editing) {
      const { error } = await supabase.from('categories').update({ name, slug, is_pro: isPro }).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Category updated');
    } else {
      const { error } = await supabase.from('categories').insert({ name, slug, is_pro: isPro });
      if (error) { toast.error(error.message); return; }
      toast.success('Category created');
    }
    setName(''); setIsPro(false); setEditing(null); setShowForm(false);
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Category deleted');
    fetchCategories();
  };

  const startEdit = (cat: Category) => {
    setEditing(cat); setName(cat.name); setIsPro(cat.is_pro); setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-foreground">Categories</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setName(''); setIsPro(false); }} className="glow-button text-sm !px-5 !py-2 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">{editing ? 'Edit Category' : 'New Category'}</h3>
            <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Category name"
                className="flex-1 px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50"
              />
              <button onClick={handleSave} className="glow-button text-sm !px-6 !py-2.5">Save</button>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setIsPro(!isPro)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${isPro ? 'bg-accent' : 'bg-muted/60 border border-border/50'}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-foreground transition-transform duration-200 ${isPro ? 'translate-x-5' : ''}`} />
              </div>
              <span className="text-sm text-foreground flex items-center gap-2">
                <Crown className="w-4 h-4 text-accent" /> Pro Category
              </span>
              <span className="text-xs text-muted-foreground">— Components in this category will require subscription</span>
            </label>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {categories.map(cat => (
          <div key={cat.id} className="glass-card px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-medium text-foreground text-sm">{cat.name}</span>
              <span className="text-muted-foreground text-xs">/{cat.slug}</span>
              {cat.is_pro && (
                <span className="badge-pro flex items-center gap-1 text-[10px]">
                  <Crown className="w-3 h-3" /> PRO
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(cat)} className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Pencil className="w-4 h-4 text-muted-foreground" />
              </button>
              <button onClick={() => handleDelete(cat.id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors">
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </div>
          </div>
        ))}
        {categories.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No categories yet.</p>}
      </div>
    </div>
  );
};

export default AdminCategories;
