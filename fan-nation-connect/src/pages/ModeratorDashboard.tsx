// src/pages/ModeratorDashboard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

type Thread = { id: string; title: string; username: string; createdAt: string; };
type User   = { id: string; username: string; email: string; };
type Poll   = { id: string; title: string; totalVotes: number; };

const ModeratorDashboard = () => {
  const { token, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [threads, setThreads] = useState<Thread[]>([]);
  const [users,   setUsers]   = useState<User[]>([]);
  const [polls,   setPolls]   = useState<Poll[]>([]);
  const [activeTab, setActiveTab] = useState<'threads'|'users'|'polls'>('threads');

  // redirect if not mod or admin
  useEffect(() => {
    if (!isAuthenticated || !['moderator','admin'].includes(user!.role)) {
      toast.error("You don't have permission to access this page");
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };

  useEffect(() => {
    (async () => {
      try {
        // Do all three in parallel
        const [tRes, uRes, pRes] = await Promise.all([
          fetch('http://localhost:5000/api/threads', { headers }),
          fetch('http://localhost:5000/api/users',   { headers }),
          fetch('http://localhost:5000/api/polls',   { headers }),
        ]);

        if (!tRes.ok) throw new Error('Failed to load threads');
        if (!uRes.ok) throw new Error('Failed to load users');
        if (!pRes.ok) throw new Error('Failed to load polls');

        const [tData, uData, pData] = await Promise.all([
          tRes.json(),
          uRes.json(),
          pRes.json(),
        ]);

        setThreads(Array.isArray(tData) ? tData : []);
        setUsers(  Array.isArray(uData) ? uData : []);
        setPolls(  Array.isArray(pData) ? pData : []);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || 'Failed to fetch moderator data');
      }
    })();
  }, []);

  const deleteThread = async (id: string) => {
    if (!confirm('Delete this thread?')) return;
    const res = await fetch(`http://localhost:5000/api/threads/${id}`, {
      method: 'DELETE', headers
    });
    if (res.ok) {
      setThreads(ts => ts.filter(t => t.id !== id));
      toast.success('Thread deleted');
    } else {
      toast.error('Could not delete thread');
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    const res = await fetch(`http://localhost:5000/api/users/${id}`, {
      method: 'DELETE', headers
    });
    if (res.ok) {
      setUsers(us => us.filter(u => u.id !== id));
      toast.success('User deleted');
    } else {
      toast.error('Could not delete user');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Moderator Dashboard</h1>
      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as any)}>
        <TabsList className="mb-4">
          <TabsTrigger value="threads">Threads</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="polls">Polls</TabsTrigger>
        </TabsList>

        <TabsContent value="threads">
          {threads.length === 0
            ? <p className="p-4 text-center text-muted-foreground">No threads found.</p>
            : threads.map(t => (
              <Card key={t.id} className="mb-2">
                <CardHeader>
                  <CardTitle>{t.title}</CardTitle>
                  <CardDescription>
                    by {t.username} on {new Date(t.createdAt).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-end">
                  <Button variant="destructive" size="sm" onClick={() => deleteThread(t.id)}>
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))
          }
        </TabsContent>

        <TabsContent value="users">
          {users.length === 0
            ? <p className="p-4 text-center text-muted-foreground">No users found.</p>
            : users.map(u => (
              <Card key={u.id} className="mb-2 flex justify-between items-center p-4">
                <div>
                  <p className="font-medium">{u.username}</p>
                  <p className="text-sm text-muted-foreground">{u.email}</p>
                </div>
                <Button variant="destructive" size="sm" onClick={() => deleteUser(u.id)}>
                  Delete
                </Button>
              </Card>
            ))
          }
        </TabsContent>

        <TabsContent value="polls">
          {polls.length === 0
            ? <p className="p-4 text-center text-muted-foreground">No polls found.</p>
            : polls.map(p => (
              <Card key={p.id} className="mb-2 flex justify-between items-center p-4">
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-sm text-muted-foreground">Votes: {p.totalVotes}</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/poll/${p.id}/edit`}>Edit</Link>
                </Button>
              </Card>
            ))
          }
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModeratorDashboard;
