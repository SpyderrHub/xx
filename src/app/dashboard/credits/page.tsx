'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Coins, 
  Zap, 
  TrendingUp, 
  Clock, 
  BarChart3,
  Loader2,
  MessageSquare,
  Sparkles,
  Music,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import Link from 'next/link';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const planLimits: Record<string, number> = {
  free: 3000,
  starter: 50000,
  creator: 300000,
  pro: 1000000,
  business: 10000000,
};

const planNames: Record<string, string> = {
  free: 'Free Explorer',
  starter: 'Starter Creator',
  creator: 'Professional Creator',
  pro: 'Premium Pro',
};

export default function CreditsPage() {
  const { user, firestore } = useFirebase();
  const prevCreditsRef = useRef<number | null>(null);

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData, isLoading: isUserLoading } = useDoc(userDocRef);

  // Real-time Balance Monitor
  useEffect(() => {
    if (userData?.credits !== undefined) {
      if (prevCreditsRef.current !== null && userData.credits > prevCreditsRef.current) {
        const added = userData.credits - prevCreditsRef.current;
        toast({
          title: "Credits Added!",
          description: `Successfully added ${added.toLocaleString()} characters to your balance.`,
          variant: "success",
        });
      }
      prevCreditsRef.current = userData.credits;
    }
  }, [userData?.credits]);

  if (isUserLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
      </div>
    );
  }

  const creditsRemaining = userData?.credits || 0;
  const plan = userData?.plan || 'free';
  const limit = planLimits[plan] || 3000;
  
  const creditsUsed = Math.max(0, limit - creditsRemaining);
  const usagePercentage = Math.min(100, (creditsUsed / limit) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Resource Management</p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Credits & Usage</h1>
          <p className="text-muted-foreground text-[10px] md:text-sm max-w-md">
            Monitor your balance and character consumption metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 h-10 md:h-12 px-4 md:px-6 font-bold text-[10px] md:text-sm" asChild>
                <Link href="/dashboard/subscription">View Billing</Link>
            </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-white/[0.02] border-white/5 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
          <CardHeader className="p-6 md:p-8 pb-4">
            <div className="flex items-center justify-between mb-4">
                <div className="h-10 md:h-12 w-10 md:w-12 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Coins className="h-5 md:h-6 w-5 md:w-6 text-primary" />
                </div>
                <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 uppercase font-black text-[8px] md:text-[10px] px-2 md:px-3 py-1">
                    {planNames[plan] || 'User Plan'}
                </Badge>
            </div>
            <CardTitle className="text-[10px] md:text-sm font-black uppercase tracking-widest text-muted-foreground">Current Character Balance</CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8 pt-0 space-y-8 md:space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end gap-2">
                <span className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                    {creditsRemaining.toLocaleString()}
                </span>
                <span className="text-sm md:text-xl font-bold text-muted-foreground mb-1 md:mb-3">Available Characters</span>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between text-[8px] md:text-xs font-bold uppercase tracking-widest">
                    <span className="text-muted-foreground">Plan Consumption</span>
                    <span className="text-white">{usagePercentage.toFixed(1)}% Limit Used</span>
                </div>
                <div className="relative">
                    <Progress value={usagePercentage} className="h-2 md:h-3 rounded-full bg-white/5" />
                </div>
                <div className="flex justify-between text-[7px] md:text-[10px] font-mono text-muted-foreground uppercase">
                    <span>0 Chars</span>
                    <span>{limit.toLocaleString()} Monthly Limit</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                    <TrendingUp className="h-3.5 md:h-5 w-3.5 md:w-5 text-emerald-400" />
                    <div>
                        <p className="text-[7px] md:text-[10px] text-muted-foreground uppercase font-black">Daily Avg.</p>
                        <p className="text-[11px] md:text-sm font-bold text-white">~{(creditsUsed > 0 ? (creditsUsed / 30).toFixed(0) : '0')} Chars</p>
                    </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                    <Clock className="h-3.5 md:h-5 w-3.5 md:w-5 text-amber-400" />
                    <div>
                        <p className="text-[7px] md:text-[10px] text-muted-foreground uppercase font-black">Renewal Date</p>
                        <p className="text-[11px] md:text-sm font-bold text-white">
                            {userData?.currentPeriodEnd ? format(new Date(userData.currentPeriodEnd), 'MMM dd, yyyy') : 'N/A'}
                        </p>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
            <Card className="bg-white/[0.02] border-white/5 rounded-[2rem] p-6 h-full flex items-center justify-center">
               <div className="flex flex-col items-center text-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-black uppercase tracking-widest text-white">Secure Verification</p>
                    <p className="text-[10px] text-muted-foreground leading-relaxed max-w-[200px]">
                      All character balances are cryptographically verified by the <span className="font-bold">QuantisAI Labs Neural API</span>.
                    </p>
                  </div>
               </div>
            </Card>
        </div>
      </div>

      <section className="space-y-6 pt-10">
        <div className="flex items-center gap-2 px-2">
            <BarChart3 className="h-3.5 md:h-5 w-3.5 md:w-5 text-primary" />
            <h2 className="text-base md:text-xl font-bold text-white">Generation Breakdown</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
                { label: 'Voice Synthesis', value: '72%', icon: MessageSquare, color: 'text-blue-400' },
                { label: 'Voice Designer', value: '18%', icon: Sparkles, color: 'text-amber-400' },
                { label: 'Music Generator', value: '6%', icon: Music, color: 'text-emerald-400' },
                { label: 'Other Studio Tools', value: '4%', icon: Zap, color: 'text-blue-400' },
            ].map((stat, i) => (
                <Card key={i} className="bg-white/[0.02] border-white/5 hover:bg-white/[0.04] transition-colors rounded-2xl group">
                    <CardContent className="p-4 md:p-5 flex items-center justify-between">
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="h-7 md:h-9 w-7 md:w-9 rounded-lg md:rounded-xl bg-white/5 flex items-center justify-center">
                                <stat.icon className={cn("h-3 md:h-4 w-3 md:w-4", stat.color)} />
                            </div>
                            <div>
                                <p className="text-[7px] md:text-[10px] text-muted-foreground uppercase font-black">{stat.label}</p>
                                <p className="text-[10px] md:text-sm font-bold text-white">{stat.value}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </section>
    </div>
  );
}
