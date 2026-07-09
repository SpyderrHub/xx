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

// Reduced to 10 names to satisfy Firestore 'in' query limit (Max 10)
const PREVIEW_NAMES = ['Ruda', 'Divya', 'Kumal', 'Naveen', 'Roshan', 'Devi', 'Aditi', 'Kanak', 'Madhuri', 'Kriti'];

const VoiceCard = ({ voice }: { voice: any }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [randomBars, setRandomBars] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setRandomBars(Array.from({ length: 8 }, () => Math.random() * 100));
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
    <div className="glass-card rounded-2xl p-3 sm:p-4 group transition-all hover:border-primary/40 flex items-center gap-4 h-24 sm:h-28 bg-white/[0.02] border-white/5 shadow-2xl relative w-full">
      {/* Voice Avatar - Left */}
      <div className="relative h-12 w-12 sm:h-16 sm:w-16 rounded-xl overflow-hidden border-2 border-white/5 group-hover:border-primary/30 transition-all shrink-0 flex items-center justify-center bg-white/5 shadow-inner">
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
          <User className="h-6 w-6 text-white/10" />
        )}
      </div>

      {/* Voice Info & Waveform - Middle */}
      <div className="flex-1 min-w-0 flex flex-col justify-center space-y-1 sm:space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-black text-white text-sm sm:text-lg tracking-tight truncate">{voice.voiceName}</h4>
          <Badge variant="outline" className="bg-primary/10 border-none text-[7px] sm:text-[9px] uppercase font-black text-primary px-2 py-0.5">
            {voice.gender}
          </Badge>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="h-4 flex items-end gap-0.5 shrink-0">
            {randomBars.map((height, i) => (
              <div 
                key={i}
                className={cn(
                  "w-1 rounded-full transition-all duration-300",
                  isPlaying ? "bg-primary" : "bg-primary/20"
                )}
                style={{ height: isPlaying ? `${height}%` : '20%' }}
              />
            ))}
          </div>
          <p className="text-[8px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-widest truncate italic">
            {voice.style || 'Studio Quality'}
          </p>
        </div>
      </div>

      {/* Control - Right */}
      <div className="shrink-0 flex flex-col items-center justify-center h-full border-l border-white/5 pl-4">
        <Button 
          size="icon" 
          variant="secondary" 
          onClick={togglePlay}
          className={cn(
            "h-10 w-10 sm:h-12 sm:w-12 rounded-full transition-all duration-300",
            isPlaying 
              ? "bg-white text-black scale-90 shadow-inner" 
              : "bg-white/5 text-white/60 hover:bg-primary/20 hover:text-primary"
          )}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
          ) : (
            <Play className="h-4 w-4 sm:h-5 sm:w-5 fill-current ml-0.5" />
          )}
        </Button>
      </div>
      
      <div className="absolute top-2 right-2 opacity-5">
        <Volume2 className="h-3 w-3 text-white" />
      </div>
    </div>
  );
};

export default function VoiceSamplesSection() {
  const { firestore } = useFirebase();

  const voicesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'voices'),
      where('voiceName', 'in', PREVIEW_NAMES),
      limit(20)
    );
  }, [firestore]);

  const { data: voices, isLoading } = useCollection(voicesQuery);

  return (
    <section id="voice-samples" className="pt-20 pb-0 relative overflow-hidden">
      <div className="container mx-auto px-6 sm:px-10 lg:px-16">
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2">
            <span>The Library</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-6xl leading-tight">
            Hear the <br />
            <span className="text-primary">Difference.</span>
          </h2>
          <p className="text-xs sm:text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
            Discover the most realistic neural voices in the industry. Trained on thousands of hours of expressive speech.
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass-card rounded-2xl h-28 flex items-center p-4 gap-4">
                  <Skeleton className="h-16 w-16 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-full" />
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
              <CarouselContent className="-ml-6">
                {voices.map((voice) => (
                  <CarouselItem key={voice.id} className="pl-6 basis-full sm:basis-1/2 lg:basis-1/3">
                    <div className="h-full py-2">
                      <VoiceCard voice={voice} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious className="bg-white/5 border-white/10 text-white hover:bg-white/20 hover:text-primary transition-all -left-12 h-12 w-12" />
                <CarouselNext className="bg-white/5 border-white/10 text-white hover:bg-white/20 hover:text-primary transition-all -right-12 h-12 w-12" />
              </div>
            </Carousel>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.02]">
              <Volume2 className="h-12 w-12 text-white/10 mx-auto mb-4" />
              <p className="text-sm sm:text-base text-muted-foreground italic font-medium">No speakers found in the studio library.</p>
              <Button asChild variant="link" className="text-primary font-black uppercase tracking-widest mt-2">
                <a href="/dashboard">Upload First Voice →</a>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full -z-10 pointer-events-none" />
    </section>
  );
}