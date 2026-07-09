'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, limit, where } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Zap, Play, Pause, Download, User, Terminal } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { WeavyPattern } from '@/components/author/avatar-upload';
import { Skeleton } from '@/components/ui/skeleton';

const MAX_CHARS = 150;

export default function TtsDemoSection() {
  const [text, setText] = useState('Experience the power of QuantisAI Labs voices. Simply type your text and choose a speaker to begin.');
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { firestore } = useFirebase();

  const voicesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'voices'), 
      where('isPublic', '==', true),
      where('status', '==', 'approved'),
      limit(6)
    );
  }, [firestore]);

  const { data: voices, isLoading: voicesLoading } = useCollection(voicesQuery);

  useEffect(() => {
    if (voices && voices.length > 0 && !selectedVoiceId) {
      setSelectedVoiceId(voices[0].id);
    }
  }, [voices, selectedVoiceId]);

  const handleTogglePlay = () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleGenerate = async () => {
    if (!text || !selectedVoiceId || isGenerating || text.length > MAX_CHARS) return;

    setIsGenerating(true);
    setAudioUrl(null);
    setIsPlaying(false);

    try {
      // Simulation of a public synthesis path
      const mockAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAudioUrl(mockAudioUrl);
      toast({ title: 'Preview Ready', description: 'Audio generated successfully.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section id="tts-demo" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[8px] font-black uppercase tracking-[0.2em] mb-4">
              <Terminal className="h-3 w-3" />
              <span>Interactive Console</span>
            </div>
            <h2 className="text-xl font-black tracking-tight text-white sm:text-5xl">
              Neural Studio Preview
            </h2>
          </div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <Card className="glass-card border-white/5 shadow-3d rounded-[3rem] overflow-hidden bg-black/40">
              <CardContent className="p-0">
                <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/30" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/30" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500/30" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">studio.quantisai.org</span>
                </div>
                
                <div className="p-6 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-7 space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <label className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Narration Text</label>
                        <span className="text-[9px] font-mono text-muted-foreground">{text.length}/{MAX_CHARS}</span>
                      </div>
                      <Textarea 
                        value={text}
                        onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
                        className="h-40 resize-none bg-white/[0.02] border-white/10 rounded-2xl focus:ring-primary/20 text-sm sm:text-lg leading-relaxed shadow-inner font-medium placeholder:opacity-20"
                        maxLength={MAX_CHARS}
                        placeholder="What should the AI say?"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <Button 
                        size="lg" 
                        onClick={handleGenerate}
                        disabled={isGenerating || !text || !selectedVoiceId}
                        className="h-12 sm:h-14 px-8 rounded-2xl bg-primary text-white font-black text-xs sm:text-sm btn-glow shadow-3d flex-1"
                      >
                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4 fill-current" />}
                        {isGenerating ? 'Synthesizing...' : 'Generate Preview Audio'}
                      </Button>

                      {audioUrl && (
                        <div className="flex gap-2">
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            onClick={handleTogglePlay}
                            className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-white text-black hover:bg-gray-100 shadow-xl"
                          >
                            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            asChild
                            className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl border-white/10 bg-white/5"
                          >
                            <a href={audioUrl} download="sample.wav"><Download className="h-5 w-5" /></a>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-6">
                    <label className="text-[9px] font-black text-primary uppercase tracking-[0.2em] px-1 block">Speaker Selection</label>
                    <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto scrollbar-hide pr-1">
                      {voicesLoading ? (
                        [...Array(6)].map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl bg-white/5" />)
                      ) : (
                        voices?.map((voice) => {
                          const isGradient = voice.avatarUrl?.startsWith('weavy:');
                          const gradientIndex = isGradient ? parseInt(voice.avatarUrl.split(':')[1]) : 0;
                          return (
                            <button
                              key={voice.id}
                              onClick={() => setSelectedVoiceId(voice.id)}
                              className={cn(
                                "h-16 flex items-center gap-3 px-3 rounded-2xl transition-all border text-left elevated-card",
                                selectedVoiceId === voice.id 
                                  ? "bg-primary/10 border-primary/60 shadow-[0_10px_20px_rgba(255,102,0,0.1)]" 
                                  : "bg-white/5 border-white/5 hover:border-white/10"
                              )}
                            >
                              <div className="relative h-8 w-8 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-white/5">
                                {isGradient ? <WeavyPattern presetIndex={gradientIndex} /> : voice.avatarUrl && <Image src={voice.avatarUrl} alt="" fill unoptimized className="object-cover" />}
                              </div>
                              <span className={cn(
                                "text-[10px] font-bold truncate",
                                selectedVoiceId === voice.id ? "text-primary" : "text-white/70"
                              )}>{voice.voiceName}</span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <audio ref={audioRef} className="hidden" src={audioUrl || undefined} onEnded={() => setIsPlaying(false)} />
    </section>
  );
}
