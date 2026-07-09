'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, User, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, limit, where } from 'firebase/firestore';
import { WeavyPattern } from '@/components/author/avatar-upload';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const PREVIEW_NAMES = ['Ruda', 'Divya', 'Kumal', 'Naveen', 'Roshan', 'Devi', 'Aditi', 'Kanak', 'Madhuri', 'Kriti'];

const VoiceCard = ({ voice }: { voice: any }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [randomBars, setRandomBars] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setRandomBars(Array.from({ length: 6 }, () => Math.random() * 100));
  }, []);

  const togglePlay = useCallback(() => {
    if (!voice.audioUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(voice.audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.error("Playback failed:", err));
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, voice.audioUrl]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const isGradient = voice.avatarUrl?.startsWith('weavy:');
  const gradientIndex = isGradient ? parseInt(voice.avatarUrl.split(':')[1]) : 0;

  return (
    <div className="glass-card rounded-xl p-2 group transition-all hover:border-primary/40 flex items-center gap-3 h-20 bg-white/[0.02] border-white/5 shadow-xl relative w-full overflow-hidden">
      {/* Voice Avatar - Small Square */}
      <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-white/5 group-hover:border-primary/30 transition-all shrink-0 flex items-center justify-center bg-white/5">
        {isGradient ? (
          <WeavyPattern presetIndex={gradientIndex} />
        ) : voice.avatarUrl ? (
          <Image 
            src={voice.avatarUrl} 
            alt={voice.voiceName} 
            fill 
            unoptimized
            className="object-cover" 
          />
        ) : (
          <User className="h-5 w-5 text-white/10" />
        )}
      </div>

      {/* Voice Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h4 className="font-bold text-white text-xs sm:text-sm tracking-tight truncate leading-tight">{voice.voiceName}</h4>
        <div className="flex items-center gap-2 mt-0.5">
          <div className="h-2 flex items-end gap-0.5 shrink-0">
            {randomBars.map((height, i) => (
              <div 
                key={i}
                className={cn(
                  "w-0.5 rounded-full transition-all duration-300",
                  isPlaying ? "bg-primary" : "bg-primary/20"
                )}
                style={{ height: isPlaying ? `${height}%` : '40%' }}
              />
            ))}
          </div>
          <span className="text-[8px] text-muted-foreground uppercase font-black tracking-widest truncate">{voice.language || 'English'}</span>
        </div>
      </div>

      {/* Control - Right */}
      <Button 
        size="icon" 
        variant="ghost" 
        onClick={togglePlay}
        className={cn(
          "h-8 w-8 rounded-full transition-all shrink-0",
          isPlaying 
            ? "bg-primary text-white scale-90" 
            : "text-white/40 hover:text-primary hover:bg-primary/10"
        )}
      >
        {isPlaying ? (
          <Pause className="h-3 w-3 fill-current" />
        ) : (
          <Play className="h-3 w-3 fill-current ml-0.5" />
        )}
      </Button>
    </div>
  );
};

export default function VoiceSamplesSection() {
  const { firestore } = useFirebase();

  const voicesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'voices'),
      where('isPublic', '==', true),
      where('status', '==', 'approved'),
      where('voiceName', 'in', PREVIEW_NAMES),
      limit(10)
    );
  }, [firestore]);

  const { data: voices, isLoading } = useCollection(voicesQuery);

  return (
    <section id="voice-samples" className="pt-20 pb-0 relative overflow-hidden">
      <div className="container mx-auto px-6 sm:px-10 lg:px-16">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2">
            <span>The Library</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-6xl leading-tight">
            Hear the <br />
            <span className="text-primary">Difference.</span>
          </h2>
        </div>

        <div className="relative max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass-card rounded-xl h-20 flex items-center p-3 gap-3 border border-white/5">
                  <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-2 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : voices && voices.length > 0 ? (
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {voices.map((voice) => (
                  <CarouselItem key={voice.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
                    <div className="h-full py-1">
                      <VoiceCard voice={voice} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious className="bg-white/5 border-white/10 text-white hover:bg-white/20 hover:text-primary transition-all -left-12 h-10 w-10" />
                <CarouselNext className="bg-white/5 border-white/10 text-white hover:bg-white/20 hover:text-primary transition-all -right-12 h-10 w-10" />
              </div>
            </Carousel>
          ) : (
            <div className="text-center py-16 border border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
              <Volume2 className="h-10 w-10 text-white/5 mx-auto mb-4" />
              <p className="text-xs text-muted-foreground font-medium">Platform speakers are being initialized.</p>
            </div>
          )}
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full -z-10 pointer-events-none" />
    </section>
  );
}
