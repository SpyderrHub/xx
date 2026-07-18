'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PlanCard from '@/components/subscription/plan-card';
import UsageStats from '@/components/subscription/usage-stats';
import TransactionHistoryTable from '@/components/subscription/transaction-history-table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import Script from 'next/script';
import { CreditCard, History, Zap } from 'lucide-react';

const plans = {
  monthly: [
    {
      name: 'Free',
      price: '₹0',
      description: 'For personal projects & exploration.',
      features: [
        '3,000 characters/month',
        'Watermarked audio',
        'Access to standard voices',
        'Community support',
      ],
      isHighlighted: false,
    },
    {
      name: 'Starter',
      price: '₹149',
      description: 'The perfect kickstart for your content.',
      features: [
        '50,000 characters/month',
        'Max 60 min audio generation',
        'No watermarks',
        '10 daily Pro generations',
        'Premium voice access',
        'Standard support',
      ],
      isHighlighted: false,
    },
    {
      name: 'Creator',
      price: '₹399',
      description: 'For professionals & growing businesses.',
      features: [
        '300,000 characters/month',
        'Max 120 min audio generation',
        'No watermarks',
        '20 daily Pro generations',
        'Access to premium voices',
        'Voice Cloning Tool',
        'Email support',
      ],
      isHighlighted: true,
    },
    {
      name: 'Pro',
      price: '₹999',
      description: 'The ultimate synthesis experience.',
      features: [
        '1,000,000 characters/month',
        'Max 360 min audio generation',
        'No watermarks',
        '30 daily Pro generations',
        'All premium voices',
        'Priority Email support',
      ],
      isHighlighted: false,
    },
  ],
  yearly: [
    {
      name: 'Free',
      price: '₹0',
      description: 'For personal projects & exploration.',
      features: [
        '3,000 characters/month',
        'Watermarked audio',
        'Access to standard voices',
        'Community support',
      ],
      isHighlighted: false,
    },
    {
      name: 'Starter',
      price: '₹1,490',
      description: 'Save big with annual billing.',
      features: [
        '50,000 characters/month',
        'Max 60 min audio generation',
        'No watermarks',
        '10 daily Pro generations',
        'Premium voice access',
        'Standard support',
      ],
      isHighlighted: false,
    },
    {
      name: 'Creator',
      price: '₹3,990',
      description: 'Save big with annual billing.',
      features: [
        '300,000 characters/month',
        'Max 120 min audio generation',
        'No watermarks',
        '20 daily Pro generations',
        'Access to premium voices',
        'Voice Cloning Tool',
        'Email support',
      ],
      isHighlighted: true,
    },
    {
      name: 'Pro',
      price: '₹9,990',
      description: 'Save big with annual billing.',
      features: [
        '1,000,000 characters/month',
        'Max 360 min audio generation',
        'No watermarks',
        '30 daily Pro generations',
        'All premium voices',
        'Priority Email support',
      ],
      isHighlighted: false,
    },
  ],
};

export default function SubscriptionPage() {
  const { user, firestore } = useFirebase();
  
  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData, isLoading: isUserLoading } = useDoc(userDocRef);
  
  const [isYearly, setIsYearly] = useState(userData?.billingCycle === 'yearly');

  const displayPlans = isYearly ? plans.yearly : plans.monthly;
  const currentPlanName = userData?.plan || 'free';

  return (
    <div className="space-y-12 pb-32">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Billing Studio</p>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white">Plan & Billing</h1>
          <p className="text-muted-foreground text-xs md:text-sm max-w-md">
            Manage your subscription tier, monitor usage, and view transaction history.
          </p>
        </div>
        
        <div className="flex items-center space-x-3 rounded-full bg-white/5 p-1.5 border border-white/10 shadow-inner backdrop-blur-md">
          <Label htmlFor="billing-cycle" className={cn(
            "pl-3 text-[10px] md:text-xs font-bold uppercase transition-colors",
            !isYearly ? "text-white" : "text-white/40"
          )}>Monthly</Label>
          <Switch
            id="billing-cycle"
            checked={isYearly}
            onCheckedChange={setIsYearly}
            className="data-[state=checked]:bg-primary"
          />
          <Label htmlFor="billing-cycle" className={cn(
            "text-[10px] md:text-xs font-bold uppercase transition-colors",
            isYearly ? "text-white" : "text-white/40"
          )}>Yearly</Label>
          <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[8px] font-black uppercase text-emerald-400">
            -20% Off
          </div>
        </div>
      </header>
      
      {isUserLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-48 w-full rounded-[2.5rem] bg-white/5" />
            <Skeleton className="h-48 w-full rounded-[2.5rem] bg-white/5" />
          </div>
      ) : (
          <UsageStats userData={userData} />
      )}

      <section id="pricing-plans" className="space-y-10">
        <div className="flex items-center gap-3 px-2">
          <Zap className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-white">Available Tiers</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayPlans.map((plan) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              currentPlanName={currentPlanName}
              billingCycle={isYearly ? 'yearly' : 'monthly'}
            />
          ))}
        </div>
      </section>

      <section className="space-y-6 pt-10">
        <div className="flex items-center gap-3 px-2">
          <History className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-white">Audit Trail</h2>
        </div>
        <TransactionHistoryTable />
      </section>
    </div>
  );
}
