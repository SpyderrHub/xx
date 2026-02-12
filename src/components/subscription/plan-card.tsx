
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, Loader2 } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFirebase } from '@/firebase';
import { toast } from '@/hooks/use-toast';

export default function PlanCard({
  plan,
  currentPlanName,
  billingCycle,
}: {
  plan: any;
  currentPlanName: string;
  billingCycle: 'monthly' | 'yearly';
}) {
  const { user } = useFirebase();
  const [isProcessing, setIsProcessing] = useState(false);
  const isCurrent = plan.name.toLowerCase() === currentPlanName.toLowerCase();
  const isFree = plan.name.toLowerCase() === 'free';

  const handleSubscription = async () => {
    if (!user) {
      toast({ title: 'Login required', description: 'Please sign in to upgrade your plan.', variant: 'destructive' });
      return;
    }

    if (isFree) return;

    setIsProcessing(true);
    try {
      const idToken = await user.getIdToken();
      const planType = `${plan.name.toLowerCase()}_${billingCycle}`;

      const response = await fetch('/api/razorpay/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ planType }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to initiate subscription');

      const options = {
        key: data.keyId,
        subscription_id: data.subscriptionId,
        name: 'Saanchi AI',
        description: `${plan.name} Subscription (${billingCycle})`,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
                planType,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok) {
              toast({ title: 'Success!', description: 'Your plan has been upgraded successfully.' });
              window.location.reload();
            } else {
              throw new Error(verifyData.message || 'Payment verification failed');
            }
          } catch (err: any) {
            toast({ title: 'Verification Error', description: err.message, variant: 'destructive' });
          }
        },
        prefill: {
          name: user.displayName || '',
          email: user.email || '',
        },
        theme: {
          color: '#4F46E5',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error(error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="h-full"
    >
      <Card
        className={cn(
          'flex h-full flex-col overflow-hidden rounded-2xl border bg-card/50 shadow-lg backdrop-blur-lg transition-all',
          plan.isHighlighted && 'border-primary/50 shadow-primary/20',
          isCurrent && 'border-primary ring-2 ring-primary'
        )}
      >
        <CardHeader className="p-6 relative">
          <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
          <div className="flex items-baseline pt-2">
            <span className="text-4xl font-extrabold tracking-tight">
              {plan.price}
            </span>
            <span className="ml-1 text-muted-foreground text-sm">
              / {billingCycle === 'monthly' ? 'month' : 'year'}
            </span>
          </div>
          <CardDescription className="pt-2 min-h-[40px]">
            {plan.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-6 pt-0">
          <ul className="space-y-4">
            {plan.features.map((feature: string) => (
              <li key={feature} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-green-500 mt-0.5" />
                <span className="text-muted-foreground text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          {isCurrent ? (
            <Button
              size="lg"
              className="w-full font-bold"
              variant="secondary"
              disabled
            >
              Current Plan
            </Button>
          ) : (
            <Button
              onClick={handleSubscription}
              size="lg"
              className={cn(
                "w-full font-bold",
                plan.isHighlighted ? "bg-primary hover:bg-primary/90" : "bg-white/10 hover:bg-white/20 text-white"
              )}
              disabled={isFree || isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Zap className="mr-2 h-4 w-4" />
              )}
              {isFree ? 'Free Plan' : isCurrent ? 'Active' : 'Upgrade Now'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
