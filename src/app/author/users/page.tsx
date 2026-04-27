
'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Mail, 
  Shield, 
  Calendar,
  AlertTriangle,
  Info,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ManageUsersPage() {
  const { firestore } = useFirebase();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all users
  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'users'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: users, isLoading } = useCollection(usersQuery);

  // Analyze IP Conflicts (More than 2 accounts per IP)
  const ipConflictMap = useMemo(() => {
    if (!users) return new Map<string, number>();
    const counts = new Map<string, number>();
    users.forEach(u => {
      if (u.lastIp && u.lastIp !== 'unknown') {
        counts.set(u.lastIp, (counts.get(u.lastIp) || 0) + 1);
      }
    });
    return counts;
  }, [users]);

  const filteredUsers = users?.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastIp?.includes(searchQuery)
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
          <p className="text-muted-foreground mt-1 text-sm">Security & Access Management Dashboard.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, email, or IP..." 
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
            <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Shared IP Alerts</p>
              <p className="text-2xl font-bold text-white">
                {Array.from(ipConflictMap.values()).filter(count => count > 2).length}
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
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Today</p>
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
          <TooltipProvider>
            {isLoading ? (
              <div className="p-8 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-xl" />
                ))}
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-white/[0.02]">
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-8 h-12">Account Details</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12">Plan Status</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12">Last Known IP</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12">Joined</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12 text-right px-8">Security</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => {
                      const ipCount = user.lastIp ? (ipConflictMap.get(user.lastIp) || 0) : 0;
                      const hasConflict = ipCount > 2;

                      return (
                        <TableRow key={user.id} className="border-white/5 hover:bg-white/[0.03] transition-colors group">
                          <TableCell className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0 ring-1 ring-primary/20">
                                {user.name ? user.name[0].toUpperCase() : 'U'}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-white truncate">{user.name || 'Unknown'}</span>
                                  {hasConflict && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <AlertTriangle className="h-3.5 w-3.5 text-red-500 cursor-help" />
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-red-600 text-white font-bold border-none">
                                        Multi-Account Detection: {ipCount} users share this IP.
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                </div>
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
                            <span className="text-xs font-mono text-muted-foreground">
                              {user.lastIp || 'No data'}
                            </span>
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
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Users className="h-12 w-12 text-white/5 mb-4" />
                <p className="text-muted-foreground font-medium">No users found matching your search.</p>
              </div>
            )}
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
}
