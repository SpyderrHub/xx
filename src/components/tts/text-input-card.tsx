'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface TextInputCardProps {
  text: string;
  setText: (text: string) => void;
  characterCount: number;
  maxCharacters: number;
}

export default function TextInputCard({
  text,
  setText,
  characterCount,
  maxCharacters,
}: TextInputCardProps) {
  return (
    <Card className="flex h-full flex-col bg-white/5 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Text Input</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <Textarea
          placeholder="Type or paste your text here to generate audio..."
          className="mt-0 flex-1 resize-none rounded-xl text-[13px] md:text-base"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-2 text-right text-sm text-muted-foreground">
          {characterCount} / {maxCharacters}
        </div>
      </CardContent>
    </Card>
  );
}
