'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';

export default function CurrentPlanCard({ plan }: any) {
  const usagePercentage = (3200 / 10000) * 100;

  return (
    <Card className="bg-white/5 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Current Plan</CardTitle>
          <Badge variant="outline" className="border-primary text-primary">
            {plan.name}
          </Badge>
        </div>
        <CardDescription>
          Your current subscription details.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <div className="text-sm text-muted-foreground">Plan Price</div>
            <div className="text-xl font-semibold">{plan.price}{plan.period}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Renewal Date</div>
            <div className="text-xl font-semibold">August 23, 2024</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Characters</div>
            <div className="text-xl font-semibold">3,200 / 10,000</div>
          </div>
        </div>
        <div>
          <Label className="text-sm text-muted-foreground">Usage this month</Label>
          <Progress value={usagePercentage} className="mt-2 h-2" />
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button>Manage Subscription</Button>
        <Button variant="outline">View Invoices</Button>
      </CardFooter>
    </Card>
  );
}
