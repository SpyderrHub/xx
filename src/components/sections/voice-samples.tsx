
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, User, Volume2, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, limit, orderBy } from 'firebase/firestore';
import { WeavyPattern } from '@/components/author/avatar-upload';
import { Skeleton } from '@/components/ui/skeleton';

const VoiceCard = ({ voice }: { voice: any }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [randomBars, setRandomBars] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setRandomBars(Array.from({ length: 15 }, () => Math.random() * 100));
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
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card rounded-[2rem] p-6 group transition-all hover:border-primary/40 flex flex-col h-full"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="relative h-14 w-14 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-primary/50 transition-colors shrink-0 flex items-center justify-center bg-white/5">
          {isGradient ? (
            <WeavyPattern presetIndex={gradientIndex} />
          ) : voice.avatarUrl ? (
            <Image src={voice.avatarUrl} alt={voice.voiceName} fill className="object-cover" />
          ) : (
            <User className="h-6 w-6 text-white/20" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-black text-white text-lg truncate">{voice.voiceName}</h4>
          <div className="flex flex-wrap gap-1.5 mt-1">
            <Badge variant="outline" className="bg-white/5 border-none text-[9px] uppercase font-bold text-muted-foreground px-2">
              {languages[0] || 'Global'}
            </Badge>
            <Badge variant="outline" className="bg-primary/10 border-none text-[9px] uppercase font-bold text-primary px-2">
              {voice.gender}
            </Badge>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4 border border-white/5 group-hover:bg-white/10 transition-colors mt-auto">
        <Button 
          size="icon" 
          variant="secondary" 
          onClick={togglePlay}
          className="h-10 w-10 rounded-full bg-white text-black hover:bg-white/90 shadow-xl shrink-0"
        >
          {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
        </Button>
        
        <div className="flex-1 flex items-center gap-1 h-6">
          {randomBars.map((height, i) => (
            <motion.div 
              key={i}
              className="w-1 rounded-full bg-primary/40"
              animate={isPlaying ? {
                height: [height + '%', '20%', height + '%'],
                backgroundColor: ['#A855F7', '#6366F1', '#A855F7']
              } : { height: '30%' }}
              transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.05 }}
            />
          ))}
        </div>
      </div>
      
      <p className="mt-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] italic px-2 truncate">
        {voice.style || 'Premium Voice'} &bull; 48kHz Stereo
      </p>
    </motion.div>
  );
};

export default function VoiceSamplesSection() {
  const { firestore } = useFirebase();

  const voicesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'voices'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
  }, [firestore]);

  const { data: voices, isLoading } = useCollection(voicesQuery);

  return (
    <section id="voice-samples" className="py-24 bg-black/20">
      <div className="container mx-auto px-6 sm:px-10 lg:px-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-6">
            Hear The Difference
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Studio-quality neural voices that capture the subtle nuances, emotions, and breaths of human speech.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="glass-card rounded-[2rem] p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-14 w-14 rounded-2xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-3 w-1/2 mx-2" />
              </div>
            ))}
          </div>
        ) : voices && voices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {voices.map((voice) => (
              <VoiceCard key={voice.id} voice={voice} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.02]">
            <Volume2 className="h-12 w-12 text-white/10 mx-auto mb-4" />
            <p className="text-muted-foreground italic">No speakers found in the studio library.</p>
          </div>
        )}
      </div>
    </section>
  );
}
