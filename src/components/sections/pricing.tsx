import Link from 'next/link';
import { CheckCircle, Zap } from 'lucide-react';
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
    features: ['50,000 Characters', '10 Daily Pro Generations', 'No Watermarks', 'Standard Support'],
    cta: 'Select Starter',
    highlight: false,
  },
  {
    name: 'Creator',
    price: '₹2,499',
    period: '/ mo',
    description: 'Perfect for professionals.',
    features: ['500,000 Characters', '20 Daily Pro Generations', 'No Watermarks', 'API Access', 'Email Support'],
    cta: 'Get Started',
    highlight: true,
  },
  {
    name: 'Pro',
    price: '₹7,999',
    period: '/ mo',
    description: 'Built for scale and automation.',
    features: ['2,500,000 Characters', 'Unlimited Parallelism', 'Voice Cloning', 'Priority API Support'],
    cta: 'Go Pro Now',
    highlight: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 bg-black/20">
      <div className="container mx-auto px-6 sm:px-10 lg:px-16">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-6">
            Predictable Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            No enterprise taxes. Just pure synthesis at scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                'glass-card border-white/5 bg-white/[0.02] flex flex-col rounded-[2rem] transition-all hover:scale-105',
                plan.highlight && 'border-primary/50 bg-primary/[0.03] ring-2 ring-primary/20'
              )}
            >
              <CardHeader className="p-8">
                {plan.highlight && (
                  <div className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-4">
                    Best Value
                  </div>
                )}
                <CardTitle className="text-2xl font-black text-white">{plan.name}</CardTitle>
                <CardDescription className="text-muted-foreground text-xs pt-2">{plan.description}</CardDescription>
                <div className="flex items-baseline pt-6">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-8 pt-0 space-y-4">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm text-white/70">{feature}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="p-8 pt-0">
                <Button
                  asChild
                  size="lg"
                  variant={plan.highlight ? 'default' : 'outline'}
                  className={cn(
                    "w-full h-12 rounded-xl font-black text-sm",
                    plan.highlight ? "bg-primary btn-glow" : "border-white/10 bg-white/5 hover:bg-white/10"
                  )}
                >
                  <Link href="/sign-up">{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
