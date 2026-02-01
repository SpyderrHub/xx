
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Heart, Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export type Voice = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  category: string;
  creator: string;
  avatarUrl: string;
  isPremium: boolean;
  rating: number;
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
        <CardContent className="flex flex-1 flex-col p-4">
          <div className="relative mb-4 flex items-center justify-between">
             <div className="flex items-center gap-3">
                 <div className="relative h-12 w-12 shrink-0">
                    <Image src={voice.avatarUrl} alt={voice.name} fill className="rounded-full object-cover" />
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute inset-0 h-full w-full rounded-full bg-black/30 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => setIsPlaying(!isPlaying)}
                    >
                        {isPlaying ? <Pause className="h-5 w-5"/> : <Play className="h-5 w-5" />}
                    </Button>
                 </div>
                 <div>
                    <h3 className="font-bold text-lg">{voice.name}</h3>
                    <p className="text-xs text-muted-foreground">by {voice.creator}</p>
                 </div>
             </div>
             {voice.isPremium && <Badge className="absolute -top-1 -right-1 bg-primary/20 text-primary border-primary/30">Premium</Badge>}
          </div>

          <div className="h-8 mb-4">
              {isPlaying ? <PlayingWaveform /> : <Waveform />}
          </div>
          
          <p className="text-sm text-muted-foreground flex-1 mb-4 h-10">{voice.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {voice.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="border-none bg-primary/10 text-primary/90"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
             <div className="flex items-center gap-1">
                <span className="text-yellow-400">⭐</span>
                <span>{voice.rating}</span>
             </div>
             <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsLiked(!isLiked)}>
                    <Heart className={cn("h-4 w-4", isLiked && "fill-red-500 text-red-500")}/>
                </Button>
                <Button 
                    variant={isAdded ? "secondary" : "outline"} 
                    size="sm" 
                    className="h-8 rounded-lg"
                    onClick={() => setIsAdded(!isAdded)}
                >
                    {isAdded ? <Check className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                    {isAdded ? 'Added' : 'Add'}
                </Button>
             </div>
          </div>

        </CardContent>
      </Card>
    </motion.div>
  );
}
