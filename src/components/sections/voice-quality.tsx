
'use client';

import { motion } from 'framer-motion';
import { Play, Pause, Waves } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const demos = [
  { id: 1, name: 'Aria', lang: 'English (US)', style: 'Natural Female', color: 'bg-primary' },
  { id: 2, name: 'Vikram', lang: 'Hindi', style: 'Story Narration', color: 'bg-indigo-500' },
  { id: 3, name: 'Kabir', lang: 'Hindi', style: 'Conversational Kid', color: 'bg-purple-500' },
  { id: 4, name: 'Margaret', lang: 'English (UK)', style: 'Elderly / Wise', color: 'bg-pink-500' },
];

const VoiceQualitySection = () => {
  const [playingId, setPlayingId] = useState<number | null>(null);

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
              Our neural models are trained on thousands of hours of expressive speech to capture subtle nuances, breathing, and emotional depth.
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
                  <div className="font-bold text-white">Zero Robotic Artifacts</div>
                  <div className="text-sm text-muted-foreground">Clean, studio-quality audio up to 48kHz.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {demos.map((demo) => (
              <motion.div
                key={demo.id}
                whileHover={{ y: -5 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
              >
                <div className={`absolute top-0 right-0 h-24 w-24 ${demo.color} opacity-5 blur-[40px] rounded-full`} />
                <div className="flex items-center justify-between mb-6">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-12 w-12 rounded-full bg-white text-black hover:bg-primary hover:text-white"
                    onClick={() => setPlayingId(playingId === demo.id ? null : demo.id)}
                  >
                    {playingId === demo.id ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
                  </Button>
                  <Badge variant="outline" className="border-white/10 text-[10px] uppercase font-bold tracking-widest">{demo.style}</Badge>
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">{demo.name}</h4>
                  <p className="text-sm text-muted-foreground">{demo.lang}</p>
                </div>
                
                {playingId === demo.id && (
                  <div className="mt-4 flex items-end gap-0.5 h-8">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`w-1 rounded-full ${demo.color}`}
                        animate={{ height: ['20%', '80%', '20%'] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.05 }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VoiceQualitySection;
