'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Gift, 
  Search, 
  Trophy, 
  TrendingUp, 
  Users, 
  Mail, 
  CheckCircle2, 
  BarChart3, 
  Fingerprint, 
  User as UserIcon,
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const REWARD_VALUE = 5000;

export default function ManageReferralsPage() {
  const { firestore } = useFirebase();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all users to aggregate stats and show account details
  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'users'), orderBy('referralCount', 'desc'));
  }, [firestore]);

  const { data: users, isLoading } = useCollection(usersQuery);

  // Stats Calculations
  const stats = useMemo(() => {
    if (!users) return { totalVerified: 0, totalEarned: 0, activeReferrers: 0, totalUsers: 0 };
    
    return users.reduce((acc, user) => {
      const count = user.referralCount || 0;
      acc.totalVerified += count;
      acc.totalEarned += count * REWARD_VALUE;
      acc.totalUsers += 1;
      if (count > 0) acc.activeReferrers += 1;
      return acc;
    }, { totalVerified: 0, totalEarned: 0, activeReferrers: 0, totalUsers: 0 });
  }, [users]);

  // Comprehensive filter: Search by Name, Email, Code or UID
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter(user => {
      const matchesSearch = 
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.referralCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.uid?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    });
  }, [users, searchQuery]);

  const topReferrers = useMemo(() => {
    if (!users) return [];
    return users
      .filter(u => u.referralCount > 0)
      .slice(0, 5);
  }, [users]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Gift className="h-8 w-8 text-primary" />
            Affiliate Management
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Monitor account performance and invite volume across all {stats.totalUsers} platform users.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search Name, Email, or UID..." 
            className="pl-9 bg-white/5 border-white/10 rounded-xl h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/[0.02] border-white/5">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Verified</p>
              <p className="text-2xl font-bold text-white">{stats.totalVerified.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/[0.02] border-white/5">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
              <TrendingUp className="h-6 w-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Credits Issued</p>
              <p className="text-2xl font-bold text-white">{stats.totalEarned.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/[0.02] border-white/5">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Users className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Referrers</p>
              <p className="text-2xl font-bold text-white">{stats.activeReferrers}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/[0.02] border-white/5">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <Trophy className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total User Pool</p>
              <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Referrers List with Account Details (Similar to Manage Users) */}
        <div className="lg:col-span-8">
          <Card className="bg-white/[0.02] border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
            <CardHeader className="p-8 border-b border-white/5 bg-white/[0.01]">
              <CardTitle className="text-lg font-bold">Affiliate Directory</CardTitle>
              <CardDescription>Comprehensive audit of user participation and lifetime invitation metrics.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
                  ))}
                </div>
              ) : filteredUsers.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-white/[0.02]">
                      <TableRow className="border-white/5 hover:bg-transparent">
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-8 h-12">Account Identity</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12">Invitation Code</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12 text-center">Verified Refers</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12 text-right px-8">Credits Earned</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id} className="border-white/5 hover:bg-white/[0.03] transition-colors group">
                          <TableCell className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs ring-1 ring-primary/20 shrink-0">
                                <UserIcon className="h-5 w-5" />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-sm font-bold text-white truncate">{user.name || 'Anonymous User'}</span>
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                  <Mail className="h-2.5 w-2.5" />
                                  {user.email}
                                </span>
                                <span className="text-[9px] text-white/20 flex items-center gap-1 font-mono uppercase mt-0.5">
                                  <Fingerprint className="h-2 w-2" />
                                  {user.id}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.referralCode ? (
                              <code className="text-[11px] bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5 text-primary/90 font-mono font-black">
                                {user.referralCode}
                              </code>
                            ) : (
                              <span className="text-[10px] text-white/20 italic">No code assigned</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {user.referralCount > 0 ? (
                              <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold px-3">
                                {user.referralCount}
                              </Badge>
                            ) : (
                              <span className="text-[10px] text-white/10 font-bold">0</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right px-8">
                            <div className="flex flex-col items-end">
                              <span className={cn(
                                "text-sm font-black",
                                user.referralCount > 0 ? "text-white" : "text-white/20"
                              )}>
                                {((user.referralCount || 0) * REWARD_VALUE).toLocaleString()}
                              </span>
                              <span className="text-[8px] text-muted-foreground uppercase font-black tracking-tighter">Characters</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Gift className="h-12 w-12 text-white/5 mb-4" />
                  <p className="text-muted-foreground font-medium">No accounts matching "{searchQuery}" found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Referrers Leaderboard Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 rounded-[2rem] overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center justify-between mb-4">
                <Trophy className="h-6 w-6 text-primary" />
                <Badge variant="outline" className="border-primary/30 text-primary uppercase font-black text-[9px]">Global Rankings</Badge>
              </div>
              <CardTitle className="text-xl font-bold">Top Partners</CardTitle>
              <CardDescription>Users generating the most verified volume.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-2">
              <div className="space-y-4">
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />
                  ))
                ) : topReferrers.length > 0 ? (
                  topReferrers.map((leader, i) => (
                    <div key={leader.id} className="flex items-center justify-between group p-2 hover:bg-white/5 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "text-[10px] font-black w-4 text-center",
                          i === 0 ? "text-amber-400" : i === 1 ? "text-gray-400" : i === 2 ? "text-orange-400" : "text-white/20"
                        )}>{i + 1}</span>
                        <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-[10px] font-bold text-white group-hover:border-primary/30 transition-colors">
                          {leader.name?.[0] || 'U'}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-white/90 truncate max-w-[100px]">{leader.name || 'User'}</span>
                          <span className="text-[8px] font-black text-primary uppercase">{leader.referralCount} Verified</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] font-black text-white">#{leader.referralCode || '...'}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic text-center py-4">No rankings data available.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.02] border-white/5 rounded-[2rem] p-6">
            <div className="flex gap-4 items-start">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
                <BarChart3 className="h-5 w-5 text-indigo-400" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">Program Insights</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The directory lists <span className="text-primary font-bold">all registered users</span> to help you track individual account conversion potential.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
