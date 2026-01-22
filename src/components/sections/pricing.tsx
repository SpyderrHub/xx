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
    name: 'Starter',
    price: '$0',
    period: '/ month',
    description: 'For personal projects and exploration.',
    features: [
      '10,000 characters/month',
      'Access to standard voices',
      '1 project',
      'Community support',
    ],
    cta: 'Start for Free',
    isHighlighted: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/ month',
    description: 'For professionals and growing businesses.',
    features: [
      '500,000 characters/month',
      'Access to premium voices',
      'Voice Cloning Tool',
      'Unlimited projects',
      'API Access',
      'Email support',
    ],
    cta: 'Get Started with Pro',
    isHighlighted: true,
  },
  {
    name: 'Business',
    price: 'Custom',
    period: '',
    description: 'For large-scale applications and teams.',
    features: [
      'Unlimited characters',
      'Custom voice creation',
      'Dedicated infrastructure',
      'Team collaboration',
      'Enterprise SSO',
      'Dedicated support',
    ],
    cta: 'Contact Sales',
    isHighlighted: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="bg-secondary py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Simple, transparent pricing that scales with you. Get started for
            free today.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                'flex flex-col rounded-2xl shadow-lg transition-transform hover:scale-105',
                plan.isHighlighted && 'border-2 border-primary'
              )}
            >
              <CardHeader className="p-8">
                {plan.isHighlighted && (
                  <div className="absolute -top-3 right-6 rounded-full bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <CardTitle className="font-headline text-2xl">
                  {plan.name}
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="flex items-baseline pt-4">
                  <span className="text-4xl font-bold tracking-tight">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-muted-foreground">
                      {plan.period}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-8 pt-0">
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 shrink-0 text-green-500" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-8 pt-0">
                <Button
                  asChild
                  size="lg"
                  className="w-full"
                  variant={plan.isHighlighted ? 'default' : 'outline'}
                >
                  <Link href="#">{plan.cta}</Link>
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
