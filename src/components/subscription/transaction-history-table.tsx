
'use client';

import { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { History, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TransactionHistoryTable() {
  const { user, firestore } = useFirebase();

  // Fetch subscriptions - Strictly filtered by userId to comply with Security Rules
  const subsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'user_subscriptions'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
  }, [user?.uid, firestore]);

  const { data: subs, isLoading } = useCollection(subsQuery);

  const transactions = useMemo(() => {
    const all = [
      ...(subs || []).map(s => ({
        id: s.id,
        date: new Date(s.createdAt),
        type: 'Subscription',
        description: `${s.planType?.split('_')[0].toUpperCase()} Plan Activation`,
        status: s.status || 'active',
        credits: s.planType?.includes('pro') ? 1000000 : s.planType?.includes('creator') ? 300000 : 50000,
        icon: <ShieldCheck className="h-3.5 w-3.5 text-primary" />
      }))
    ];

    return all.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [subs]);

  return (
    <Card className="bg-white/[0.02] border-white/5 rounded-[2rem] overflow-hidden">
      <CardHeader className="p-8 border-b border-white/5 bg-white/[0.01]">
        <div className="flex items-center gap-3 mb-1">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <History className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-xl font-bold">Transaction Details</CardTitle>
        </div>
        <CardDescription>Comprehensive log of subscription activations and tier status.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-white/[0.02]">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-8 h-12">Date</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12">Type</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12">Description</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12">Status</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12 text-right px-8">Credits Added</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <TableRow key={i} className="border-white/5">
                  <TableCell className="px-8"><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                  <TableCell className="px-8"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : transactions.length > 0 ? (
              transactions.map((tx) => (
                <TableRow key={tx.id} className="border-white/5 hover:bg-white/[0.03] transition-colors group">
                  <TableCell className="px-8 py-5 text-xs text-white/70 font-medium">
                    {format(tx.date, 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        {tx.icon}
                        <span className="text-xs font-bold text-white">{tx.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {tx.description}
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                        "text-[9px] uppercase font-black px-2 py-0.5 border-none",
                        tx.status === 'success' || tx.status === 'active' 
                            ? "bg-emerald-500/10 text-emerald-400" 
                            : "bg-amber-500/10 text-amber-400"
                    )}>
                        {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <span className="text-sm font-black text-primary">
                      +{tx.credits.toLocaleString()}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 opacity-30">
                    <History className="h-8 w-8" />
                    <p className="text-xs italic">No active subscriptions found for your account.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
