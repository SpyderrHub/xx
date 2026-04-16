'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import CurrentPlanCard from '@/components/subscription/current-plan-card';
import PlanCard from '@/components/subscription/plan-card';
import UsageStats from '@/components/subscription/usage-stats';
import PaymentHistoryTable from '@/components/subscription/payment-history-table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import Script from 'next/script';

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
        '1 project',
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
      description: 'For power users with high-volume needs.',
      features: [
        '1,000,000 characters/month',
        'Max 360 min audio generation',
        'All premium voices',
        '30 daily Pro generations',
        'Advanced voice cloning',
        'Priority API access',
        'Email support',
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
        '1 project',
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
        'All premium voices',
        '30 daily Pro generations',
        'Advanced voice cloning',
        'Priority API access',
        'Email support',
      ],
      isHighlighted: false,
    },
  ],
};

export default function SubscriptionPage() {
  const [isYearly, setIsYearly] = useState(false);
  const { user, firestore } = useFirebase();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData, isLoading: isUserLoading } = useDoc(userDocRef);

  const displayPlans = isYearly ? plans.yearly : plans.monthly;
  const currentPlanName = userData?.plan || 'free';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-12"
    >
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription & Billing</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your plan, usage, and billing settings.
          </p>
        </div>
        <div className="flex items-center space-x-3 rounded-full bg-card/50 p-1 border">
          <Label htmlFor="billing-cycle" className="pl-2">Monthly</Label>
          <Switch
            id="billing-cycle"
            checked={isYearly}
            onCheckedChange={setIsYearly}
            aria-label="Toggle billing cycle"
          />
          <Label htmlFor="billing-cycle">Yearly</Label>
          <div className="rounded-full border border-green-500/50 bg-green-500/10 px-3 py-1 text-xs text-green-400">
            Save ~20%
          </div>
        </div>
      </div>

      {isUserLoading ? (
        <Skeleton className="h-48 w-full rounded-2xl" />
      ) : (
        <CurrentPlanCard userData={userData} />
      )}
      
      {isUserLoading ? (
          <Skeleton className="h-48 w-full rounded-2xl" />
      ) : (
          <UsageStats userData={userData} />
      )}

      <div id="pricing-plans">
        <h2 className="mb-8 text-2xl font-semibold tracking-tight text-center">
          Choose the plan that's right for you
        </h2>
        <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {displayPlans.map((plan) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              currentPlanName={currentPlanName}
              billingCycle={isYearly ? 'yearly' : 'monthly'}
            />
          ))}
        </div>
      </div>

      <PaymentHistoryTable />
    </motion.div>
  );
}
