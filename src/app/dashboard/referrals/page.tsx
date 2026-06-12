'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Gift, 
  Copy, 
  Check, 
  Users, 
  Zap, 
  Share2, 
  Trophy,
  Loader2,
  Lock,
  Mail,
  Calendar,
  Twitter,
  Linkedin,
  MessageCircle,
  TrendingUp,
  BarChart3,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useFirebase, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, orderBy, limit } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const REWARD_PER_REFERRAL = 5000;

export default function ReferralsPage() {
  const { user, firestore } = useFirebase();
  const [copied, setCopied] = useState(false);

  // User Profile
  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData, isLoading: isUserLoading } = useDoc(userDocRef);

  // User's own Referrals
  const referralsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'users', user.uid, 'referrals'), orderBy('createdAt', 'desc'));
  }, [user, firestore]);

  const { data: referrals, isLoading: isRefsLoading } = useCollection(referralsQuery);

  // Global Leaderboard (Top 10 users by referralCount)
  const leaderboardQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'users'),
      orderBy('referralCount', 'desc'),
      limit(10)
    );
  }, [firestore]);

  const { data: topReferrers, isLoading: isLeaderboardLoading } = useCollection(leaderboardQuery);

  const isSubscribed = userData?.plan && userData.plan !== 'free';
  
  const referralCode = userData?.referralCode || (user?.uid ? user.uid.substring(0, 8).toUpperCase() : 'QUANTIS');
  const referralLink = `https://www.quantisai.org/sign-up?ref=${referralCode}`;

  // Stats Calculations
  const verifiedReferrals = useMemo(() => 
    referrals?.filter(r => r.status === 'completed') || [], 
  [referrals]);

  const totalEarned = verifiedReferrals.length * REWARD_PER_REFERRAL;
  const conversionRate = referrals?.length 
    ? Math.round((verifiedReferrals.length / referrals.length) * 100) 
    : 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({ title: "Link Copied!", description: "Share this link with your network." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: 'twitter' | 'linkedin' | 'whatsapp') => {
    const text = `Join me on QuantisAI Labs and experience studio-quality AI voice synthesis! Use my link to get started: ${referralLink}`;
    const encodedText = encodeURIComponent(text);
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodedText}`
    };

    window.open(urls[platform], '_blank');
  };

  if (isUserLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32">
      {/* Header Section */}
      <header className="px-2 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
          <Gift className="h-3.5 w-3.5" />
          <span>Affiliate Studio</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
          Invite Friends. <br />
          <span className="text-primary">Earn Credits.</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
          Help your network discover studio-quality AI synthesis. Earn {REWARD_PER_REFERRAL.toLocaleString()} characters for every friend who joins a paid plan.
        </p>
      </header>

      {!isSubscribed ? (
        <Card className="bg-white/[0.02] border-primary/20 rounded-[2.5rem] overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
          <CardContent className="p-12 flex flex-col items-center text-center space-y-6">
            <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20 mb-4 group-hover:scale-110 transition-transform">
              <Lock className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Unlock Referral Program</h2>
              <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
                The QuantisAI Labs Refer & Earn program is available exclusively for our active subscribers. Upgrade to get your invitation link.
              </p>
            </div>
            <Button asChild size="lg" className="h-14 px-10 rounded-2xl bg-primary font-black text-lg btn-glow">
              <Link href="/dashboard/subscription">Upgrade to Unlock</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Referral Action */}
          <div className="lg:col-span-8 space-y-8">
            <Card className="bg-white/[0.02] border-white/5 rounded-[2.5rem] overflow-hidden relative shadow-2xl">
              <div className="absolute top-0 right-0 p-8">
                <Share2 className="h-6 w-6 text-white/10" />
              </div>
              <CardHeader className="p-10 pb-0">
                <CardTitle className="text-2xl font-black text-white">Your Invitation Link</CardTitle>
                <CardDescription className="text-base text-muted-foreground mt-2">
                  Every time someone joins using this link and upgrades, you get {REWARD_PER_REFERRAL.toLocaleString()} credits.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-10 space-y-10">
                <div className="space-y-3">
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

                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Quick Share</p>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => handleShare('whatsapp')}
                      className="rounded-xl border-white/10 bg-white/5 h-12 gap-2 hover:bg-green-500/10 hover:border-green-500/20"
                    >
                      <MessageCircle className="h-4 w-4 text-green-500" />
                      WhatsApp
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleShare('twitter')}
                      className="rounded-xl border-white/10 bg-white/5 h-12 gap-2 hover:bg-sky-500/10 hover:border-sky-500/20"
                    >
                      <Twitter className="h-4 w-4 text-sky-400" />
                      Twitter
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleShare('linkedin')}
                      className="rounded-xl border-white/10 bg-white/5 h-12 gap-2 hover:bg-blue-500/10 hover:border-blue-500/20"
                    >
                      <Linkedin className="h-4 w-4 text-blue-400" />
                      LinkedIn
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                    <Zap className="h-5 w-5 text-amber-400" />
                    <h4 className="font-bold text-white">Instant Credit</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">Credits are added to your balance as soon as your referral upgrades.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                    <TrendingUp className="h-5 w-5 text-indigo-400" />
                    <h4 className="font-bold text-white">No Cap</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">There is no limit to how many credits you can earn via referrals.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-bold text-white">Invite History</h3>
                <Badge variant="outline" className="bg-white/5 border-white/10 text-[10px] font-black uppercase px-3 py-1">
                  {referrals?.length || 0} Total
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
                        <div className={cn(
                          "flex items-center gap-1.5 text-[10px] font-black uppercase mb-1",
                          ref.status === 'completed' ? "text-primary" : "text-muted-foreground"
                        )}>
                          {ref.status === 'completed' ? <Check className="h-3 w-3" /> : <Loader2 className="h-3 w-3 animate-spin" />}
                          {ref.status === 'completed' ? 'Verified' : 'Pending'}
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

          {/* Sidebar Stats & Leaderboard */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-white/[0.02] border-white/5 rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 border-b border-white/5 bg-white/[0.01]">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <CardTitle className="text-lg font-bold">Network Stats</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Credits Earned</p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black text-white">{totalEarned.toLocaleString()}</span>
                    <Badge variant="outline" className="mb-2 border-primary/20 text-primary bg-primary/5 text-[9px] uppercase font-black">Chars</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Verified</p>
                    <p className="text-xl font-bold text-white">{verifiedReferrals.length}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Conv. Rate</p>
                    <p className="text-xl font-bold text-white">{conversionRate}%</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 font-bold text-xs group" asChild>
                    <Link href="/affiliate-terms">
                      Affiliate Terms
                      <ExternalLink className="ml-2 h-3 w-3 group-hover:text-primary transition-colors" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Real-time Leaderboard Module */}
            <Card className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Global Rank</span>
                </div>
                <CardTitle className="text-xl font-black text-white">Top Referrers</CardTitle>
                <CardDescription className="text-xs text-primary/70 font-bold uppercase tracking-wider">Most verified invites</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-2">
                <div className="space-y-4">
                  {isLeaderboardLoading ? (
                    [...Array(3)].map((_, i) => (
                      <div key={i} className="h-10 bg-white/5 rounded-xl animate-pulse" />
                    ))
                  ) : topReferrers && topReferrers.length > 0 ? (
                    topReferrers.map((leader, i) => (
                      <div key={leader.id} className={cn(
                        "flex items-center justify-between group",
                        leader.id === user?.uid && "bg-primary/5 -mx-4 px-4 py-2 rounded-xl"
                      )}>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-white/20 w-4">{i + 1}</span>
                          <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-[10px] font-bold text-white group-hover:border-primary/30 transition-colors">
                            {leader.name?.[0] || 'U'}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-white/90 truncate max-w-[100px]">{leader.name || 'User'}</span>
                            {leader.id === user?.uid && <span className="text-[8px] font-black text-primary uppercase">You</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-primary">{leader.referralCount || 0}</span>
                          {i === 0 && <Trophy className="h-3 w-3 text-amber-400 fill-current" />}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-center">
                       <p className="text-[10px] text-muted-foreground italic">No rankings available yet.</p>
                    </div>
                  )}
                </div>
                <Button variant="link" className="w-full mt-6 text-primary text-[10px] font-black uppercase tracking-widest p-0 h-auto" asChild>
                  <Link href="/dashboard/referrals">Community Stats →</Link>
                </Button>
              </CardContent>
            </Card>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex gap-3 items-start">
                <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                  Rewards are verified by our anti-fraud system. Self-referrals will result in account suspension.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
