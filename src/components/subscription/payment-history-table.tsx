'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';

const invoices = [
  {
    date: '2024-07-01',
    invoiceId: 'INV-2024-003',
    plan: 'Creator Plan',
    amount: '$29.00',
    status: 'Paid',
  },
  {
    date: '2024-06-01',
    invoiceId: 'INV-2024-002',
    plan: 'Creator Plan',
    amount: '$29.00',
    status: 'Paid',
  },
  {
    date: '2024-05-01',
    invoiceId: 'INV-2024-001',
    plan: 'Free',
    amount: '$0.00',
    status: 'Paid',
  },
];

export default function PaymentHistoryTable() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead className="hidden sm:table-cell">Invoice ID</TableHead>
              <TableHead className="hidden md:table-cell">Plan</TableHead>
              <TableHead className="hidden sm:table-cell">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.invoiceId}>
                <TableCell>
                  {invoice.date}
                  <div className="text-muted-foreground sm:hidden">{invoice.invoiceId}</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{invoice.invoiceId}</TableCell>
                <TableCell className="hidden md:table-cell">{invoice.plan}</TableCell>
                <TableCell className="hidden sm:table-cell">{invoice.amount}</TableCell>
                <TableCell>
                  <Badge variant={invoice.status === 'Paid' ? 'secondary' : 'destructive'} className={invoice.status === 'Paid' ? 'bg-green-500/10 text-green-400 border-green-500/20' : ''}>
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download invoice</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
