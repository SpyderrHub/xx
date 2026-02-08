'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Heart, Plus, Check, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export type Voice = {
  id: string;
  voiceName: string;
  description: string;
  language: string;
  gender: string;
  style: string;
  avatarUrl?: string;
  audioUrl?: string;
  userId: string;
};

interface VoiceCardProps {
  voice: Voice;
}

const Waveform = () => (
    <div className="flex w-full h-8 items-center justify-center space-x-1">
        {[...Array(20)].map((_, i) => (
            <div key={i} className="w-0.5 bg-primary/50" style={{ height: `${Math.random() * 80 + 20}%`}}/>
        ))}
    </div>
);

const PlayingWaveform = () => (
     <div className="flex w-full h-8 items-end justify-center space-x-1">
        {[...Array(20)].map((_, i) => (
            <motion.div
                key={i}
                className="w-0.5 bg-primary"
                initial={{ height: '20%' }}
                animate={{ height: ['20%', '80%', '20%'] }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.05,
                }}
            />
        ))}
    </div>
);

export default function VoiceCard({ voice }: VoiceCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (!voice.audioUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(voice.audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="h-full"
    >
      <Card className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card/80 shadow-lg backdrop-blur-lg transition-all duration-300",
        "hover:border-primary/50 hover:shadow-primary/20"
      )}>
        <CardContent className="flex flex-1 flex-col p-3 sm:p-4">
          <div className="relative mb-3 sm:mb-4 flex items-center justify-between">
             <div className="flex items-center gap-2 sm:gap-3">
                 <div className="relative h-10 w-10 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-full bg-primary/10 border border-white/10 flex items-center justify-center">
                    {voice.avatarUrl ? (
                      <Image src={voice.avatarUrl} alt={voice.voiceName} fill className="object-cover" />
                    ) : (
                      <User className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground/50" />
                    )}
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute inset-0 h-full w-full rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={togglePlay}
                    >
                        {isPlaying ? <Pause className="h-4 w-4 sm:h-5 sm:w-5"/> : <Play className="h-4 w-4 sm:h-5 sm:w-5 ml-0.5" />}
                    </Button>
                 </div>
                 <div className="min-w-0">
                    <h3 className="font-bold text-sm sm:text-base truncate pr-2">{voice.voiceName}</h3>
                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate italic">{voice.style}</p>
                 </div>
             </div>
          </div>

          <div className="h-6 sm:h-8 mb-3 sm:mb-4">
              {isPlaying ? <PlayingWaveform /> : <Waveform />}
          </div>
          
          <p className="text-[10px] sm:text-xs text-muted-foreground flex-1 mb-3 sm:mb-4 line-clamp-3 min-h-[3.5rem] leading-relaxed">
            {voice.description || "An expressive AI voice profile built for storytelling, narration, and high-fidelity vocal output."}
          </p>
          
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
            <Badge variant="secondary" className="border-none bg-primary/10 text-primary/90 text-[9px] sm:text-[10px] px-1.5 py-0">
              {voice.language}
            </Badge>
            <Badge variant="secondary" className="border-none bg-indigo-500/10 text-indigo-400 text-[9px] sm:text-[10px] px-1.5 py-0">
              {voice.gender}
            </Badge>
          </div>

          <div className="mt-auto flex items-center justify-between">
             <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
                <span className="text-yellow-400">⭐</span>
                <span>4.8</span>
             </div>
             <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsLiked(!isLiked)}>
                    <Heart className={cn("h-4 w-4", isLiked && "fill-red-500 text-red-500")}/>
                </Button>
                <Button 
                    variant={isAdded ? "secondary" : "outline"} 
                    size="sm" 
                    className="h-7 sm:h-8 rounded-lg px-2 sm:px-3 text-[10px] sm:text-xs font-semibold"
                    onClick={() => setIsAdded(!isAdded)}
                >
                    {isAdded ? <Check className="mr-1 h-3 w-3 sm:h-4 w-4" /> : <Plus className="mr-1 h-3 w-3 sm:h-4 w-4" />}
                    {isAdded ? 'Added' : 'Add'}
                </Button>
             </div>
          </div>

        </CardContent>
      </Card>
    </motion.div>
  );
}