'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Gift, 
  Copy, 
  Check, 
  Users, 
  Zap, 
  ArrowUpRight, 
  Share2, 
  Trophy,
  Loader2,
  Lock,
  Mail,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useFirebase, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, orderBy } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function ReferralsPage() {
  const { user, firestore } = useFirebase();
  const [copied, setCopied] = useState(false);

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData, isLoading: isUserLoading } = useDoc(userDocRef);

  const referralsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'users', user.uid, 'referrals'), orderBy('createdAt', 'desc'));
  }, [user, firestore]);

  const { data: referrals, isLoading: isRefsLoading } = useCollection(referralsQuery);

  const isSubscribed = userData?.plan && userData.plan !== 'free';
  
  // Logic: Use assigned referralCode, fallback to UID fragment if missing (for legacy users), 
  // or a default placeholder only during initial boot.
  const referralCode = userData?.referralCode || (user?.uid ? user.uid.substring(0, 8).toUpperCase() : 'QUANTIS');
  
  // Construct the fixed invitation link using the user's assigned code
  const referralLink = `https://www.quantisai.org/sign-up?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({ title: "Link Copied!", description: "Share this link with your network." });
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUserLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-32">
      {/* Header Section */}
      <header className="px-2 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
          <Gift className="h-3.5 w-3.5" />
          <span>Affiliate Network</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
          Invite Friends. <br />
          <span className="text-primary">Earn Rewards.</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
          Help others discover the power of AI voice synthesis and earn character credits for every friend who joins.
        </p>
      </header>

      {!isSubscribed ? (
        /* Locked State for Non-Subscribed Users */
        <Card className="bg-white/[0.02] border-primary/20 rounded-[2.5rem] overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
          <CardContent className="p-12 flex flex-col items-center text-center space-y-6">
            <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20 mb-4 group-hover:scale-110 transition-transform">
              <Lock className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Unlock Referral Program</h2>
              <p className="text-muted-foreground max-sm mx-auto">
                The QuantisAI Refer & Earn program is available exclusively for our Starter, Creator, and Pro subscribers.
              </p>
            </div>
            <Button asChild size="lg" className="h-14 px-10 rounded-2xl bg-primary font-black text-lg btn-glow">
              <Link href="/dashboard/subscription">Upgrade to Unlock</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Active State for Subscribed Users */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Referral Action */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-white/[0.02] border-white/5 rounded-[2.5rem] overflow-hidden relative shadow-2xl">
              <div className="absolute top-0 right-0 p-8">
                <Share2 className="h-6 w-6 text-white/10" />
              </div>
              <CardHeader className="p-10 pb-0">
                <CardTitle className="text-2xl font-black text-white">Your Referral Studio</CardTitle>
                <CardDescription className="text-base text-muted-foreground mt-2">
                  Share your link below. Rewards will be automatically credited to your balance.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Your Personal Invitation Link</label>
                  <div className="flex gap-3">
                    <Input 
                      value={referralLink} 
                      readOnly 
                      className="h-16 bg-white/5 border-white/10 rounded-2xl px-6 font-mono text-sm text-primary/80 focus:ring-0"
                    />
                    <Button 
                      onClick={handleCopy}
                      className={cn(
                        "h-16 w-16 shrink-0 rounded-2xl transition-all",
                        copied ? "bg-emerald-500 text-white" : "bg-primary text-white hover:bg-primary/90 btn-glow"
                      )}
                    >
                      {copied ? <Check className="h-6 w-6" /> : <Copy className="h-6 w-6" />}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                    <Zap className="h-5 w-5 text-amber-400" />
                    <h4 className="font-bold text-white">Instant Rewards</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">Earn character credits as soon as your referral signs up and verifies.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                    <Users className="h-5 w-5 text-indigo-400" />
                    <h4 className="font-bold text-white">Lifetime Affiliate</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">Earn commissions on every subscription renewal your referred users make.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Referrals List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-bold text-white">Successful Invites</h3>
                <Badge variant="outline" className="bg-white/5 border-white/10 text-[10px] font-black uppercase px-3 py-1">
                  {referrals?.length || 0} People
                </Badge>
              </div>

              {isRefsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : referrals && referrals.length > 0 ? (
                <div className="space-y-3">
                  {referrals.map((ref) => (
                    <div key={ref.id} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/[0.04] transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs ring-1 ring-primary/20">
                          {ref.referredUserName?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{ref.referredUserName || 'Anonymous'}</p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Mail className="h-2.5 w-2.5" />
                            {ref.referredUserEmail}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-primary mb-1">
                          <Check className="h-3 w-3" />
                          Verified
                        </div>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1 justify-end">
                          <Calendar className="h-2.5 w-2.5" />
                          {format(new Date(ref.createdAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-48 border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center text-center p-8 bg-white/[0.01]">
                  <Users className="h-8 w-8 text-white/5 mb-4" />
                  <p className="text-sm text-muted-foreground">No referrals recorded yet. Start sharing your link to earn rewards.</p>
                </div>
              )}
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white/[0.02] border-white/5 rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 border-b border-white/5 bg-white/[0.01]">
                <CardTitle className="text-lg font-bold">Network Stats</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Earned</p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black text-white">0</span>
                    <span className="text-sm font-bold text-muted-foreground mb-1.5">Credits</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Conversion Rate</p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black text-white">0%</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 font-bold text-xs" asChild>
                  <Link href="/docs/affiliate">Read Terms →</Link>
                </Button>
              </CardContent>
            </Card>

            <div className="p-8 rounded-[2rem] bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 space-y-6">
              <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-white">Referral Leaderboard</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Refer 10+ people this month to enter our monthly synthesis sweepstakes and win 1,000,000 extra credits.
                </p>
              </div>
              <Button variant="link" className="p-0 h-auto text-primary text-[10px] font-black uppercase tracking-widest" asChild>
                <Link href="/dashboard/referrals/leaderboard">View Leaderboard →</Link>
              </Button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
