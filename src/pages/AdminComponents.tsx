import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

interface Category { id: string; name: string; }
interface Component {
  id: string;
  title: string;
  preview_url: string | null;
  category_id: string | null;
  tags: string[] | null;
  secret_prompt: string;
  is_pro: boolean;
}

const AdminComponents = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Component | null>(null);

  const [title, setTitle] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [secretPrompt, setSecretPrompt] = useState('');
  const [isPro, setIsPro] = useState(false);

  const fetchData = async () => {
    const [comps, cats] = await Promise.all([
      supabase.from('components').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('id, name'),
    ]);
    if (comps.data) setComponents(comps.data);
    if (cats.data) setCategories(cats.data);
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setTitle(''); setPreviewUrl(''); setCategoryId(''); setTagsStr(''); setSecretPrompt(''); setIsPro(false);
    setEditing(null); setShowForm(false);
  };

  const handleSave = async () => {
    if (!title.trim() || !secretPrompt.trim()) { toast.error('Title and prompt are required'); return; }
    const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
    const payload = {
      title,
      preview_url: previewUrl || null,
      category_id: categoryId || null,
      tags,
      secret_prompt: secretPrompt,
      is_pro: isPro,
    };

    if (editing) {
      const { error } = await supabase.from('components').update(payload).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Component updated');
    } else {
      const { error } = await supabase.from('components').insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success('Component created');
    }
    resetForm();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('components').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Component deleted');
    fetchData();
  };

  const startEdit = (comp: Component) => {
    setEditing(comp);
    setTitle(comp.title);
    setPreviewUrl(comp.preview_url || '');
    setCategoryId(comp.category_id || '');
    setTagsStr(comp.tags?.join(', ') || '');
    setSecretPrompt(comp.secret_prompt);
    setIsPro(comp.is_pro);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-foreground">Components</h1>
        <button onClick={() => { setShowForm(true); resetForm(); setShowForm(true); }} className="glow-button text-sm !px-5 !py-2 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Component
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">{editing ? 'Edit Component' : 'New Component'}</h3>
            <button onClick={resetForm}><X className="w-4 h-4 text-muted-foreground" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Title *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Preview Image URL</label>
              <input value={previewUrl} onChange={e => setPreviewUrl(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Category</label>
              <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50">
                <option value="">None</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Tags (comma separated)</label>
              <input value={tagsStr} onChange={e => setTagsStr(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50" placeholder="hero, landing, dark" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground mb-1 block">Secret Prompt *</label>
              <textarea value={secretPrompt} onChange={e => setSecretPrompt(e.target.value)} rows={4} className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50 resize-none" />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-muted-foreground">Pro Only</label>
              <button
                type="button"
                onClick={() => setIsPro(!isPro)}
                className={`w-10 h-6 rounded-full transition-colors ${isPro ? 'bg-primary' : 'bg-muted'} relative`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-foreground transition-transform ${isPro ? 'left-[18px]' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button onClick={handleSave} className="glow-button text-sm !px-8 !py-2.5">Save Component</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {components.map(comp => (
          <div key={comp.id} className="glass-card px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 rounded-lg bg-muted/50 overflow-hidden flex-shrink-0">
                {comp.preview_url && <img src={comp.preview_url} alt="" className="w-full h-full object-cover" />}
              </div>
              <div>
                <span className="font-medium text-foreground text-sm">{comp.title}</span>
                {comp.is_pro && <span className="badge-pro text-[10px] ml-2">PRO</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(comp)} className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Pencil className="w-4 h-4 text-muted-foreground" />
              </button>
              <button onClick={() => handleDelete(comp.id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors">
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </div>
          </div>
        ))}
        {components.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No components yet.</p>}
      </div>
    </div>
  );
};

export default AdminComponents;
