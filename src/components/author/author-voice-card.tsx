'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Mic2, User, Globe, UserCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface AuthorVoiceCardProps {
  voice: any;
}

export function AuthorVoiceCard({ voice }: AuthorVoiceCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full"
    >
      <Card className="h-full bg-card/40 backdrop-blur-md border-white/5 hover:border-primary/20 transition-all overflow-hidden group">
        <CardContent className="p-4 flex flex-col h-full">
          {/* Header: Avatar, Name, Style */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative h-14 w-14 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center border border-white/10 shrink-0">
              {voice.avatarUrl ? (
                <Image src={voice.avatarUrl} alt={voice.voiceName} fill className="object-cover" />
              ) : (
                <User className="h-7 w-7 text-muted-foreground/50" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base truncate">{voice.voiceName}</h3>
              <p className="text-xs text-primary flex items-center gap-1">
                <Mic2 className="h-3 w-3" /> {voice.style}
              </p>
            </div>
          </div>

          {/* Details: Language, Gender */}
          <div className="grid grid-cols-2 gap-2 mb-4 bg-black/20 p-3 rounded-xl border border-white/5">
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                <Globe className="h-2.5 w-2.5" /> Language
              </span>
              <span className="text-xs font-medium truncate">{voice.language}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                <UserCircle className="h-2.5 w-2.5" /> Gender
              </span>
              <span className="text-xs font-medium truncate">{voice.gender}</span>
            </div>
          </div>

          {/* Preview / Footer */}
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex flex-col">
              <p className="text-[10px] text-muted-foreground italic">
                {voice.ageRange || 'Voice Profile'}
              </p>
              {voice.accent && (
                 <p className="text-[9px] text-muted-foreground/60">{voice.accent}</p>
              )}
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="h-10 w-10 rounded-full p-0 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-transform active:scale-95"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
