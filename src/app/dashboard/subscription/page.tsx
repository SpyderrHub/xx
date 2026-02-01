'use client';

import { useState } from 'react';
import Script from 'next/script';
import { motion } from 'framer-motion';

import CurrentPlanCard from '@/components/subscription/current-plan-card';
import PlanCard from '@/components/subscription/plan-card';
import UsageStats from '@/components/subscription/usage-stats';
import PaymentHistoryTable from '@/components/subscription/payment-history-table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const plans = {
  monthly: [
    {
      name: 'Free',
      price: '$0',
      priceNumeric: 0,
      period: '/ month',
      description: 'For personal projects & exploration.',
      features: [
        '10,000 characters/month',
        'Access to standard voices',
        '1 project',
        'Community support',
      ],
      isHighlighted: false,
    },
    {
      name: 'Creator',
      price: '$29',
      priceNumeric: 29,
      period: '/ month',
      description: 'For professionals & growing businesses.',
      features: [
        '500,000 characters/month',
        'Access to premium voices',
        'Voice Cloning Tool',
        'Unlimited projects',
        'API Access',
        'Email support',
      ],
      isHighlighted: true,
    },
    {
      name: 'Pro',
      price: '$99',
      priceNumeric: 99,
      period: '/ month',
      description: 'For power users with high-volume needs.',
      features: [
        '2,000,000 characters/month',
        'All premium voices',
        'Advanced voice cloning',
        'Priority API access',
        'Team collaboration (3 seats)',
        'Priority support',
      ],
      isHighlighted: false,
    },
    {
      name: 'Business',
      price: 'Custom',
      priceNumeric: -1,
      period: '',
      description: 'For large-scale applications & teams.',
      features: [
        'Unlimited characters',
        'Custom voice creation',
        'Dedicated infrastructure',
        'Enterprise SSO & security',
        'Dedicated support manager',
      ],
      isHighlighted: false,
    },
  ],
  yearly: [
    {
      name: 'Free',
      price: '$0',
      priceNumeric: 0,
      period: '/ year',
      description: 'For personal projects & exploration.',
      features: [
        '10,000 characters/month',
        'Access to standard voices',
        '1 project',
        'Community support',
      ],
      isHighlighted: false,
    },
    {
      name: 'Creator',
      price: '$278',
      priceNumeric: 278,
      period: '/ year',
      description: 'Save 20% with annual billing.',
      features: [
        '500,000 characters/month',
        'Access to premium voices',
        'Voice Cloning Tool',
        'Unlimited projects',
        'API Access',
        'Email support',
      ],
      isHighlighted: true,
    },
    {
      name: 'Pro',
      price: '$950',
      priceNumeric: 950,
      period: '/ year',
      description: 'Save 20% with annual billing.',
      features: [
        '2,000,000 characters/month',
        'All premium voices',
        'Advanced voice cloning',
        'Priority API access',
        'Team collaboration (3 seats)',
        'Priority support',
      ],
      isHighlighted: false,
    },
    {
      name: 'Business',
      price: 'Custom',
      priceNumeric: -1,
      period: '',
      description: 'For large-scale applications & teams.',
      features: [
        'Unlimited characters',
        'Custom voice creation',
        'Dedicated infrastructure',
        'Enterprise SSO & security',
        'Dedicated support manager',
      ],
      isHighlighted: false,
    },
  ],
};

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function SubscriptionPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, firestore } = useFirebase();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData, isLoading: isUserLoading } = useDoc(userDocRef);

  const handlePurchase = async (planName: string) => {
    if (!user) {
        toast({ title: 'Authentication Error', description: 'You must be logged in to subscribe.', variant: 'destructive' });
        return;
    }
    setIsProcessing(true);

    try {
        const token = await user.getIdToken();
        const res = await fetch('/api/razorpay/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ planName }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to create subscription.');
        }

        const { subscriptionId } = await res.json();
        
        const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag';

        if (!RAZORPAY_KEY_ID) {
            toast({ title: 'Configuration Error', description: 'Razorpay Key ID is not configured.', variant: 'destructive'});
            setIsProcessing(false);
            return;
        }

        const options = {
            key: RAZORPAY_KEY_ID,
            subscription_id: subscriptionId,
            name: 'VoxAI',
            description: `${planName} Plan`,
            handler: function (response: any) {
                toast({ title: 'Payment Successful', description: `Welcome to the ${planName} plan!`});
            },
            prefill: {
                name: user.displayName || '',
                email: user.email || '',
            },
            theme: {
                color: '#4F46E5',
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: any){
            toast({ title: 'Payment Failed', description: response.error.description, variant: 'destructive' });
        });
        rzp.open();

    } catch (error: any) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
        setIsProcessing(false);
    }
  };

  const displayPlans = isYearly ? plans.yearly : plans.monthly;
  const currentPlanName = userData?.plan || 'free';

  return (
    <>
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-12"
      >
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Subscription & Billing</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your plan, usage, and payment details.
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
              Save 20%
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
          <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 lg:grid-cols-4">
            {displayPlans.map((plan) => (
              <PlanCard
                key={plan.name}
                plan={plan}
                currentPlanName={currentPlanName}
                onPurchase={handlePurchase}
                isProcessing={isProcessing}
                isYearly={isYearly}
              />
            ))}
          </div>
        </div>

        <PaymentHistoryTable />
      </motion.div>
    </>
  );
}
