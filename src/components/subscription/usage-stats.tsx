'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Coins, Clock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const planDetails: Record<string, { characterLimit: number, label: string }> = {
  free: { characterLimit: 3000, label: 'Free Explorer' },
  starter: { characterLimit: 50000, label: 'Starter Creator' },
  creator: { characterLimit: 300000, label: 'Pro Creator' },
  pro: { characterLimit: 1000000, label: 'Premium Pro' },
  business: { characterLimit: 10000000, label: 'Enterprise' },
};

export default function UsageStats({ userData }: any) {
  if (!userData) {
    return null;
  }

  const { subscriptionPlan, credits, subscriptionType } = userData;
  const currentPlan = planDetails[subscriptionPlan || 'free'] || planDetails['free'];
  
  const limit = currentPlan.characterLimit;
  const used = Math.max(0, limit - credits);
  const percentage = Math.min(100, (used / limit) * 100);

  const isPaidPlan = ['starter', 'creator', 'pro'].includes(subscriptionPlan?.toLowerCase());

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-white/[0.02] border-white/5 rounded-[2.5rem] overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Coins className="h-16 w-16 text-primary" />
        </div>
        <CardHeader className="p-8 pb-4">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 uppercase font-black text-[9px] px-3 py-1">
              Current Package
            </Badge>
            {subscriptionType && (
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                Billed {subscriptionType}
              </span>
            )}
          </div>
          <CardTitle className="text-3xl font-black text-white">{currentPlan.label}</CardTitle>
          <CardDescription className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">
            {credits.toLocaleString()} Characters Remaining
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-4 space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
              <span>Usage Meter</span>
              <span>{percentage.toFixed(1)}%</span>
            </div>
            <Progress value={percentage} className="h-2 rounded-full bg-white/5" />
            <div className="flex justify-between text-[9px] font-mono text-muted-foreground uppercase">
              <span>0 Chars</span>
              <span>{limit.toLocaleString()} Limit</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/[0.02] border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <CardHeader className="p-8 pb-4">
          <div className="flex items-center gap-2 mb-4">
             <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <Clock className="h-4 w-4 text-indigo-400" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Subscription Status</span>
          </div>
          <CardTitle className="text-xl font-bold text-white">Account Standing</CardTitle>
        </CardHeader>
        <CardContent className="p-8 pt-4 space-y-6">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payment Status</p>
            <div className="flex items-center gap-1.5">
              <div className={cn(
                "h-1.5 w-1.5 rounded-full animate-pulse",
                isPaidPlan ? "bg-emerald-500" : "bg-amber-500"
              )} />
              <p className="text-sm font-bold text-white capitalize">
                {isPaidPlan ? 'active' : (userData.paymentStatus || 'inactive')}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
             <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                   <Sparkles className="h-4 w-4 text-primary" />
                   <span className="text-xs font-bold text-white">Priority Synthesis</span>
                </div>
                <Badge className="bg-primary/20 text-primary border-none text-[9px] font-black uppercase">Enabled</Badge>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}