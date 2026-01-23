'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

export default function CurrentPlanCard({ userData }: any) {
  if (!userData) {
    return null;
  }
  const { plan, paymentStatus, currentPeriodEnd, credits } = userData;
  const usagePercentage = (credits / 6000) * 100; // Assuming max credits is 6000

  const planDetails: Record<string, {name: string, price: string, period: string, characterLimit: number}> = {
    free: { name: 'Free', price: '$0', period: '/ month', characterLimit: 10000 },
    creator: { name: 'Creator', price: '$29', period: '/ month', characterLimit: 500000 },
    pro: { name: 'Pro', price: '$99', period: '/ month', characterLimit: 2000000 },
  }

  const currentPlanDetails = planDetails[plan] || planDetails['free'];

  return (
    <Card className="bg-white/5 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Current Plan</CardTitle>
          <Badge variant="outline" className="border-primary text-primary capitalize">
            {currentPlanDetails.name}
          </Badge>
        </div>
        <CardDescription>
          Your current subscription details. Status: <span className='capitalize'>{paymentStatus}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <div className="text-sm text-muted-foreground">Plan Price</div>
            <div className="text-xl font-semibold">{currentPlanDetails.price}{currentPlanDetails.period}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Renewal Date</div>
            <div className="text-xl font-semibold">
              {currentPeriodEnd ? format(new Date(currentPeriodEnd), 'MMMM dd, yyyy') : 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Characters</div>
            <div className="text-xl font-semibold">{credits} / {currentPlanDetails.characterLimit}</div>
          </div>
        </div>
        <div>
          <Label className="text-sm text-muted-foreground">Usage this month</Label>
          <Progress value={usagePercentage} className="mt-2 h-2" />
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button disabled={plan === 'free'}>Manage Subscription</Button>
        <Button variant="outline">View Invoices</Button>
      </CardFooter>
    </Card>
  );
}
