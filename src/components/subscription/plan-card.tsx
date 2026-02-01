'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react';
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
import Link from 'next/link';

// Define plans outside the component so it's not re-declared on every render
const planPrices: { [key: string]: { monthly: number, yearly: number } } = {
  free: { monthly: 0, yearly: 0 },
  creator: { monthly: 29, yearly: 278 },
  pro: { monthly: 99, yearly: 950 },
  business: { monthly: -1, yearly: -1 },
};

export default function PlanCard({
  plan,
  currentPlanName,
  onPurchase,
  isProcessing,
  isYearly, // Pass isYearly state
}: {
  plan: any;
  currentPlanName: string;
  onPurchase: (planName: string, billingCycle: 'monthly' | 'yearly') => void;
  isProcessing: boolean;
  isYearly: boolean;
}) {
  const isCurrent = plan.name.toLowerCase() === currentPlanName.toLowerCase();

  const getButtonAction = () => {
    if (isCurrent) return 'Current Plan';
    if (plan.name === 'Business') return 'Contact Sales';

    const currentPlanPrice = planPrices[currentPlanName.toLowerCase()]?.[isYearly ? 'yearly' : 'monthly'] ?? 0;
    const targetPlanPrice = plan.priceNumeric;
    
    if (targetPlanPrice < 0) return 'Contact Sales'; // For custom plans

    if (targetPlanPrice > currentPlanPrice) {
      return 'Upgrade';
    }
    return 'Downgrade';
  };

  const buttonAction = getButtonAction();

  const handleButtonClick = () => {
    if (buttonAction === 'Upgrade') {
      onPurchase(plan.name, isYearly ? 'yearly' : 'monthly');
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
          {plan.isHighlighted && (
            <div className="absolute top-0 right-6 -translate-y-1/2 rounded-full bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground">
              Most Popular
            </div>
          )}
          <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
          <div className="flex items-baseline pt-2">
            <span className="text-4xl font-extrabold tracking-tight">
              {plan.price}
            </span>
            {plan.period && (
              <span className="ml-1 text-muted-foreground">
                {plan.period}
              </span>
            )}
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
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          {plan.name === 'Business' ? (
            <Button
              asChild
              size="lg"
              className="w-full font-bold"
              variant={plan.isHighlighted ? 'default' : 'outline'}
            >
              <Link href="mailto:sales@voxai.dev">{buttonAction}</Link>
            </Button>
          ) : (
            <Button
              size="lg"
              className="w-full font-bold"
              variant={plan.isHighlighted ? 'default' : isCurrent ? 'secondary' : 'outline'}
              disabled={
                isCurrent || isProcessing || buttonAction === 'Downgrade'
              }
              onClick={handleButtonClick}
            >
              {isProcessing && buttonAction === 'Upgrade' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {buttonAction}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
