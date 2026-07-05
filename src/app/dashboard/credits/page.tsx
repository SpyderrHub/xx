'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Coins, 
  Zap, 
  TrendingUp, 
  Clock, 
  ShieldCheck,
  BarChart3,
  Loader2,
  MessageSquare,
  Sparkles,
  Music,
  ShoppingCart,
  Plus,
  Lock,
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
import Script from 'next/script';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

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

const topupPlans = [
  { 
    id: 'topup_25k', 
    name: 'Lite Pack', 
    characters: 25000, 
    price: 49, 
    desc: 'Great for small projects',
    buttonId: 'pl_T0oXNYcMxeNBOG' 
  },
  { 
    id: 'topup_50k', 
    name: 'Power Pack', 
    characters: 50000, 
    price: 99, 
    desc: 'Our most popular pack', 
    popular: true,
    buttonId: 'pl_T0opo07PIT6g6U'
  },
  { 
    id: 'topup_100k', 
    name: 'Studio Pack', 
    characters: 100000, 
    price: 149, 
    desc: 'Best value for high volume',
    buttonId: 'pl_T0os3gC0kF4oVi'
  },
];

/**
 * Specialized component to render the Razorpay Payment Button script
 * Automatically passes identity notes to the webhook to ensure reliable crediting.
 */
const RazorpayPaymentButton = ({ buttonId, userId, characters, planId }: { buttonId: string, userId?: string, characters: number, planId: string }) => {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!formRef.current) return;
    
    formRef.current.innerHTML = '';
    
    const script = document.createElement('script');
    script.src = "https://checkout.razorpay.com/v1/payment-button.js";
    script.setAttribute('data-payment_button_id', buttonId);
    
    // Attempt to pass identity notes via script attributes if the button config supports it
    // Most reliable method for buttons is usually email-based identification in the webhook
    // but we add these as hidden inputs to the form just in case the renderer uses them.
    if (userId) {
      const inputs = [
        { name: 'notes[userId]', value: userId },
        { name: 'notes[planName]', value: planId },
        { name: 'notes[credits]', value: characters.toString() }
      ];
      inputs.forEach(data => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = data.name;
        input.value = data.value;
        formRef.current?.appendChild(input);
      });
    }
    
    script.async = true;
    formRef.current.appendChild(script);
  }, [buttonId, userId, characters, planId]);

  return <form ref={formRef} className="w-full flex justify-center min-h-[48px]" />;
};

