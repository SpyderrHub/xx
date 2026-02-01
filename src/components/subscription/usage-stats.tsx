'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

const planDetails: Record<string, { characterLimit: number }> = {
  free: { characterLimit: 10000 },
  creator: { characterLimit: 500000 },
  pro: { characterLimit: 2000000 },
  business: { characterLimit: Infinity },
};

export default function UsageStats({ userData }: any) {
  if (!userData) {
    return null;
  }

  const { plan, credits, currentPeriodEnd } = userData;
  const currentPlanDetails = planDetails[plan] || planDetails['free'];
  const charactersUsed = Math.max(0, currentPlanDetails.characterLimit - credits);
  const usagePercentage = (charactersUsed / currentPlanDetails.characterLimit) * 100;
  // Mocked value for voice generation time
  const voiceGenerationTimeUsed = (charactersUsed / 1000).toFixed(2); // e.g. 1 char = 1ms

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Usage this month</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <Label htmlFor="character-usage">Characters Used</Label>
              <span className="font-medium text-muted-foreground">
                {charactersUsed.toLocaleString()} /{' '}
                {currentPlanDetails.characterLimit.toLocaleString()}
              </span>
            </div>
            <Progress id="character-usage" value={usagePercentage} />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Credits Remaining</span>
            <span className="font-semibold">{credits.toLocaleString()}</span>
          </div>
        </div>
        <div className="space-y-4">
           <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Voice Generation Time</span>
            <span className="font-semibold">{voiceGenerationTimeUsed} min</span>
          </div>
           <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Usage resets on</span>
            <span className="font-semibold">
              {currentPeriodEnd ? format(new Date(currentPeriodEnd), 'MMMM dd, yyyy') : 'N/A'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
