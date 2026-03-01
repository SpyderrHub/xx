'use client';

import { useState, useEffect, useRef } from 'react';
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

const MAX_CHARS = 200;

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
    if (!text || !selectedVoiceId || isGenerating || text.length > MAX_CHARS) return;

    const selectedVoice = voices?.find(v => v.id === selectedVoiceId);
    if (!selectedVoice) return;

    setIsGenerating(true);
    setAudioUrl(null);
    setIsPlaying(false);

    try {
      const audioPath = getStoragePathFromUrl(selectedVoice.audioUrl);
      if (!audioPath) throw new Error('Invalid voice sample path');

      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://58.224.7.137:45153/v1/text-to-speech').replace(/\/$/, '') + '/';
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
    <section id="tts-demo" className="pb-24 pt-0 relative">
      <div className="container mx-auto px-6 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Saanchi AI Voice Studio
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Enter your text, select a professional speaker, and listen to the magic.
            </p>
          </div>

          <Card className="bg-card/40 backdrop-blur-xl border-white/5 shadow-2xl overflow-hidden">
            <CardContent className="p-6 sm:p-10 space-y-10">
              {/* Top: Text Input */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] block">Input Text</label>
                  <span className={cn(
                    "text-xs font-mono transition-colors",
                    text.length >= MAX_CHARS ? "text-red-500" : "text-muted-foreground"
                  )}>
                    {text.length} / {MAX_CHARS}
                  </span>
                </div>
                <Textarea 
                  value={text}
                  onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
                  placeholder="What would you like Saanchi AI to say?"
                  className="min-h-[180px] resize-none bg-white/5 border-white/10 rounded-2xl focus:ring-primary/20 text-lg leading-relaxed shadow-inner"
                  maxLength={MAX_CHARS}
                />
              </div>

              {/* Middle: Speaker Selection Grid */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] block">Select Speaker</label>
                
                {voicesLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="h-20 w-full bg-white/5 animate-pulse rounded-2xl border border-white/5" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {voices?.map((voice) => (
                      <button
                        key={voice.id}
                        onClick={() => setSelectedVoiceId(voice.id)}
                        className={cn(
                          "h-20 flex items-center gap-4 px-4 rounded-2xl transition-all border text-left group",
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
                          <p className="text-[10px] text-muted-foreground truncate uppercase tracking-wider">{voice.language} • {voice.style}</p>
                        </div>
                        {selectedVoiceId === voice.id && (
                          <div className="h-2 w-2 rounded-full bg-primary animate-pulse shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom: Actions Centered */}
              <div className="flex flex-col items-center justify-center pt-4 border-t border-white/5 gap-6">
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Button 
                    size="lg" 
                    onClick={handleGenerate}
                    disabled={isGenerating || !text || !selectedVoiceId || text.length > MAX_CHARS}
                    className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 font-bold text-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                  >
                    {isGenerating ? <Loader2 className="mr-3 h-6 w-6 animate-spin" /> : <Zap className="mr-3 h-6 w-6" />}
                    {isGenerating ? 'Generating...' : 'Generate Audio'}
                  </Button>

                  <AnimatePresence>
                    {audioUrl && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3"
                      >
                        <Button 
                          variant="secondary" 
                          size="icon" 
                          onClick={handleTogglePlay}
                          className="h-16 w-16 rounded-2xl bg-white text-black hover:bg-gray-100 shadow-xl transition-all hover:scale-105"
                        >
                          {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          asChild
                          className="h-16 w-16 rounded-2xl border-white/10 hover:bg-white/5 transition-all hover:scale-105"
                        >
                          <a href={audioUrl} download="saanchi-ai-voice.wav">
                            <Download className="h-8 w-8" />
                          </a>
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {audioUrl && (
                  <p className="text-sm text-primary font-medium animate-pulse">
                    ✨ Your AI voice is ready to play!
                  </p>
                )}
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