export default function CreditsPage() {
  const { user, firestore } = useFirebase();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData, isLoading } = useDoc(userDocRef);

  const handleTopup = async (plan: typeof topupPlans[0]) => {
    if (!user) return;
    
    if (userData?.plan === 'free') {
      toast({ title: 'Subscription Required', description: 'Please upgrade your plan to unlock instant top-ups.' });
      router.push('/dashboard/subscription');
      return;
    }

    setIsProcessing(plan.id);

    try {
      const idToken = await user.getIdToken();
      
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ 
          planName: plan.id, 
          billingCycle: 'one-time' 
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message);

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'QuantisAI Labs',
        description: `Top-up: ${plan.characters.toLocaleString()} Characters`,
        order_id: orderData.orderId,
        notes: {
            userId: user.uid,
            planName: plan.id,
            credits: plan.characters.toString()
        },
        handler: async (response: any) => {
          try {
            // Immediate Verification call to speed up UI update
            const verifyRes = await fetch('/api/razorpay/verify-order', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                topupType: plan.id
              }),
            });

            if (verifyRes.ok) {
              toast({ 
                title: 'Payment Verified', 
                description: `${plan.characters.toLocaleString()} characters are being added to your balance.` 
              });
            } else {
              const err = await verifyRes.json();
              throw new Error(err.message);
            }
          } catch (err: any) {
            toast({ title: 'Processing Payment', description: 'Your payment is being verified by the node.', info: true });
          }
        },
        prefill: {
          name: user.displayName || '',
          email: user.email || '',
        },
        theme: {
          color: '#FF6600',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsProcessing(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
      </div>
    );
  }

  const creditsRemaining = userData?.credits || 0;
  const plan = userData?.plan || 'free';
  const isFree = plan === 'free';
  const limit = planLimits[plan] || 3000;
  
  // Usage calculation adjusted for top-up compatibility (where balance can exceed plan limit)
  const creditsUsed = Math.max(0, limit - creditsRemaining);
  const usagePercentage = Math.min(100, (creditsUsed / limit) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-32">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Resource Management</p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Credits & Usage</h1>
          <p className="text-muted-foreground text-[10px] md:text-sm max-w-md">
            Monitor your balance. Verified via <span className="text-primary font-bold">pay.quantisai.org</span> secure node.
          </p>
        </div>
        <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 h-10 md:h-12 px-4 md:px-6 font-bold text-[10px] md:text-sm" asChild>
                <Link href="/dashboard/subscription">View Billing</Link>
            </Button>
            <Button className="rounded-xl bg-primary hover:bg-primary/90 h-10 md:h-12 px-4 md:px-6 font-black shadow-lg shadow-primary/20 btn-glow text-[10px] md:text-sm" asChild>
                <Link href="#topup-section">Instant Top-up</Link>
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
            <Card className="bg-white/[0.02] border-white/5 rounded-[2rem] overflow-hidden">
                <CardHeader className="p-6 border-b border-white/5 bg-white/[0.01]">
                    <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck className="h-3.5 md:h-4 w-3.5 md:h-4 text-primary" />
                        <CardTitle className="text-[10px] md:text-sm font-bold">Plan Benefits</CardTitle>
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
                            <li key={i} className="flex items-center justify-between text-[9px] md:text-xs">
                                <span className="text-muted-foreground font-medium">{benefit.label}</span>
                                <span className="text-white font-bold">{benefit.value}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20 rounded-[2rem] p-6">
               <div className="flex items-start gap-4">
                  <Globe className="h-5 w-5 text-primary shrink-0" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white">Security Node Active</p>
                    <p className="text-[9px] text-muted-foreground leading-relaxed">
                      Transactions verified by <span className="font-bold">pay.quantisai.org</span>. Credits added instantly upon capture.
                    </p>
                  </div>
               </div>
            </Card>
        </div>
      </div>

      <section id="topup-section" className="space-y-8 pt-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
          <div>
            <h2 className="text-lg md:text-2xl font-bold text-white flex items-center gap-3">
              <ShoppingCart className="h-4 md:h-6 w-4 md:w-6 text-primary" />
              Instant Top-ups
            </h2>
            <p className="text-muted-foreground text-[10px] md:text-sm mt-1">Add character volume to your account. Credits never expire.</p>
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 md:px-4 py-1.5 rounded-full font-black text-[7px] md:text-[10px] uppercase tracking-widest">
            High-Throughput Synthesis
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topupPlans.map((pack) => (
            <motion.div key={pack.id} whileHover={{ y: -5 }} className="relative">
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-primary text-white text-[7px] md:text-[10px] font-black uppercase px-3 md:px-4 py-1 rounded-full shadow-lg shadow-primary/20 ring-4 ring-[#0B0B0F]">
                  Most Popular
                </div>
              )}
              <Card className={cn(
                "bg-white/[0.02] border-white/5 rounded-[2rem] overflow-hidden transition-all",
                pack.popular ? "border-primary/40 bg-primary/[0.03]" : "hover:border-white/20"
              )}>
                <CardContent className="p-6 md:p-8 text-center space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-[8px] md:text-xs font-black uppercase tracking-widest text-muted-foreground">{pack.name}</h3>
                    <div className="flex items-center justify-center gap-1.5 text-white">
                      <Plus className="h-3 md:h-4 w-3 md:h-4 text-primary" />
                      <span className="text-2xl md:text-4xl font-black">{pack.characters.toLocaleString()}</span>
                    </div>
                    <p className="text-[7px] md:text-[10px] text-primary/60 font-bold uppercase tracking-widest">Characters</p>
                  </div>

                  <div className="py-4 border-y border-white/5">
                    <p className="text-[10px] md:text-sm text-muted-foreground">{pack.desc}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="text-xl md:text-3xl font-black text-white">₹{pack.price}</div>
                    
                    {isFree ? (
                      <Button 
                        asChild
                        className={cn(
                          "w-full h-11 md:h-12 rounded-xl font-black text-[10px] md:text-sm transition-all bg-primary hover:bg-primary/90 btn-glow"
                        )}
                      >
                        <Link href="/dashboard/subscription">
                          <Lock className="mr-2 h-3.5 w-3.5" />
                          Upgrade to Unlock
                        </Link>
                      </Button>
                    ) : pack.buttonId ? (
                      <div className="min-h-[48px] flex items-center justify-center">
                        <RazorpayPaymentButton buttonId={pack.buttonId} userId={user?.uid} characters={pack.characters} planId={pack.id} />
                      </div>
                    ) : (
                      <Button 
                        onClick={() => handleTopup(pack)}
                        disabled={!!isProcessing}
                        className={cn(
                          "w-full h-11 md:h-12 rounded-xl font-black text-[10px] md:text-sm transition-all",
                          pack.popular ? "bg-primary hover:bg-primary/90 btn-glow" : "bg-white text-black hover:bg-white/90"
                        )}
                      >
                        {isProcessing === pack.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Buy Now"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="space-y-6 pt-10">
        <div className="flex items-center gap-2 px-2">
            <BarChart3 className="h-3.5 md:h-5 w-3.5 md:w-5 text-primary" />
            <h2 className="text-base md:text-xl font-bold text-white">Generation Breakdown</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
                { label: 'Voice Synthesis', value: '72%', icon: MessageSquare, color: 'text-purple-400' },
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
