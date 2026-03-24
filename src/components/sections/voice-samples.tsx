'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, User, Volume2, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const VOICES = [
  { id: '1', name: 'Ryder', language: 'English (US)', gender: 'Male', style: 'Narrator', avatar: 'https://picsum.photos/seed/ryder/200/200' },
  { id: '2', name: 'Selene', language: 'English (UK)', gender: 'Female', style: 'Conversational', avatar: 'https://picsum.photos/seed/selene/200/200' },
  { id: '3', name: 'Arjun', language: 'Hindi', gender: 'Male', style: 'Emotional', avatar: 'https://picsum.photos/seed/arjun/200/200' },
  { id: '4', name: 'Mei', language: 'Japanese', gender: 'Female', style: 'News', avatar: 'https://picsum.photos/seed/mei/200/200' },
];

const VoiceCard = ({ voice }: { voice: typeof VOICES[0] }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [randomBars, setRandomBars] = useState<number[]>([]);

  useEffect(() => {
    setRandomBars(Array.from({ length: 15 }, () => Math.random() * 100));
  }, []);

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card rounded-[2rem] p-6 group transition-all hover:border-primary/40"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-primary/50 transition-colors">
          <Image src={voice.avatar} alt={voice.name} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-black text-white text-lg truncate">{voice.name}</h4>
          <div className="flex gap-2 mt-1">
            <Badge variant="outline" className="bg-white/5 border-none text-[9px] uppercase font-bold text-muted-foreground px-2">
              {voice.language}
            </Badge>
            <Badge variant="outline" className="bg-primary/10 border-none text-[9px] uppercase font-bold text-primary px-2">
              {voice.gender}
            </Badge>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4 border border-white/5 group-hover:bg-white/10 transition-colors">
        <Button 
          size="icon" 
          variant="secondary" 
          onClick={() => setIsPlaying(!isPlaying)}
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
      
      <p className="mt-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] italic px-2">
        {voice.style} &bull; 48kHz Stereo
      </p>
    </motion.div>
  );
};

export default function VoiceSamplesSection() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {VOICES.map((voice) => (
            <VoiceCard key={voice.id} voice={voice} />
          ))}
        </div>
      </div>
    </section>
  );
}