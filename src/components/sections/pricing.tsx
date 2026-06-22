
'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: '/ mo',
    description: 'For hobbyists testing the waters.',
    features: ['3,000 Characters', 'Watermarked Audio', '3 Premium Voices', 'Standard Support'],
    cta: 'Start Free',
    highlight: false,
  },
  {
    name: 'Starter',
    price: '₹149',
    period: '/ mo',
    description: 'Essential for new creators.',
    features: ['50,000 Characters', 'Max 60 Min Sessions', '10 Daily Pro Generations', 'No Watermarks'],
    cta: 'Select Starter',
    highlight: false,
  },
  {
    name: 'Creator',
    price: '₹399',
    period: '/ mo',
    description: 'Perfect for professionals.',
    features: ['300,000 Characters', 'Max 120 Min Sessions', '20 Daily Pro Generations', 'Voice Cloning'],
    cta: 'Get Started',
    highlight: true,
  },
  {
    name: 'Pro',
    price: '₹999',
    period: '/ mo',
    description: 'The ultimate synthesis experience.',
    features: ['1M Characters', 'Max 360 Min Sessions', '30 Daily Pro Generations', 'Priority Support'],
    cta: 'Go Pro Now',
    highlight: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-xl font-black tracking-tight text-white sm:text-5xl mb-6">
            Predictable Pricing
          </h2>
          <p className="text-[10px] sm:text-lg text-muted-foreground">
            No enterprise taxes. No hidden tiers. Just pure synthesis at scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.name} className="flex h-full">
              <Card
                className={cn(
                  'glass-card flex flex-col rounded-[2.5rem] shadow-3d w-full',
                  plan.highlight 
                    ? 'border-primary/50 bg-primary/[0.04] ring-2 ring-primary/20 z-10' 
                    : 'border-white/5 bg-white/[0.01]'
                )}
              >
                <CardHeader className="p-8 pb-4">
                  {plan.highlight && (
                    <div className="bg-primary text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full w-fit mb-4 shadow-lg shadow-primary/20">
                      Most Popular
                    </div>
                  )}
                  <CardTitle className="text-xl sm:text-2xl font-black text-white">{plan.name}</CardTitle>
                  <CardDescription className="text-muted-foreground text-[8px] sm:text-[10px] font-bold uppercase tracking-widest pt-2">
                    {plan.description}
                  </CardDescription>
                  <div className="flex items-baseline pt-6">
                    <span className="text-3xl sm:text-5xl font-black text-white">{plan.price}</span>
                    <span className="text-muted-foreground text-[10px] sm:text-xs ml-2 font-bold uppercase tracking-tighter opacity-50">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-8 pt-4 space-y-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 opacity-80" />
                      <span className="text-[10px] sm:text-sm font-medium text-white/70">{feature}</span>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="p-8 pt-4">
                  <Button
                    asChild
                    size="lg"
                    className={cn(
                      "w-full h-12 sm:h-14 rounded-2xl font-black text-[10px] sm:text-sm transition-all",
                      plan.highlight 
                        ? "bg-primary text-white btn-glow" 
                        : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                    )}
                  >
                    <Link href="/sign-up">{plan.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
