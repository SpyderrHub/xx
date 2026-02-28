'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Download, Link as LinkIcon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface AudioOutputCardProps {
  audioUrl: string;
  voice: string;
  duration: number;
  characters: number;
}

export default function AudioOutputCard({
  audioUrl,
  voice,
  duration,
  characters,
}: AudioOutputCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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

    // Auto-play when a new audio URL is provided
    if (audioUrl) {
        audio.play().then(() => setIsPlaying(true)).catch(e => console.error("Autoplay failed", e));
    }


    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  return (
    <Card className="bg-white/5 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={togglePlayPause}>
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
          <div className="flex-1 space-y-1">
            <p className="font-semibold">{voice}</p>
            <div className="relative h-1 w-full rounded-full bg-white/10">
              <div
                className="absolute h-1 rounded-full bg-primary"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          <span className="text-sm text-muted-foreground">
            {formatTime(duration)}
          </span>
          <Button variant="ghost" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-3 flex justify-end space-x-4 text-xs text-muted-foreground">
          <span>{characters} characters</span>
          <span>{duration.toFixed(1)}s duration</span>
        </div>
        <audio ref={audioRef} src={audioUrl} className="hidden"></audio>
      </CardContent>
    </Card>
  );
}
