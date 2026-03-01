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
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6 leading-tight text-center lg:text-left">
              Unmatched Voice Quality <br />
              <span className="text-primary">Indistinguishable from Human</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed text-center lg:text-left">
              Preview our premium voices below. Our neural models are trained on thousands of hours of expressive speech to capture subtle nuances and emotional depth.
            </p>
            
            <div className="space-y-4 max-w-md mx-auto lg:mx-0">
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

          <div className="grid grid-cols-2 gap-4 sm:gap-6 min-h-[400px]">
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
                    className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 relative overflow-hidden group"
                  >
                    <div className={cn("absolute top-0 right-0 h-24 w-24 opacity-5 blur-[40px] rounded-full", colorClass)} />
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div 
                          className="relative h-10 w-10 sm:h-14 sm:w-14 rounded-full overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center shrink-0 cursor-pointer group/avatar shadow-lg transition-transform active:scale-95"
                          onClick={() => togglePlay(voice)}
                        >
                          {voice.avatarUrl ? (
                            <Image 
                              src={voice.avatarUrl} 
                              alt={voice.voiceName} 
                              fill 
                              className={cn(
                                "object-cover transition-opacity",
                                playingId === voice.id ? "opacity-40" : "group-hover/avatar:opacity-40"
                              )} 
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <User className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                            </div>
                          )}
                          <div className={cn(
                            "absolute inset-0 flex items-center justify-center transition-opacity bg-black/20",
                            playingId === voice.id ? "opacity-100" : "opacity-0 group-hover/avatar:opacity-100"
                          )}>
                            {playingId === voice.id ? (
                              <Pause className="h-5 w-5 sm:h-6 sm:w-6 text-white fill-current" />
                            ) : (
                              <Play className="h-5 w-5 sm:h-6 sm:w-6 text-white fill-current ml-1" />
                            )}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-white text-sm sm:text-base truncate">{voice.voiceName}</h4>
                          <p className="text-[10px] text-muted-foreground truncate">{voice.language}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-white/10 text-[8px] sm:text-[10px] uppercase font-bold tracking-widest bg-black/20 h-fit w-fit">
                        {voice.style || 'Premium'}
                      </Badge>
                    </div>
                    
                    <div className="h-10 sm:h-12 flex flex-col justify-center">
                      {playingId === voice.id ? (
                        <div className="flex items-end gap-0.5 h-6 sm:h-8">
                          {[...Array(20)].map((_, i) => (
                            <motion.div
                              key={i}
                              className={cn("w-0.5 sm:w-1 rounded-full", colorClass.replace('bg-', 'bg-opacity-80 bg-'))}
                              style={{ backgroundColor: 'currentColor' }}
                              animate={{ height: ['20%', '100%', '20%'] }}
                              transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.03 }}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-0.5 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full w-full bg-white/5" />
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[8px] sm:text-[10px] text-muted-foreground font-mono">
                      <span>48kHz / 24-bit</span>
                      <span className="uppercase truncate ml-2">{voice.gender}</span>
                    </div>
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
