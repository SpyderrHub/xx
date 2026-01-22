'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

const recentGenerations = [
  {
    text: 'The quick brown fox jumps over the lazy dog.',
    voice: 'Alex (Male)',
    duration: '0:03',
    date: '2024-07-22',
  },
  {
    text: 'Welcome to VoxAI, where your words come to life.',
    voice: 'Sara (Female)',
    duration: '0:04',
    date: '2024-07-21',
  },
  {
    text: 'Explore our vast library of ultra-realistic voices.',
    voice: 'Leo (Male)',
    duration: '0:05',
    date: '2024-07-21',
  },
  {
    text: 'Create your first audio generation in seconds.',
    voice: 'Alex (Male)',
    duration: '0:04',
    date: '2024-07-20',
  },
];

export default function RecentGenerationsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Text Preview</TableHead>
          <TableHead className="hidden sm:table-cell">Voice</TableHead>
          <TableHead className="hidden md:table-cell">Duration</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentGenerations.map((gen, i) => (
          <TableRow key={i}>
            <TableCell>
              <p className="truncate font-medium">{gen.text}</p>
              <p className="text-xs text-muted-foreground sm:hidden">
                {gen.voice} - {gen.duration}
              </p>
            </TableCell>
            <TableCell className="hidden sm:table-cell">{gen.voice}</TableCell>
            <TableCell className="hidden md:table-cell">
              {gen.duration}
            </TableCell>
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
