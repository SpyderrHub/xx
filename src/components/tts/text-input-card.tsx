'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="language" className="mb-2 block text-sm">
              Language
            </Label>
            <Select defaultValue="en-us">
              <SelectTrigger id="language" className="rounded-xl">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-us">English (US)</SelectItem>
                <SelectItem value="en-gb">English (UK)</SelectItem>
                <SelectItem value="es-es">Spanish (Spain)</SelectItem>
                <SelectItem value="fr-fr">French (France)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="style" className="mb-2 block text-sm">
              Style
            </Label>
            <Select defaultValue="neutral">
              <SelectTrigger id="style" className="rounded-xl">
                <SelectValue placeholder="Select Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="narration">Narration</SelectItem>
                <SelectItem value="conversational">Conversational</SelectItem>
                <SelectItem value="excited">Excited</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Textarea
          placeholder="Type or paste your text here to generate audio..."
          className="mt-4 flex-1 resize-none rounded-xl text-base"
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
