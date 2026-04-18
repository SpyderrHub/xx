'use client';

import { motion } from 'framer-motion';
import { 
  Coins, 
  Zap, 
  TrendingUp, 
  Clock, 
  ArrowUpRight, 
  Info,
  ShieldCheck,
  BarChart3,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import Link from 'next/link';
import { format } from 'date-fns';

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

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData, isLoading } = useDoc(userDocRef);

  if (isLoading) {
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
      {/* Page Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Resource Management</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Credits & Usage</h1>
          <p className="text-muted-foreground text-sm max-w-md">
            Monitor your character balance and generation resources in real-time.
          </p>
        </div>
        <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 h-12 px-6 font-bold" asChild>
                <Link href="/dashboard/subscription">View Billing</Link>
            </Button>
            <Button className="rounded-xl bg-primary hover:bg-primary/90 h-12 px-6 font-black shadow-lg shadow-primary/20 btn-glow" asChild>
                <Link href="/dashboard/subscription#pricing-plans">Get More Credits</Link>
            </Button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Balance Card */}
        <Card className="lg:col-span-2 bg-white/[0.02] border-white/5 rounded-[2.5rem] overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
          <CardHeader className="p-8 pb-4">
            <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Coins className="h-6 w-6 text-primary" />
                </div>
                <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 uppercase font-black text-[10px] px-3 py-1">
                    {planNames[plan] || 'User Plan'}
                </Badge>
            </div>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Current Character Balance</CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end gap-2">
                <span className="text-7xl font-black text-white tracking-tighter">
                    {creditsRemaining.toLocaleString()}
                </span>
                <span className="text-xl font-bold text-muted-foreground mb-3">Available Characters</span>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                    <span className="text-muted-foreground">Usage this cycle</span>
                    <span className="text-white">{usagePercentage.toFixed(1)}% Consumed</span>
                </div>
                <div className="relative">
                    <Progress value={usagePercentage} className="h-3 rounded-full bg-white/5" />
                    <div className="absolute top-0 right-0 h-full w-px bg-white/10" style={{ left: '100%' }} />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground uppercase">
                    <span>0 Chars</span>
                    <span>{limit.toLocaleString()} Limit</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                    <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-black">Daily Avg.</p>
                        <p className="text-sm font-bold text-white">~{(creditsUsed / 30).toFixed(0)} Chars</p>
                    </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                    <Clock className="h-5 w-5 text-amber-400" />
                    <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-black">Renewal Date</p>
                        <p className="text-sm font-bold text-white">
                            {userData?.currentPeriodEnd ? format(new Date(userData.currentPeriodEnd), 'MMM dd, yyyy') : 'N/A'}
                        </p>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Cards */}
        <div className="space-y-6">
            <Card className="bg-white/[0.02] border-white/5 rounded-[2rem] overflow-hidden">
                <CardHeader className="p-6 border-b border-white/5 bg-white/[0.01]">
                    <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <CardTitle className="text-sm font-bold">Plan Benefits</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <ul className="space-y-4">
                        {[
                            { label: 'Session Limit', value: plan === 'pro' ? '360 Min' : plan === 'creator' ? '120 Min' : '60 Min' },
                            { label: 'Audio Quality', value: '48kHz Neural' },
                            { label: 'Parallel Synthesis', value: plan === 'free' ? 'None' : 'Unlimited' },
                            { label: 'Custom Branding', value: plan === 'free' ? 'No' : 'Yes' },
                        ].map((benefit, i) => (
                            <li key={i} className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground font-medium">{benefit.label}</span>
                                <span className="text-white font-bold">{benefit.value}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/10 space-y-4">
                <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest text-white">How it works</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                    1 character of input text equals 1 credit. Spaces and punctuation are counted. Neural generations (Music & Designer) have a fixed cost per use as per your tier.
                </p>
                <Button variant="link" className="p-0 h-auto text-primary text-[10px] font-black uppercase tracking-widest" asChild>
                    <Link href="/docs/billing">Detailed Calculation Guide →</Link>
                </Button>
            </div>
        </div>
      </div>

      {/* Feature Usage Stats */}
      <section className="space-y-6 pt-6">
        <div className="flex items-center gap-2 px-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-white">Generation Breakdown</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
                { label: 'Voice Synthesis', value: '72%', icon: MessageSquare, color: 'text-purple-400' },
                { label: 'Voice Designer', value: '18%', icon: Sparkles, color: 'text-amber-400' },
                { label: 'Music Generator', value: '6%', icon: Music, color: 'text-emerald-400' },
                { label: 'Other Studio Tools', value: '4%', icon: Zap, color: 'text-blue-400' },
            ].map((stat, i) => (
                <Card key={i} className="bg-white/[0.02] border-white/5 hover:bg-white/[0.04] transition-colors rounded-2xl group">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center">
                                <stat.icon className={cn("h-4 w-4", stat.color)} />
                            </div>
                            <div>
                                <p className="text-[10px] text-muted-foreground uppercase font-black">{stat.label}</p>
                                <p className="text-sm font-bold text-white">{stat.value}</p>
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
