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

const PREVIEW_NAMES = ['Ruda', 'Divya', 'Kumal', 'Naveen', 'Roshan', 'Devi', 'Aditi', 'Kanak', 'Madhuri', 'Kriti', 'Kaanchi', 'Tejas', 'Dev', 'Ranveer'];

const VoiceCard = ({ voice }: { voice: any }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [randomBars, setRandomBars] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setRandomBars(Array.from({ length: 12 }, () => Math.random() * 100));
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

  const languages = Array.isArray(voice.languages) ? voice.languages : [voice.language].filter(Boolean);
  const isGradient = voice.avatarUrl?.startsWith('weavy:');
  const gradientIndex = isGradient ? parseInt(voice.avatarUrl.split(':')[1]) : 0;

  return (
    <div className="glass-card rounded-[2.5rem] p-6 group transition-all hover:border-primary/40 flex flex-col items-center text-center h-full bg-white/[0.02] border-white/5 shadow-2xl relative">
      {/* Voice Avatar - Top Centered */}
      <div className="relative h-20 w-20 rounded-full overflow-hidden border-4 border-white/5 group-hover:border-primary/30 transition-all mb-6 shrink-0 flex items-center justify-center bg-white/5 shadow-inner">
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
          <User className="h-10 w-10 text-white/10" />
        )}
      </div>

      {/* Voice Info */}
      <div className="space-y-3 mb-8 w-full">
        <h4 className="font-black text-white text-lg sm:text-xl tracking-tight truncate">{voice.voiceName}</h4>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="outline" className="bg-white/5 border-none text-[8px] uppercase font-black text-muted-foreground px-3 py-0.5">
            {languages[0] || 'Global'}
          </Badge>
          <Badge variant="outline" className="bg-primary/10 border-none text-[8px] uppercase font-black text-primary px-3 py-0.5">
            {voice.gender}
          </Badge>
        </div>
        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest pt-1 italic line-clamp-1">
          {voice.style || 'Studio Quality'}
        </p>
      </div>

      {/* Visualization & Controls */}
      <div className="w-full mt-auto space-y-6">
        <div className="h-8 flex items-end justify-center gap-1 px-4">
          {randomBars.map((height, i) => (
            <div 
              key={i}
              className={cn(
                "w-1.5 rounded-full transition-all duration-300",
                isPlaying ? "bg-primary" : "bg-primary/20"
              )}
              style={{ height: isPlaying ? `${height}%` : '20%' }}
            />
          ))}
        </div>

        <Button 
          size="lg" 
          variant="secondary" 
          onClick={togglePlay}
          className={cn(
            "h-12 w-full rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest",
            isPlaying 
              ? "bg-white text-black scale-95 shadow-inner" 
              : "bg-white/10 text-white hover:bg-white/20"
          )}
        >
          {isPlaying ? (
            <><Pause className="h-3.5 w-3.5 mr-2 fill-current" /> Stop</>
          ) : (
            <><Play className="h-3.5 w-3.5 mr-2 fill-current" /> Preview</>
          )}
        </Button>
      </div>
      
      <div className="absolute top-4 right-4 opacity-10">
        <Volume2 className="h-4 w-4 text-white" />
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
        <div className="text-center mb-24 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2">
            <span>The Library</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-7xl leading-tight">
            Hear the <br />
            <span className="text-primary">Difference.</span>
          </h2>
          <p className="text-sm sm:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Discover the most realistic neural voices in the industry. Trained on thousands of hours of expressive speech.
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass-card rounded-[2.5rem] p-6 space-y-8 flex flex-col items-center">
                  <Skeleton className="h-20 w-20 rounded-full shrink-0" />
                  <div className="space-y-4 w-full flex flex-col items-center">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-12 w-full rounded-2xl mt-auto" />
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
                  <CarouselItem key={voice.id} className="pl-6 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <div className="h-full">
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
            <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.02]">
              <Volume2 className="h-16 w-16 text-white/10 mx-auto mb-6" />
              <p className="text-base sm:text-lg text-muted-foreground italic font-medium">No speakers found in the studio library.</p>
              <Button asChild variant="link" className="text-primary font-black uppercase tracking-widest mt-4">
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