
'use client';

import { motion } from 'framer-motion';
import { Play, Pause, Waves, User, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const COLORS = ['bg-primary', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500'];

const VoiceQualitySection = () => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { firestore } = useFirebase();

  // Fetch 4 speakers from the database for preview
  const voicesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'voices'), limit(4));
  }, [firestore]);

  const { data: voices, isLoading } = useCollection(voicesQuery);

  const togglePlay = (voice: any) => {
    if (!voice.audioUrl) return;

    if (playingId === voice.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(voice.audioUrl);
      audioRef.current.onended = () => setPlayingId(null);
      audioRef.current.play().catch(console.error);
      setPlayingId(voice.id);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <section id="voice-demo" className="py-24 bg-gradient-to-b from-black/40 to-transparent">
      <div className="container mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6 leading-tight">
              Unmatched Voice Quality <br />
              <span className="text-primary">Indistinguishable from Human</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Preview our premium voices below. Our neural models are trained on thousands of hours of expressive speech to capture subtle nuances and emotional depth.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 group hover:border-primary/50 transition-all">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Waves className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-bold text-white">Expressive Prosody</div>
                  <div className="text-sm text-muted-foreground">Adjust pitch, speed, and emotion dynamically.</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 group hover:border-primary/50 transition-all">
                <div className="h-12 w-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Waves className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-bold text-white">Studio-Grade Output</div>
                  <div className="text-sm text-muted-foreground">Clean, high-fidelity audio up to 48kHz.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 min-h-[400px]">
            {isLoading ? (
              <div className="col-span-full flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : voices && voices.length > 0 ? (
              voices.map((voice, idx) => {
                const colorClass = COLORS[idx % COLORS.length];
                return (
                  <motion.div
                    key={voice.id}
                    whileHover={{ y: -5 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
                  >
                    <div className={cn("absolute top-0 right-0 h-24 w-24 opacity-5 blur-[40px] rounded-full", colorClass)} />
                    
                    <div className="flex items-center justify-between mb-6">
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        className="h-12 w-12 rounded-full bg-white text-black hover:bg-primary hover:text-white z-10"
                        onClick={() => togglePlay(voice)}
                      >
                        {playingId === voice.id ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
                      </Button>
                      <Badge variant="outline" className="border-white/10 text-[10px] uppercase font-bold tracking-widest bg-black/20">
                        {voice.style || 'Premium'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                        {voice.avatarUrl ? (
                          <Image src={voice.avatarUrl} alt={voice.voiceName} fill className="object-cover" />
                        ) : (
                          <User className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-white text-base truncate">{voice.voiceName}</h4>
                        <p className="text-xs text-muted-foreground truncate">{voice.language}</p>
                      </div>
                    </div>
                    
                    {playingId === voice.id && (
                      <div className="mt-2 flex items-end gap-0.5 h-8">
                        {[...Array(20)].map((_, i) => (
                          <motion.div
                            key={i}
                            className={cn("w-1 rounded-full", colorClass.replace('bg-', 'bg-opacity-80 bg-'))}
                            style={{ backgroundColor: 'currentColor' }}
                            animate={{ height: ['20%', '80%', '20%'] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.05 }}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-2xl border-white/10 opacity-50">
                <p className="text-sm">No voices found in database.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VoiceQualitySection;
