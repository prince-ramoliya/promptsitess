import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquarePlus, Clock, Trash2, CheckCheck, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Suggestion {
  id: string;
  user_email: string | null;
  message: string;
  created_at: string;
  is_read: boolean;
}

const AdminSuggestions = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const { data } = await supabase
        .from('suggestions')
        .select('*')
        .order('created_at', { ascending: false });
      setSuggestions((data as Suggestion[]) || []);
      setLoading(false);
    };
    fetchSuggestions();

    const channel = supabase
      .channel('admin-suggestions')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'suggestions' },
        (payload) => {
          setSuggestions((prev) => [payload.new as Suggestion, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'suggestions' },
        (payload) => {
          setSuggestions((prev) => prev.filter((s) => s.id !== (payload.old as any).id));
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'suggestions' },
        (payload) => {
          setSuggestions((prev) =>
            prev.map((s) => (s.id === (payload.new as Suggestion).id ? (payload.new as Suggestion) : s))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('suggestions').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete suggestion');
    } else {
      toast.success('Suggestion deleted');
    }
  };

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    const { error } = await supabase.from('suggestions').update({ is_read: !currentRead }).eq('id', id);
    if (error) {
      toast.error('Failed to update suggestion');
    }
  };

  const handleMarkAllRead = async () => {
    const unreadIds = suggestions.filter((s) => !s.is_read).map((s) => s.id);
    if (unreadIds.length === 0) return;
    const { error } = await supabase.from('suggestions').update({ is_read: true }).in('id', unreadIds);
    if (error) {
      toast.error('Failed to mark all as read');
    } else {
      toast.success('All marked as read');
    }
  };

  const unreadCount = suggestions.filter((s) => !s.is_read).length;

  if (loading) return <p className="text-muted-foreground">Loading suggestions...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageSquarePlus className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Suggestions</h2>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
            {suggestions.length}
          </span>
          {unreadCount > 0 && (
            <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full font-medium">
              {unreadCount} unread
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted/30"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {suggestions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No suggestions yet.</p>
      ) : (
        <div className="space-y-3">
          {suggestions.map((s) => (
            <div
              key={s.id}
              className={`glass-card p-4 transition-all ${!s.is_read ? 'border-l-2 border-l-primary bg-primary/[0.02]' : 'opacity-75'}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground mb-2">{s.message}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {s.user_email || 'Unknown user'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(s.created_at), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleToggleRead(s.id, s.is_read)}
                    className={`p-1.5 rounded-lg transition-colors ${s.is_read ? 'text-muted-foreground hover:text-primary' : 'text-primary hover:text-primary/80'}`}
                    title={s.is_read ? 'Mark as unread' : 'Mark as read'}
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
                    title="Delete suggestion"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSuggestions;
