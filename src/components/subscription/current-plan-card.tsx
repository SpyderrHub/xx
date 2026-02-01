'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

const planDetails: Record<string, {name: string, price: string, period: string}> = {
    free: { name: 'Free', price: '$0', period: 'per month' },
    creator: { name: 'Creator', price: '$29', period: 'per month' },
    pro: { name: 'Pro', price: '$99', period: 'per month' },
    business: { name: 'Business', price: 'Custom', period: ''},
};

export default function CurrentPlanCard({ userData }: any) {
  if (!userData) {
    return null;
  }
  const { plan, paymentStatus, currentPeriodEnd } = userData;
  const currentPlanDetails = planDetails[plan] || planDetails['free'];

  const getStatusBadge = (status: string) => {
    switch (status) {
        case 'active':
            return <Badge className="border-green-500/30 bg-green-500/10 text-green-400">Active</Badge>;
        case 'cancelled':
            return <Badge variant="destructive">Cancelled</Badge>;
        case 'past_due':
            return <Badge variant="destructive">Past Due</Badge>;
        default:
            return <Badge variant="secondary">Inactive</Badge>;
    }
  }

  const handleUpgradeClick = () => {
    document.getElementById('pricing-plans')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Card className="bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-lg">
      <CardHeader className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
            <CardTitle className="text-lg text-muted-foreground">Current Plan</CardTitle>
            <p className="text-2xl font-bold">{currentPlanDetails.name}</p>
        </div>
        <div>
            <CardTitle className="text-lg text-muted-foreground">Price</CardTitle>
            <div className="flex items-baseline">
                <p className="text-2xl font-bold">{currentPlanDetails.price}</p>
                <p className="text-sm text-muted-foreground ml-1">{currentPlanDetails.period}</p>
            </div>
        </div>
        <div>
            <CardTitle className="text-lg text-muted-foreground">Status</CardTitle>
            <div className="flex items-center gap-2 mt-1">
                {getStatusBadge(paymentStatus)}
            </div>
        </div>
      </CardHeader>
      <CardContent>
          <p className="text-sm text-muted-foreground">
            {paymentStatus === 'active' && currentPeriodEnd ? `Your plan will renew in ${formatDistanceToNow(new Date(currentPeriodEnd))}.` : 'Manage your subscription and billing details.'}
          </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button onClick={handleUpgradeClick} className="bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-white hover:from-purple-700 hover:to-indigo-700">Upgrade Plan</Button>
        <Button variant="outline" disabled={plan === 'free'}>Cancel Subscription</Button>
      </CardFooter>
    </Card>
  );
}
