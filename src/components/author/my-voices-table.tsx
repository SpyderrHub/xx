
'use client';

import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Play, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

const dummyVoices = [
  { id: 1, name: 'Crystal Clear', language: 'English', style: 'Narration', status: 'approved', date: '2024-03-20' },
  { id: 2, name: 'Deep Baritone', language: 'English', style: 'Audiobook', status: 'pending', date: '2024-03-22' },
  { id: 3, name: 'Sprightly Youth', language: 'Spanish', style: 'Conversational', status: 'approved', date: '2024-03-15' },
  { id: 4, name: 'Whispering Wind', language: 'Hindi', style: 'Emotional', status: 'rejected', date: '2024-03-10' },
];

export function MyVoicesTable() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Voice Name</TableHead>
          <TableHead className="hidden md:table-cell">Style</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dummyVoices.map((voice) => (
          <TableRow key={voice.id}>
            <TableCell>
              <div className="font-medium">{voice.name}</div>
              <div className="text-xs text-muted-foreground">{voice.language}</div>
            </TableCell>
            <TableCell className="hidden md:table-cell">{voice.style}</TableCell>
            <TableCell>{getStatusBadge(voice.status)}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon">
                <Play className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
