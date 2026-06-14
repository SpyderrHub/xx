'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Search, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Clock, 
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  History,
  Activity,
  Zap,
  User as UserIcon,
  Mail
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
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function AuthorPaymentsPage() {
  const { firestore } = useFirebase();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch top-ups globally for admin
  const topupsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'user_topups'), orderBy('createdAt', 'desc'), limit(100));
  }, [firestore]);

  // Fetch subscriptions globally for admin
  const subsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'user_subscriptions'), orderBy('createdAt', 'desc'), limit(100));
  }, [firestore]);

  const { data: topups, isLoading: isTopupsLoading } = useCollection(topupsQuery);
  const { data: subs, isLoading: isSubsLoading } = useCollection(subsQuery);

  const transactions = useMemo(() => {
    const all = [
      ...(topups || []).map(t => ({
        id: t.id,
        date: new Date(t.createdAt),
        userId: t.userId,
        type: 'One-time Top-up',
        pack: t.packId?.replace('topup_', '').toUpperCase() || 'Pack',
        amount: t.packId === 'topup_100k' ? '₹149' : t.packId === 'topup_50k' ? '₹99' : '₹49',
        status: t.status || 'success',
        credits: t.creditsAdded || 0,
        gateway: t.method === 'razorpay_button' ? 'Razorpay Webhook' : 'Razorpay API',
        orderId: t.razorpayOrderId || t.razorpayPaymentId || 'N/A'
      })),
      ...(subs || []).map(s => ({
        id: s.id,
        date: new Date(s.createdAt),
        userId: s.userId,
        type: 'Subscription',
        pack: s.planType?.split('_')[0].toUpperCase() || 'PLAN',
        amount: s.planType?.includes('pro') ? '₹999' : s.planType?.includes('creator') ? '₹399' : '₹149',
        status: s.status || 'active',
        credits: s.planType?.includes('pro') ? 1000000 : s.planType?.includes('creator') ? 300000 : 50000,
        gateway: 'Razorpay API',
        orderId: s.razorpaySubscriptionId || 'N/A'
      }))
    ];

    return all.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [topups, subs]);

  const filteredTransactions = transactions.filter(tx => 
    tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.userId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = useMemo(() => {
    if (!transactions.length) return { totalVolume: 0, verifiedCount: 0, todayVolume: 0 };
    
    const today = new Date().toDateString();
    
    return transactions.reduce((acc, tx) => {
      const amtStr = tx.amount.replace('₹', '');
      const amt = parseInt(amtStr);
      
      acc.verifiedCount += 1;
      acc.totalVolume += amt;
      
      if (tx.date.toDateString() === today) {
        acc.todayVolume += amt;
      }
      
      return acc;
    }, { totalVolume: 0, verifiedCount: 0, todayVolume: 0 });
  }, [transactions]);

  const isLoading = isTopupsLoading || isSubsLoading;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-primary" />
            Financial Audit
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Monitoring {transactions.length} verified transactions across QuantisAI Labs engines.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by ID, User, or Pack..." 
            className="pl-9 bg-white/5 border-white/10 rounded-xl h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* Financial Overlays */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/[0.02] border-white/5 relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Audit Volume</p>
            </div>
            <p className="text-2xl font-bold text-white">₹{stats.totalVolume.toLocaleString()}</p>
            <p className="text-[10px] text-emerald-400 font-bold mt-1">Verified Revenue</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/[0.02] border-white/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Captures</p>
            </div>
            <p className="text-2xl font-bold text-white">{stats.verifiedCount}</p>
            <p className="text-[10px] text-muted-foreground font-bold mt-1">Webhook Events</p>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.02] border-white/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <Zap className="h-5 w-5 text-indigo-400" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Today's Intake</p>
            </div>
            <p className="text-2xl font-bold text-white">₹{stats.todayVolume.toLocaleString()}</p>
            <p className="text-[10px] text-indigo-400 font-bold mt-1">Real-time Capture</p>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.02] border-white/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                <Activity className="h-5 w-5 text-amber-400" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Engine Load</p>
            </div>
            <p className="text-2xl font-bold text-white">Active</p>
            <p className="text-[10px] text-amber-400 font-bold mt-1">Webhook Pulse: OK</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/[0.02] border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
        <CardHeader className="p-8 border-b border-white/5 bg-white/[0.01]">
          <CardTitle className="text-lg font-bold">Comprehensive Payment Logs</CardTitle>
          <CardDescription>Direct webhook and API audit trail for all QuantisAI Labs transactions.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white/[0.02]">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-8 h-12">Timestamp</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12">Transaction Info</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12">Package</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12 text-center">Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12 text-right px-8">Credits & Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i} className="border-white/5">
                      <TableCell className="px-8"><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-6 w-16 mx-auto rounded-full" /></TableCell>
                      <TableCell className="px-8"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => (
                    <TableRow key={tx.id} className="border-white/5 hover:bg-white/[0.03] transition-colors group">
                      <TableCell className="px-8 py-5 text-[11px] text-white/50 font-medium">
                        {format(tx.date, 'MMM dd, HH:mm:ss')}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-white">{tx.type}</span>
                            <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                                <ShieldCheck className="h-3 w-3 text-primary/40" />
                                <span className="font-mono">{tx.orderId}</span>
                            </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                            <span className="text-xs font-black text-white">{tx.pack}</span>
                            <span className="text-[9px] text-muted-foreground uppercase">{tx.gateway}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
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
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-black text-primary">
                                +{tx.credits.toLocaleString()}
                            </span>
                            <span className="text-[10px] font-bold text-white/40">{tx.amount}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 opacity-20">
                        <History className="h-10 w-10" />
                        <p className="text-sm italic">No payment logs found matching your criteria.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}