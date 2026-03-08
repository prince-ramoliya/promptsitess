import { useState, useEffect, useRef, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, X, Upload, Image, Film, Check, Search, Filter, Star } from 'lucide-react';

interface Category { id: string; name: string; }
interface Component {
  id: string;
  title: string;
  preview_url: string | null;
  category_id: string | null;
  tags: string[] | null;
  secret_prompt: string;
  is_pro: boolean;
  is_featured: boolean;
  is_trending: boolean;
  is_newest: boolean;
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
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [tagsStr, setTagsStr] = useState('');
  const [secretPrompt, setSecretPrompt] = useState('');
  const [isPro, setIsPro] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isNewest, setIsNewest] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategoryId, setFilterCategoryId] = useState<string>('all');
  const [filterProStatus, setFilterProStatus] = useState<string>('all');

  const fetchData = async () => {
    const [comps, cats, compCats] = await Promise.all([
      supabase.from('components').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('id, name'),
      supabase.from('component_categories').select('component_id, category_id'),
    ]);
    if (comps.data) {
      const catMap = new Map<string, string[]>();
      (compCats.data || []).forEach((cc: any) => {
        const arr = catMap.get(cc.component_id) || [];
        arr.push(cc.category_id);
        catMap.set(cc.component_id, arr);
      });
      setComponents(comps.data.map(c => ({ ...c, is_featured: (c as any).is_featured ?? false, is_trending: (c as any).is_trending ?? false, is_newest: (c as any).is_newest ?? false, categoryIds: catMap.get(c.id) || [] })));
    }
    if (cats.data) setCategories(cats.data);
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setTitle(''); setPreviewUrl(''); setSelectedCategoryIds([]); setTagsStr(''); setSecretPrompt(''); setIsPro(false); setIsFeatured(false); setIsTrending(false); setIsNewest(false);
    setEditing(null); setShowForm(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) { toast.error('Please upload an image or video file'); return; }
    if (file.size > 20 * 1024 * 1024) { toast.error('File must be under 20MB'); return; }

    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('component-previews').upload(fileName, file, { contentType: file.type });
    if (error) { toast.error('Upload failed: ' + error.message); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from('component-previews').getPublicUrl(fileName);
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
      category_id: selectedCategoryIds[0] || null,
      tags,
      secret_prompt: secretPrompt,
      is_pro: isPro,
      is_featured: isFeatured,
      is_trending: isTrending,
      is_newest: isNewest,
    };

    let componentId: string;
    if (editing) {
      const { error } = await supabase.from('components').update(payload).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      componentId = editing.id;
      await supabase.from('component_categories').delete().eq('component_id', editing.id);
    } else {
      const { data, error } = await supabase.from('components').insert(payload).select('id').single();
      if (error || !data) { toast.error(error?.message || 'Failed'); return; }
      componentId = data.id;
    }

    if (selectedCategoryIds.length > 0) {
      const rows = selectedCategoryIds.map(catId => ({ component_id: componentId, category_id: catId }));
      await supabase.from('component_categories').insert(rows);
    }

    toast.success(editing ? 'Component updated' : 'Component created');
    resetForm();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('components').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Component deleted');
    fetchData();
  };

  const toggleFeatured = async (comp: Component) => {
    const { error } = await supabase.from('components').update({ is_featured: !comp.is_featured }).eq('id', comp.id);
    if (error) { toast.error(error.message); return; }
    toast.success(comp.is_featured ? 'Removed from featured' : 'Added to featured');
    fetchData();
  };

  const startEdit = (comp: Component) => {
    setEditing(comp);
    setTitle(comp.title);
    setPreviewUrl(comp.preview_url || '');
    setSelectedCategoryIds(comp.categoryIds || (comp.category_id ? [comp.category_id] : []));
    setTagsStr(comp.tags?.join(', ') || '');
    setSecretPrompt(comp.secret_prompt);
    setIsPro(comp.is_pro);
    setIsFeatured(comp.is_featured);
    setIsTrending(comp.is_trending);
    setIsNewest(comp.is_newest);
    setShowForm(true);
  };

  const isVideo = (url: string) => /\.(mp4|webm|mov|avi)(\?|$)/i.test(url);

  const filteredComponents = useMemo(() => {
    return components.filter(comp => {
      const matchesSearch = !searchQuery || comp.title.toLowerCase().includes(searchQuery.toLowerCase()) || comp.secret_prompt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategoryId === 'all' || (comp.categoryIds || []).includes(filterCategoryId);
      const matchesPro = filterProStatus === 'all' || (filterProStatus === 'pro' ? comp.is_pro : filterProStatus === 'featured' ? comp.is_featured : !comp.is_pro);
      return matchesSearch && matchesCategory && matchesPro;
    });
  }, [components, searchQuery, filterCategoryId, filterProStatus]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Components</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="glow-button text-sm !px-5 !py-2 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Component
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card px-4 py-3 mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search components..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-muted/50 border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50"
          />
        </div>
        <select
          value={filterCategoryId}
          onChange={e => setFilterCategoryId(e.target.value)}
          className="px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50"
        >
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select
          value={filterProStatus}
          onChange={e => setFilterProStatus(e.target.value)}
          className="px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50"
        >
          <option value="all">All Types</option>
          <option value="pro">Pro Only</option>
          <option value="free">Free Only</option>
          <option value="featured">Featured Only</option>
        </select>
        <span className="text-xs text-muted-foreground">{filteredComponents.length} of {components.length}</span>
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
            <div className="relative">
              <label className="text-xs text-muted-foreground mb-1 block">Categories</label>
              <div
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-foreground text-sm cursor-pointer focus:outline-none focus:border-primary/50 min-h-[42px] flex flex-wrap gap-1.5 items-center"
              >
                {selectedCategoryIds.length === 0 && <span className="text-muted-foreground">Select categories...</span>}
                {selectedCategoryIds.map(id => {
                  const cat = categories.find(c => c.id === id);
                  return cat ? (
                    <span key={id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/20 text-primary text-xs">
                      {cat.name}
                      <X className="w-3 h-3 cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedCategoryIds(prev => prev.filter(cid => cid !== id)); }} />
                    </span>
                  ) : null;
                })}
              </div>
              {showCategoryDropdown && (
                <div className="absolute z-10 mt-1 w-full rounded-xl bg-background border border-border/50 shadow-lg max-h-48 overflow-y-auto">
                  {categories.map(c => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCategoryIds(prev => prev.includes(c.id) ? prev.filter(id => id !== c.id) : [...prev, c.id])}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-muted/50 cursor-pointer text-sm text-foreground"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedCategoryIds.includes(c.id) ? 'bg-primary border-primary' : 'border-border'}`}>
                        {selectedCategoryIds.includes(c.id) && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      {c.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Preview Upload */}
            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground mb-2 block">Preview Image / Video</label>
              <div className="flex items-start gap-4">
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
                  <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleFileUpload} className="hidden" />
                </div>
                {previewUrl && (
                  <div className="relative w-48 h-32 rounded-xl overflow-hidden border border-border/40 bg-muted/20">
                    {isVideo(previewUrl) ? (
                      <video src={previewUrl} className="w-full h-full object-cover" controls muted />
                    ) : (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    )}
                    <button onClick={() => setPreviewUrl('')} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-background/80 flex items-center justify-center">
                      <X className="w-3 h-3 text-foreground" />
                    </button>
                  </div>
                )}
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
            <div className="flex items-center gap-6">
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
              <div className="flex items-center gap-3">
                <label className="text-sm text-muted-foreground">Featured</label>
                <button
                  type="button"
                  onClick={() => setIsFeatured(!isFeatured)}
                  className={`w-10 h-6 rounded-full transition-colors ${isFeatured ? 'bg-[hsl(var(--yellow))]' : 'bg-muted'} relative`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-foreground transition-transform ${isFeatured ? 'left-[18px]' : 'left-0.5'}`} />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-muted-foreground">Trending</label>
                <button
                  type="button"
                  onClick={() => setIsTrending(!isTrending)}
                  className={`w-10 h-6 rounded-full transition-colors ${isTrending ? 'bg-accent' : 'bg-muted'} relative`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-foreground transition-transform ${isTrending ? 'left-[18px]' : 'left-0.5'}`} />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-muted-foreground">Newest</label>
                <button
                  type="button"
                  onClick={() => setIsNewest(!isNewest)}
                  className={`w-10 h-6 rounded-full transition-colors ${isNewest ? 'bg-primary' : 'bg-muted'} relative`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-foreground transition-transform ${isNewest ? 'left-[18px]' : 'left-0.5'}`} />
                </button>
              </div>
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
        {filteredComponents.map(comp => (
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
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground text-sm">{comp.title}</span>
                {comp.is_pro && <span className="badge-pro text-[10px]">PRO</span>}
                {comp.is_featured && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[hsl(var(--yellow))]/15 text-[hsl(var(--yellow))] border border-[hsl(var(--yellow))]/20">
                    ★ FEATURED
                  </span>
                )}
                {comp.is_trending && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/20">
                    ↗ TRENDING
                  </span>
                )}
                {comp.is_newest && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20">
                    ✦ NEWEST
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleFeatured(comp)}
                className={`p-2 rounded-lg transition-colors ${comp.is_featured ? 'bg-[hsl(var(--yellow))]/10 text-[hsl(var(--yellow))]' : 'hover:bg-muted/50 text-muted-foreground'}`}
                title={comp.is_featured ? 'Remove from featured' : 'Add to featured'}
              >
                <Star className={`w-4 h-4 ${comp.is_featured ? 'fill-current' : ''}`} />
              </button>
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
