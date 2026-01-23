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

const plans = {
  monthly: [
    { priceNumeric: 0, name: 'Free' },
    { priceNumeric: 29, name: 'Creator' },
    { priceNumeric: 99, name: 'Pro' },
    { priceNumeric: -1, name: 'Business' },
  ],
  yearly: [
    { priceNumeric: 0, name: 'Free' },
    { priceNumeric: 278, name: 'Creator' },
    { priceNumeric: 950, name: 'Pro' },
    { priceNumeric: -1, name: 'Business' },
  ],
};

export default function PlanCard({
  plan,
  currentPlanName,
  onPurchase,
  isProcessing,
}: any) {
  const isCurrent = plan.name.toLowerCase() === currentPlanName.toLowerCase();

  const getButtonAction = () => {
    if (isCurrent) return 'Current Plan';
    if (plan.name === 'Business') return 'Contact Sales';

    const currentPlanDetails = [
      ...plans.monthly,
      ...plans.yearly,
    ].find((p) => p.name.toLowerCase() === currentPlanName.toLowerCase());

    if (
      currentPlanDetails &&
      plan.priceNumeric > currentPlanDetails.priceNumeric
    ) {
      return 'Upgrade';
    }
    return 'Downgrade';
  };

  const buttonAction = getButtonAction();

  const handleButtonClick = () => {
    if (buttonAction === 'Upgrade') {
      onPurchase(plan.name);
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
          'flex h-full flex-col overflow-hidden rounded-2xl border-white/10 bg-black/20 shadow-lg backdrop-blur-lg',
          plan.isHighlighted && 'border-primary/50 shadow-primary/20',
          isCurrent && 'border-primary'
        )}
      >
        <CardHeader className="p-6">
          {plan.isHighlighted && (
            <div className="absolute -top-3 right-6 rounded-full bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground">
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
              <li key={feature} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-green-500" />
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
              variant={plan.isHighlighted ? 'default' : 'outline'}
              disabled={
                isCurrent || isProcessing || buttonAction !== 'Upgrade'
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
