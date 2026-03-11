import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Users, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  created_at: string;
}

interface PromptCopy {
  id: string;
  component_id: string;
  created_at: string;
  component_title?: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [userCopies, setUserCopies] = useState<Record<string, PromptCopy[]>>({});
  const [copyCounts, setCopyCounts] = useState<Record<string, number>>({});
  const [loadingCopies, setLoadingCopies] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profiles) {
      setUsers(profiles);
      // Fetch copy counts for all users
      const { data: copies } = await supabase
        .from('prompt_copies')
        .select('user_id');
      if (copies) {
        const counts: Record<string, number> = {};
        copies.forEach(c => {
          counts[c.user_id] = (counts[c.user_id] || 0) + 1;
        });
        setCopyCounts(counts);
      }
    }
    setLoading(false);
  };

  const fetchUserCopies = async (userId: string) => {
    if (userCopies[userId]) {
      setExpandedUser(expandedUser === userId ? null : userId);
      return;
    }
    setLoadingCopies(userId);
    setExpandedUser(userId);

    const { data: copies } = await supabase
      .from('prompt_copies')
      .select('id, component_id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (copies && copies.length > 0) {
      // Fetch component titles
      const componentIds = [...new Set(copies.map(c => c.component_id))];
      const { data: components } = await supabase
        .from('components')
        .select('id, title')
        .in('id', componentIds);

      const titleMap: Record<string, string> = {};
      components?.forEach(c => { titleMap[c.id] = c.title; });

      const enriched = copies.map(c => ({
        ...c,
        component_title: titleMap[c.component_id] || 'Unknown',
      }));
      setUserCopies(prev => ({ ...prev, [userId]: enriched }));
    } else {
      setUserCopies(prev => ({ ...prev, [userId]: [] }));
    }
    setLoadingCopies(null);
  };

  if (loading) {
    return <div className="text-muted-foreground">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">{users.length} registered users</p>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="w-5 h-5" />
        </div>
      </div>

      <div className="border border-border/50 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/30 border-b border-border/50">
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">#</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Email</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Joined</th>
              <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3">Copies</th>
              <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <UserRow
                key={user.id}
                user={user}
                index={index + 1}
                copyCount={copyCounts[user.user_id] || 0}
                expanded={expandedUser === user.user_id}
                copies={userCopies[user.user_id]}
                loadingCopies={loadingCopies === user.user_id}
                onToggle={() => fetchUserCopies(user.user_id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface UserRowProps {
  user: UserProfile;
  index: number;
  copyCount: number;
  expanded: boolean;
  copies?: PromptCopy[];
  loadingCopies: boolean;
  onToggle: () => void;
}

const UserRow = ({ user, index, copyCount, expanded, copies, loadingCopies, onToggle }: UserRowProps) => {
  return (
    <>
      <tr className="border-b border-border/30 hover:bg-muted/20 transition-colors">
        <td className="px-4 py-3 text-sm text-muted-foreground">{index}</td>
        <td className="px-4 py-3 text-sm text-foreground font-medium">{user.email || '—'}</td>
        <td className="px-4 py-3 text-sm text-muted-foreground">
          {format(new Date(user.created_at), 'MMM d, yyyy')}
        </td>
        <td className="px-4 py-3 text-center">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
            <Copy className="w-3.5 h-3.5 text-muted-foreground" />
            {copyCount}
          </span>
        </td>
        <td className="px-4 py-3 text-center">
          <Button variant="ghost" size="sm" onClick={onToggle} className="h-8 w-8 p-0">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={5} className="bg-muted/10 px-6 py-4">
            {loadingCopies ? (
              <p className="text-sm text-muted-foreground">Loading activity...</p>
            ) : copies && copies.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Prompt Copy History</p>
                {copies.map(copy => (
                  <div key={copy.id} className="flex items-center justify-between text-sm bg-background/50 rounded-lg px-3 py-2 border border-border/30">
                    <span className="font-medium text-foreground">{copy.component_title}</span>
                    <span className="text-muted-foreground text-xs">
                      {format(new Date(copy.created_at), 'MMM d, yyyy · h:mm a')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No prompt copies yet.</p>
            )}
          </td>
        </tr>
      )}
    </>
  );
};

export default AdminUsers;
