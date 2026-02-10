'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';

export function AudioPreviewPlayer({ url }: { url: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [randomDelays, setRandomDelays] = useState<number[]>([]);
  const [randomHeights, setRandomHeights] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Generate random values only on client to prevent hydration mismatch
    setRandomDelays(Array.from({ length: 20 }, (_, i) => i * 0.05));
    setRandomHeights(Array.from({ length: 20 }, () => Math.random() * 24 + 8));
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [url]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex items-center gap-4 bg-black/40 p-3 rounded-xl border border-white/5">
      <Button variant="ghost" size="icon" onClick={togglePlay} className="h-10 w-10 shrink-0">
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
      </Button>
      
      <div className="flex-1 space-y-2">
        <div className="flex justify-center items-end h-8 gap-0.5">
          {randomHeights.map((height, i) => (
            <motion.div 
              key={i}
              className={`w-1 rounded-full ${isPlaying ? 'bg-primary' : 'bg-muted-foreground/30'}`}
              animate={isPlaying ? { 
                height: [8, height, 8] 
              } : { height: 8 }}
              transition={{ repeat: Infinity, duration: 0.8, delay: randomDelays[i] }}
            />
          ))}
          {randomHeights.length === 0 && Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="w-1 h-2 rounded-full bg-muted-foreground/30" />
          ))}
        </div>
        <div className="relative h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="absolute h-full bg-primary"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <audio ref={audioRef} src={url} className="hidden" />
    </div>
  );
}