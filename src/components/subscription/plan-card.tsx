
'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Mail } from 'lucide-react';
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

export default function PlanCard({
  plan,
  currentPlanName,
}: {
  plan: any;
  currentPlanName: string;
}) {
  const isCurrent = plan.name.toLowerCase() === currentPlanName.toLowerCase();

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
              asChild
              size="lg"
              className="w-full font-bold"
              variant={plan.isHighlighted ? 'default' : 'outline'}
            >
              <Link href="mailto:support@soochi.ai">
                <Mail className="mr-2 h-4 w-4" />
                Contact to Upgrade
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
