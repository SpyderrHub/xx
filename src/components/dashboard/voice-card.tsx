'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface VoiceCardProps {
  name: string;
  language: string;
}

export default function VoiceCard({ name, language }: VoiceCardProps) {
  return (
    <Card className="bg-white/5">
      <CardContent className="flex flex-col items-center justify-center p-4 text-center">
        <Button
          variant="outline"
          size="icon"
          className="mb-3 h-12 w-12 rounded-full border-primary/50 bg-primary/10"
        >
          <Play className="h-5 w-5 text-primary" />
        </Button>
        <p className="font-semibold">{name}</p>
        <p className="text-xs text-muted-foreground">{language}</p>
      </CardContent>
    </Card>
  );
}
