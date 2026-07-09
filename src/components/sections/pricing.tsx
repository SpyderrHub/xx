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
import { motion } from 'framer-motion';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: '/ mo',
    description: 'For testing and personal exploration.',
    features: ['3,000 Characters', 'Standard Neural Engine', '3 Custom Voices', 'Community Support'],
    cta: 'Start Free',
    highlight: false,
  },
  {
    name: 'Starter',
    price: '₹149',
    period: '/ mo',
    description: 'Essential for new content creators.',
    features: ['50,000 Characters', 'Batch Generation', '10 Daily Designs', 'No Watermarks', 'Standard Support'],
    cta: 'Select Starter',
    highlight: false,
  },
  {
    name: 'Creator',
    price: '₹399',
    period: '/ mo',
    description: 'Perfect for professional studios.',
    features: ['300,000 Characters', 'Instant Voice Cloning', '20 Daily Designs', 'Full API Access', 'Email Support'],
    cta: 'Get Started',
    highlight: true,
  },
  {
    name: 'Pro',
    price: '₹999',
    period: '/ mo',
    description: 'Unlimited synthesis at global scale.',
    features: ['1M Characters', 'Priority Neural Path', '30 Daily Designs', 'Ultra-Low Latency', 'Priority Support'],
    cta: 'Go Pro Now',
    highlight: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 sm:py-32 relative overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest">
            <span>Transparent Billing</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl leading-tight">
            Predictable <span className="text-primary">Pricing.</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground font-medium opacity-80">
            No enterprise taxes. No hidden tiers. Just pure synthesis at scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <motion.div 
              key={plan.name} 
              className="flex h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card
                className={cn(
                  'glass-card flex flex-col rounded-[2.5rem] shadow-3d w-full transition-all duration-500',
                  plan.highlight 
                    ? 'border-primary/50 bg-primary/[0.03] ring-2 ring-primary/20 z-10 scale-[1.03]' 
                    : 'border-white/5 bg-white/[0.01] hover:bg-white/[0.02]'
                )}
              >
                <CardHeader className="p-8 sm:p-10 pb-6">
                  {plan.highlight && (
                    <div className="bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full w-fit mb-6 shadow-lg shadow-primary/20">
                      Most Popular
                    </div>
                  )}
                  <CardTitle className="text-2xl font-black text-white tracking-tight">{plan.name}</CardTitle>
                  <CardDescription className="text-muted-foreground text-[10px] sm:text-xs font-bold uppercase tracking-widest pt-2">
                    {plan.description}
                  </CardDescription>
                  <div className="flex items-baseline pt-8">
                    <span className="text-4xl sm:text-5xl font-black text-white tracking-tighter">{plan.price}</span>
                    <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest ml-2 opacity-50">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-8 sm:p-10 pt-4 space-y-5">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 opacity-80" />
                      <span className="text-[13px] sm:text-sm font-medium text-white/70">{feature}</span>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="p-8 sm:p-10 pt-4">
                  <Button
                    asChild
                    size="lg"
                    className={cn(
                      "w-full h-14 sm:h-16 rounded-2xl font-black text-sm transition-all",
                      plan.highlight 
                        ? "bg-primary text-white btn-glow" 
                        : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                    )}
                  >
                    <Link href="/sign-up">{plan.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
