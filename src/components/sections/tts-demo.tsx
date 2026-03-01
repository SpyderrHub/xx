'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Zap, Play, Pause, Download, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function TtsDemoSection() {
  const [text, setText] = useState('Experience the power of Saanchi AI voices. Simply type your text and choose a speaker to begin.');
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { firestore } = useFirebase();

  // Fetch 5 premium voices from the database
  const voicesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'voices'), limit(5));
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

  const getStoragePathFromUrl = (url: string): string | null => {
    if (!url) return null;
    try {
      const urlObject = new URL(url);
      const pathParts = urlObject.pathname.split('/o/');
      if (pathParts.length > 1) {
        return decodeURIComponent(pathParts[1]);
      }
    } catch (e) {
      console.error('Path parsing error:', e);
    }
    return null;
  };

  const handleGenerate = async () => {
    if (!text || !selectedVoiceId || isGenerating) return;

    const selectedVoice = voices?.find(v => v.id === selectedVoiceId);
    if (!selectedVoice) return;

    setIsGenerating(true);
    setAudioUrl(null);
    setIsPlaying(false);

    try {
      const audioPath = getStoragePathFromUrl(selectedVoice.audioUrl);
      if (!audioPath) throw new Error('Invalid voice sample path');

      const apiUrl = process.env.NEXT_PUBLIC_API_URL + 'v1/text-to-speech/';
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text,
          audio_prompt_path: audioPath,
          language_id: selectedVoice.language.toLowerCase().includes('hindi') ? 'hi' : 'en',
        }),
      });

      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      if (data.audio_url) {
        setAudioUrl(data.audio_url);
        toast({ title: 'Success', description: 'Audio generated!' });
      }
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to generate audio. Please check your configuration.', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section id="tts-demo" className="py-24 relative">
      <div className="container mx-auto px-6 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Try Saanchi AI Studio
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Select a professional speaker and generate high-fidelity audio in seconds.
            </p>
          </div>

          <Card className="bg-card/40 backdrop-blur-xl border-white/5 shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Left: Input & Controls */}
                <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-white/5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Your Text</label>
                    <Textarea 
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Enter text to speak..."
                      className="min-h-[200px] resize-none bg-white/5 border-white/10 rounded-2xl focus:ring-primary/20 text-lg leading-relaxed"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <Button 
                      size="lg" 
                      onClick={handleGenerate}
                      disabled={isGenerating || !text}
                      className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 font-bold text-lg shadow-lg shadow-primary/20"
                    >
                      {isGenerating ? <Loader2 className="mr-2 animate-spin" /> : <Zap className="mr-2" />}
                      {isGenerating ? 'Generating...' : 'Generate Audio'}
                    </Button>

                    <AnimatePresence>
                      {audioUrl && (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-2"
                        >
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            onClick={handleTogglePlay}
                            className="h-14 w-14 rounded-2xl bg-white text-black hover:bg-gray-100"
                          >
                            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            asChild
                            className="h-14 w-14 rounded-2xl border-white/10 hover:bg-white/5"
                          >
                            <a href={audioUrl} download="saanchi-ai-generation.wav">
                              <Download className="h-6 w-6" />
                            </a>
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Right: Speaker Selection */}
                <div className="lg:col-span-5 p-6 sm:p-8 bg-black/20">
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-widest block mb-4">Choose Speaker</label>
                    
                    {voicesLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className="h-20 w-full bg-white/5 animate-pulse rounded-2xl" />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {voices?.map((voice) => (
                          <button
                            key={voice.id}
                            onClick={() => setSelectedVoiceId(voice.id)}
                            className={cn(
                              "w-full h-20 flex items-center gap-4 px-4 rounded-2xl transition-all border text-left group",
                              selectedVoiceId === voice.id 
                                ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(168,85,247,0.1)]" 
                                : "bg-white/5 border-white/5 hover:border-white/20"
                            )}
                          >
                            <div className="relative h-12 w-12 rounded-full overflow-hidden border border-white/10 shrink-0">
                              {voice.avatarUrl ? (
                                <Image src={voice.avatarUrl} alt={voice.voiceName} fill className="object-cover" />
                              ) : (
                                <div className="h-full w-full bg-white/10 flex items-center justify-center">
                                  <User className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className={cn(
                                "font-bold text-sm truncate",
                                selectedVoiceId === voice.id ? "text-primary" : "text-white"
                              )}>
                                {voice.voiceName}
                              </h4>
                              <p className="text-xs text-muted-foreground truncate">{voice.language} • {voice.style}</p>
                            </div>
                            {selectedVoiceId === voice.id && (
                              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <audio 
            ref={audioRef} 
            src={audioUrl || ''} 
            onEnded={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="hidden"
          />
        </div>
      </div>
    </section>
  );
}
