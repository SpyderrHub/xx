'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Zap, Play, Pause, Mic2, Sparkles, Terminal, Globe } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const DEFAULT_PROMPT = "A warm, confident Indian female in her mid-20s with natural Hindi pronunciation, expressive emotions, gentle pauses, and studio-quality audio.";

export default function VoiceDesignerDemo() {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [text, setText] = useState("Welcome to QuantisAI Labs. This is how I sound based on your description.");
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleGenerate = async () => {
    if (!prompt || !text || isGenerating) return;

    setIsGenerating(true);
    setAudioUrl(null);
    setIsPlaying(false);

    try {
      // Simulate neural generation
      await new Promise(resolve => setTimeout(resolve, 2500));
      setAudioUrl('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
      toast({ title: 'Identity Synthesized', description: 'Your custom voice is ready to preview.' });
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to synthesize identity.', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <section id="tts-demo" className="py-24 relative">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
            <Mic2 className="h-3 w-3" />
            <span>Interactive Studio Preview</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Prompt-Based Voice Design
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto font-medium">
            Describe any character or emotion. Our neural engine builds a unique vocal identity in real-time.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full -z-10" />
          
          <Card className="glass-card rounded-[2.5rem] border-white/5 bg-black/40 shadow-3d overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-white/5 px-8 py-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/20" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/20" />
                  <div className="h-3 w-3 rounded-full bg-green-500/20" />
                </div>
                <div className="flex items-center gap-2">
                   <Terminal className="h-3 w-3 text-muted-foreground" />
                   <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">studio.quantisai.org</span>
                </div>
              </div>

              <div className="p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-10">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">1. Describe the voice</label>
                    </div>
                    <Textarea 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[160px] resize-none bg-white/[0.02] border-white/10 rounded-2xl focus:ring-primary/20 text-sm leading-relaxed p-6"
                      placeholder="Describe tone, age, accent, emotion..."
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">2. Enter your script</label>
                    <Textarea 
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="min-h-[120px] resize-none bg-white/[0.02] border-white/10 rounded-2xl focus:ring-primary/20 text-sm leading-relaxed p-6"
                      placeholder="What should the voice say?"
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center space-y-10 lg:border-l lg:border-white/5 lg:pl-12">
                   <div className="w-full flex flex-col items-center gap-6">
                      <div className={cn(
                        "h-32 w-32 rounded-full flex items-center justify-center border-2 border-white/5 bg-white/[0.02] transition-all duration-500",
                        isGenerating ? "border-primary/50 shadow-[0_0_50px_rgba(59,130,246,0.2)]" : ""
                      )}>
                         {isGenerating ? (
                           <Loader2 className="h-12 w-12 text-primary animate-spin" />
                         ) : audioUrl ? (
                           <div className="h-full w-full flex items-center justify-center p-8">
                              <Sparkles className="h-full w-full text-primary" />
                           </div>
                         ) : (
                           <Mic2 className="h-12 w-12 text-muted-foreground/30" />
                         )}
                      </div>
                      
                      <div className="text-center space-y-2">
                        <h4 className="font-bold text-white uppercase text-sm tracking-widest">
                          {isGenerating ? 'Synthesizing Neural Path...' : audioUrl ? 'Identity Prepared' : 'Neural Core Idle'}
                        </h4>
                        <p className="text-xs text-muted-foreground font-medium italic">
                          {isGenerating ? 'Computing frequency response and prosody...' : 'Ready to generate studio-quality output.'}
                        </p>
                      </div>
                   </div>

                   <div className="w-full space-y-4">
                      <Button 
                        size="lg" 
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt || !text}
                        className="w-full h-16 rounded-2xl bg-primary text-white font-black text-base btn-glow shadow-3d"
                      >
                        {isGenerating ? 'Synthesizing...' : 'Generate Voice Identity'}
                        <Zap className={cn("ml-2 h-5 w-5 fill-current", !isGenerating && "animate-pulse")} />
                      </Button>

                      <AnimatePresence>
                        {audioUrl && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-3"
                          >
                            <Button 
                              onClick={togglePlay}
                              className="flex-1 h-14 rounded-xl bg-white text-black hover:bg-gray-100 font-bold"
                            >
                              {isPlaying ? <Pause className="mr-2 h-4 w-4 fill-current" /> : <Play className="mr-2 h-4 w-4 fill-current ml-1" />}
                              {isPlaying ? 'Pause' : 'Play Sample'}
                            </Button>
                            <Button asChild variant="outline" className="h-14 w-14 rounded-xl border-white/10 bg-white/5">
                               <a href={audioUrl} download><Sparkles className="h-5 w-5 text-primary" /></a>
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                   </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-8 flex justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
             <div className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-widest">
               <Globe className="h-4 w-4" /> 500+ Languages
             </div>
             <div className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-widest">
               <Zap className="h-4 w-4" /> 2s Latency
             </div>
             <div className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-widest">
               <Sparkles className="h-4 w-4" /> 48kHz Quality
             </div>
          </div>
        </motion.div>
      </div>
      {audioUrl && (
        <audio 
          ref={audioRef} 
          className="hidden" 
          src={audioUrl} 
          onEnded={() => setIsPlaying(false)} 
        />
      )}
    </section>
  );
}
