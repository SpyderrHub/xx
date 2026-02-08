
'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Clock, CheckCircle2, XCircle, Mic2, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20 gap-1">
            <CheckCircle2 className="h-3 w-3" /> Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" /> Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 gap-1">
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full"
    >
      <Card className="h-full bg-card/40 backdrop-blur-md border-white/5 hover:border-primary/20 transition-all overflow-hidden group">
        <CardContent className="p-4 flex flex-col h-full">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative h-12 w-12 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center border border-white/10">
              {voice.avatarUrl ? (
                <Image src={voice.avatarUrl} alt={voice.voiceName} fill className="object-cover" />
              ) : (
                <User className="h-6 w-6 text-muted-foreground/50" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm truncate">{voice.voiceName}</h3>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Mic2 className="h-3 w-3" /> {voice.style}
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-4 flex-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-muted-foreground">Language</span>
              <span className="font-medium">{voice.language}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-muted-foreground">Submitted</span>
              <span className="font-medium">
                {formatDistanceToNow(new Date(voice.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 mt-auto">
            {getStatusBadge(voice.status)}
            <Button
              variant="secondary"
              size="sm"
              className="h-8 w-8 rounded-full p-0 bg-primary/10 text-primary hover:bg-primary/20"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
