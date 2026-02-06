'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Loader, Pause, Mic } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const InteractiveDemo = () => {
  const [status, setStatus] = useState<
    'idle' | 'generating' | 'playing' | 'paused'
  >('idle');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'playing') {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus('idle');
            return 0;
          }
          return prev + 1.25;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleGenerate = () => {
    setStatus('generating');
    setProgress(0);
    setTimeout(() => {
      setStatus('idle');
    }, 2000);
  };

  const handlePlayPause = () => {
    if (status === 'playing') {
      setStatus('paused');
    } else {
      setStatus('playing');
    }
  };

  return (
    <Card className="w-full max-w-2xl rounded-2xl shadow-2xl">
      <CardContent className="p-6 space-y-4">
        <Textarea
          placeholder="Type or paste your text here to generate audio..."
          className="min-h-[120px] rounded-xl text-base"
          defaultValue="Hello, welcome to Bhoomi AI. Experience the future of voice generation with our cutting-edge technology."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select defaultValue="en-us">
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en-us">English (US)</SelectItem>
              <SelectItem value="en-gb">English (UK)</SelectItem>
              <SelectItem value="es-es">Spanish (Spain)</SelectItem>
              <SelectItem value="fr-fr">French (France)</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="alex">
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Select Voice" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alex">Alex (Male)</SelectItem>
              <SelectItem value="sara">Sara (Female)</SelectItem>
              <SelectItem value="leo">Leo (Male)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {status === 'idle' && progress > 0 ? (
          <div className="flex items-center gap-4 rounded-xl border p-3">
            <Button size="icon" variant="ghost" onClick={handlePlayPause}>
              <Play className="h-5 w-5" />
            </Button>
            <Progress value={progress} className="w-full" />
            <span className="text-sm font-mono text-muted-foreground">0:08</span>
          </div>
        ) : (
          <Button
            size="lg"
            className="w-full rounded-xl"
            onClick={handleGenerate}
            disabled={status === 'generating'}
          >
            {status === 'generating' ? (
              <Loader className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Mic className="mr-2 h-5 w-5" />
            )}
            Generate Audio
          </Button>
        )}
        
        {(status === 'playing' || status === 'paused') && (
            <div className="flex items-center gap-4 rounded-xl border bg-secondary p-3">
                <Button size="icon" variant="ghost" onClick={handlePlayPause}>
                    {status === 'playing' ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <Progress value={progress} className="w-full" />
                <span className="text-sm font-mono text-muted-foreground">
                    {`0:${Math.floor(progress / 100 * 8).toString().padStart(2, '0')}`}
                </span>
            </div>
        )}
      </CardContent>
    </Card>
  );
};

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
       <div className="absolute inset-0 -z-10 bg-secondary">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-background to-secondary"></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Generate Lifelike AI Voices
            <span className="block text-primary">in Seconds</span>
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-muted-foreground sm:text-xl">
            Our cutting-edge text-to-speech technology brings your content to
            life with realistic, multi-lingual AI voices.
          </p>
          <div className="mt-10 w-full">
            <InteractiveDemo />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
