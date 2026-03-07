import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquarePlus, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Suggestion {
  id: string;
  user_email: string | null;
  message: string;
  created_at: string;
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
      setSuggestions(data || []);
      setLoading(false);
    };
    fetchSuggestions();

    // Realtime subscription
    const channel = supabase
      .channel('admin-suggestions')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'suggestions' },
        (payload) => {
          setSuggestions((prev) => [payload.new as Suggestion, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading suggestions...</p>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <MessageSquarePlus className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Suggestions</h2>
        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
          {suggestions.length}
        </span>
      </div>

      {suggestions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No suggestions yet.</p>
      ) : (
        <div className="space-y-3">
          {suggestions.map((s) => (
            <div key={s.id} className="glass-card p-4">
              <p className="text-sm text-foreground mb-2">{s.message}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{s.user_email || 'Unknown user'}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {format(new Date(s.created_at), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSuggestions;
