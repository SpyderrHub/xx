
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
import { Play, Pause, Loader2, Library } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, documentId, where, getDocs } from 'firebase/firestore';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface VoiceSelectionCardProps {
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
}: VoiceSelectionCardProps) {
  const { user, firestore } = useFirebase();
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 1. Fetch user's voice IDs
  const myVoicesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'users', user.uid, 'myVoices'));
  }, [user, firestore]);

  const { data: myVoicesList, isLoading: isMyVoicesLoading } = useCollection(myVoicesQuery);
  const [detailedVoices, setDetailedVoices] = useState<any[]>([]);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  // 2. Fetch full voice details for the user's selected IDs
  useEffect(() => {
    const fetchVoiceDetails = async () => {
      if (!myVoicesList || myVoicesList.length === 0 || !firestore) {
        setDetailedVoices([]);
        return;
      }

      setIsDetailsLoading(true);
      try {
        const voiceIds = myVoicesList.map(v => v.voiceId);
        
        // Firestore 'in' query has a limit of 10 items. For simplicity here we handle up to 10.
        // In a production app, you'd chunk this or use multiple queries.
        const chunks = [];
        for (let i = 0; i < voiceIds.length; i += 10) {
          chunks.push(voiceIds.slice(i, i + 10));
        }

        const results: any[] = [];
        for (const chunk of chunks) {
          const q = query(collection(firestore, 'voices'), where('voiceId', 'in', chunk));
          const snapshot = await getDocs(q);
          snapshot.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
        }
        setDetailedVoices(results);
        
        // Auto-select first voice if none selected
        if (!selectedVoice && results.length > 0) {
          setSelectedVoice(results[0].id);
        }
      } catch (error) {
        console.error('Error fetching voice details:', error);
      } finally {
        setIsDetailsLoading(false);
      }
    };

    fetchVoiceDetails();
  }, [myVoicesList, firestore, selectedVoice, setSelectedVoice]);

  const togglePlay = (e: React.MouseEvent, voice: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (playingVoiceId === voice.id) {
      audioRef.current?.pause();
      setPlayingVoiceId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(voice.audioUrl);
      audioRef.current.onended = () => setPlayingVoiceId(null);
      audioRef.current.play();
      setPlayingVoiceId(voice.id);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <Card className="flex h-full flex-col bg-white/5 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Voice Selection</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col overflow-hidden">
        <ScrollArea className="flex-1 pr-4">
          {isMyVoicesLoading || isDetailsLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : detailedVoices.length > 0 ? (
            <RadioGroup
              value={selectedVoice}
              onValueChange={setSelectedVoice}
              className="space-y-4"
            >
              {detailedVoices.map((voice) => (
                <Label
                  key={voice.id}
                  htmlFor={voice.id}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors hover:bg-white/10 ${
                    selectedVoice === voice.id ? 'border-primary bg-white/10' : 'border-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <RadioGroupItem value={voice.id} id={voice.id} />
                    <div>
                      <p className="font-semibold">{voice.voiceName}</p>
                      <p className="text-sm text-muted-foreground">
                        {voice.gender} &middot; {voice.language}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => togglePlay(e, voice)}
                    className="h-8 w-8"
                  >
                    {playingVoiceId === voice.id ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </Label>
              ))}
            </RadioGroup>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center space-y-4">
              <p className="text-muted-foreground text-sm">No voices added to your library yet.</p>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/voice-library">
                  <Library className="mr-2 h-4 w-4" />
                  Browse Voice Library
                </Link>
              </Button>
            </div>
          )}
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
