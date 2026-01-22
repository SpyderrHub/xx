'use client';

import { useState } from 'react';
import CurrentPlanCard from '@/components/subscription/current-plan-card';
import PlanCard from '@/components/subscription/plan-card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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
      isCurrent: true,
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
      isCurrent: false,
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
      isCurrent: false,
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
      isCurrent: false,
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
      isCurrent: true,
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
      isCurrent: false,
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
      isCurrent: false,
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
      isCurrent: false,
      isHighlighted: false,
    },
  ],
};

const currentUserPlan = plans.monthly[0];

export default function SubscriptionPage() {
  const [isYearly, setIsYearly] = useState(false);
  const displayPlans = isYearly ? plans.yearly : plans.monthly;

  return (
    <div className="space-y-12">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your plan and billing details.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Label htmlFor="billing-cycle">Monthly</Label>
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

      <CurrentPlanCard plan={currentUserPlan} />

      <div>
        <h2 className="mb-6 text-2xl font-semibold tracking-tight">
          Available Plans
        </h2>
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          {displayPlans.map((plan) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              currentPlanName={currentUserPlan.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
