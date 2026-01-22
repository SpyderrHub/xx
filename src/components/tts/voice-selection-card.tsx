'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const voices = [
  {
    id: 'aria-female-en',
    name: 'Aria',
    gender: 'Female',
    language: 'English, US',
    tags: ['Narration', 'Clear'],
  },
  {
    id: 'javier-male-es',
    name: 'Javier',
    gender: 'Male',
    language: 'Spanish',
    tags: ['Conversational'],
  },
  {
    id: 'chloe-female-fr',
    name: 'Chloé',
    gender: 'Female',
    language: 'French',
    tags: ['Calm', 'Soothing'],
  },
  {
    id: 'kenji-male-jp',
    name: 'Kenji',
    gender: 'Male',
    language: 'Japanese',
    tags: ['Anime', 'Energetic'],
  },
  {
    id: 'isabella-female-uk',
    name: 'Isabella',
    gender: 'Female',
    language: 'English, UK',
    tags: ['Formal', 'Deep'],
  },
];

interface VoiceSettingsCardProps {
  selectedVoice: string;
  setSelectedVoice: (id: string) => void;
  stability: number;
  setStability: (value: number) => void;
  clarity: number;
  setClarity: (value: number) => void;
  pitch: number;
  setPitch: (value: number) => void;
}

export default function VoiceSelectionCard({
  selectedVoice,
  setSelectedVoice,
  stability,
  setStability,
  clarity,
  setClarity,
  pitch,
  setPitch,
}: VoiceSettingsCardProps) {
  return (
    <Card className="flex h-full flex-col bg-white/5 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Voice Settings</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col overflow-hidden">
        <ScrollArea className="flex-1 pr-4">
          <RadioGroup
            value={selectedVoice}
            onValueChange={setSelectedVoice}
            className="space-y-4"
          >
            {voices.map((voice) => (
              <Label
                key={voice.id}
                htmlFor={voice.id}
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors hover:bg-white/10 ${
                  selectedVoice === voice.id ? 'border-primary bg-white/10' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <RadioGroupItem value={voice.id} id={voice.id} />
                  <div>
                    <p className="font-semibold">{voice.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {voice.gender} &middot; {voice.language}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Play className="h-4 w-4" />
                </Button>
              </Label>
            ))}
          </RadioGroup>
        </ScrollArea>
        <Accordion type="single" collapsible className="mt-4 w-full">
          <AccordionItem value="advanced-settings">
            <AccordionTrigger>Advanced Settings</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="stability">Stability</Label>
                  <span className="text-sm text-muted-foreground">
                    {stability}%
                  </span>
                </div>
                <Slider
                  id="stability"
                  min={0}
                  max={100}
                  step={1}
                  value={[stability]}
                  onValueChange={(v) => setStability(v[0])}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="clarity">Clarity + Similarity</Label>
                  <span className="text-sm text-muted-foreground">
                    {clarity}%
                  </span>
                </div>
                <Slider
                  id="clarity"
                  min={0}
                  max={100}
                  step={1}
                  value={[clarity]}
                  onValueChange={(v) => setClarity(v[0])}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="pitch">Pitch</Label>
                  <span className="text-sm text-muted-foreground">
                    {pitch}%
                  </span>
                </div>
                <Slider
                  id="pitch"
                  min={0}
                  max={100}
                  step={1}
                  value={[pitch]}
                  onValueChange={(v) => setPitch(v[0])}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
