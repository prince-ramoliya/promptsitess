import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, X, Upload, Image, Film, Check } from 'lucide-react';

interface Category { id: string; name: string; }
interface Component {
  id: string;
  title: string;
  preview_url: string | null;
  category_id: string | null;
  tags: string[] | null;
  secret_prompt: string;
  is_pro: boolean;
  categoryIds?: string[];
}

const AdminComponents = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Component | null>(null);
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [secretPrompt, setSecretPrompt] = useState('');
  const [isPro, setIsPro] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      toast.error('Please upload an image or video file');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error('File must be under 20MB');
      return;
    }

    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from('component-previews')
      .upload(fileName, file, { contentType: file.type });

    if (error) {
      toast.error('Upload failed: ' + error.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('component-previews')
      .getPublicUrl(fileName);

    setPreviewUrl(urlData.publicUrl);
    setUploading(false);
    toast.success('File uploaded!');
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

  const isVideo = (url: string) => /\.(mp4|webm|mov|avi)(\?|$)/i.test(url);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-foreground">Components</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="glow-button text-sm !px-5 !py-2 flex items-center gap-2">
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
              <label className="text-xs text-muted-foreground mb-1 block">Category</label>
              <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50">
                <option value="">None</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* Preview Upload */}
            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground mb-2 block">Preview Image / Video</label>
              <div className="flex items-start gap-4">
                {/* Upload area */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-48 h-32 rounded-xl border-2 border-dashed border-border/60 hover:border-primary/50 bg-muted/20 flex flex-col items-center justify-center cursor-pointer transition-colors group"
                >
                  {uploading ? (
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors mb-1" />
                      <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">Click to upload</span>
                      <span className="text-[9px] text-muted-foreground/60 mt-0.5">Image or Video (max 20MB)</span>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Preview */}
                {previewUrl && (
                  <div className="relative w-48 h-32 rounded-xl overflow-hidden border border-border/40 bg-muted/20">
                    {isVideo(previewUrl) ? (
                      <video src={previewUrl} className="w-full h-full object-cover" controls muted />
                    ) : (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    )}
                    <button
                      onClick={() => setPreviewUrl('')}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-background/80 flex items-center justify-center"
                    >
                      <X className="w-3 h-3 text-foreground" />
                    </button>
                  </div>
                )}

                {/* Or URL */}
                <div className="flex-1">
                  <label className="text-[10px] text-muted-foreground mb-1 block">Or paste URL</label>
                  <input value={previewUrl} onChange={e => setPreviewUrl(e.target.value)} placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Tags (comma separated)</label>
              <input value={tagsStr} onChange={e => setTagsStr(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50" placeholder="hero, landing, dark" />
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
            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground mb-1 block">Secret Prompt *</label>
              <textarea value={secretPrompt} onChange={e => setSecretPrompt(e.target.value)} rows={4} className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50 resize-none" />
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
              <div className="w-12 h-8 rounded-lg bg-muted/50 overflow-hidden flex-shrink-0 flex items-center justify-center">
                {comp.preview_url ? (
                  isVideo(comp.preview_url) ? (
                    <Film className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <img src={comp.preview_url} alt="" className="w-full h-full object-cover" />
                  )
                ) : (
                  <Image className="w-4 h-4 text-muted-foreground/40" />
                )}
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
