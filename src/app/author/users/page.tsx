'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Mail, 
  User as UserIcon, 
  Shield, 
  Calendar,
  CreditCard,
  Filter,
  Loader2
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export default function ManageUsersPage() {
  const { firestore } = useFirebase();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all users
  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'users'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: users, isLoading } = useCollection(usersQuery);

  const filteredUsers = users?.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getPlanColor = (plan: string) => {
    switch (plan?.toLowerCase()) {
      case 'pro': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'creator': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'starter': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-white/5 text-muted-foreground border-white/10';
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Platform Users</h1>
          <p className="text-muted-foreground mt-1 text-sm">Monitor registration growth and subscription distribution.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name or email..." 
            className="pl-9 bg-white/5 border-white/10 rounded-xl h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/[0.02] border-white/5">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Registered</p>
              <p className="text-2xl font-bold text-white">{users?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/[0.02] border-white/5">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Shield className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Premium Users</p>
              <p className="text-2xl font-bold text-white">
                {users?.filter(u => u.plan && u.plan !== 'free').length || 0}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/[0.02] border-white/5">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Calendar className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">New Today</p>
              <p className="text-2xl font-bold text-white">
                {users?.filter(u => u.createdAt && new Date(u.createdAt).toDateString() === new Date().toDateString()).length || 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="bg-white/[0.02] border-white/5 rounded-[2rem] overflow-hidden">
        <CardHeader className="p-8 border-b border-white/5 bg-white/[0.01] flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold">User Directory</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white/5 border-white/10 text-[10px] uppercase font-black px-3 py-1">
              {filteredUsers.length} Result{filteredUsers.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              ))}
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-white/[0.02]">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-8 h-12">User Details</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12">Status & Plan</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12">Balance</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12">Joined Date</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12 text-right px-8">Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-white/5 hover:bg-white/[0.03] transition-colors group">
                      <TableCell className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0 ring-1 ring-primary/20">
                            {user.name ? user.name[0].toUpperCase() : 'U'}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-white truncate">{user.name || 'Unknown'}</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getPlanColor(user.plan)}>
                          {user.plan || 'Free'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-mono text-white font-bold">{(user.credits || 0).toLocaleString()}</span>
                          <span className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">Credits</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">
                          {user.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="uppercase font-black text-[9px] px-2 py-0.5">
                          {user.role || 'user'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Users className="h-12 w-12 text-white/5 mb-4" />
              <p className="text-muted-foreground font-medium">No users found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
