'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { 
  Loader2, 
  Zap, 
  Download, 
  Music, 
  Play, 
  Pause,
  Sparkles,
  Settings2,
  Library,
  Clock,
  Volume2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const MAX_PROMPT_CHARS = 1000;

const StudioTextArea = ({ 
  label, 
  value, 
  onChange, 
  maxLength, 
  placeholder 
}: { 
  label: string, 
  value: string, 
  onChange: (val: string) => void, 
  maxLength: number,
  placeholder: string
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{label}</label>
        <span className="text-[10px] font-mono text-muted-foreground">{value.length} / {maxLength}</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        dir="ltr"
        placeholder={placeholder}
        className="w-full min-h-[400px] md:min-h-[500px] p-8 text-[18px] text-left leading-relaxed outline-none bg-white/[0.02] border border-white/5 rounded-[2.5rem] placeholder:text-muted-foreground/20 font-medium text-white/90 selection:bg-primary/30 resize-none focus:ring-1 focus:ring-primary/20 transition-all shadow-inner"
        style={{ fontFamily: "'Inter', sans-serif" }}
      />
    </div>
  );
};

const AudioPlayerFooter = ({ audioUrl, trackName, isPlaying, onTogglePlay }: any) => {
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.ontimeupdate = () => setProgress((audioRef.current?.currentTime || 0) / (audioRef.current?.duration || 1) * 100);
    }
  }, [audioUrl]);

  if (!audioUrl) return null;

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-white/10 p-4 md:p-6 pb-6 md:pb-6"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4 md:gap-6">
        <div className="flex items-center gap-4 shrink-0 w-full md:w-auto">
          <Button 
            onClick={onTogglePlay}
            className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-white text-black hover:bg-white/90 btn-glow"
          >
            {isPlaying ? <Pause className="h-5 w-5 md:h-6 md:w-6 fill-current" /> : <Play className="h-5 w-5 md:h-6 md:w-6 fill-current ml-1" />}
          </Button>
          <div className="flex flex-col min-w-0">
            <p className="text-xs md:text-sm font-black text-white truncate max-w-[180px]">{trackName}</p>
            <p className="text-[8px] md:text-[10px] text-muted-foreground uppercase tracking-widest font-black">AI Generated Composition</p>
          </div>

          <div className="ml-auto flex items-center gap-2 md:hidden">
             <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-white/10 bg-white/5" asChild>
                <a href={audioUrl} download="saanchi-ai-music.mp3">
                  <Download className="h-4 w-4" />
                </a>
              </Button>
          </div>
        </div>

        <div className="flex-1 flex items-center gap-4 w-full">
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden relative">
            <motion.div className="absolute h-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10" asChild>
            <a href={audioUrl} download="saanchi-ai-music.mp3" title="Download Track">
              <Download className="h-5 w-5" />
            </a>
          </Button>
          <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>
      <audio ref={audioRef} src={audioUrl} />
    </motion.div>
  );
};

export default function MusicGeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [settings, setSettings] = useState({
    duration: 30,
    tempo: 120
  });

  const handleGenerate = () => {
    if (!prompt || isGenerating) return;
    
    setIsGenerating(true);
    setGeneratedAudio(null);

    // Mock composition logic
    setTimeout(() => {
      setGeneratedAudio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
      setIsGenerating(false);
      toast({
        title: "Track Generated",
        description: "Your unique AI composition is ready to preview.",
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Top Studio Header */}
      <div className="sticky top-16 z-40 glass-card border-b border-white/5 py-4 mb-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
              <Music className="h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <h2 className="text-sm font-black text-white">Music Generator</h2>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Composition Engine v2.0</p>
            </div>
          </div>

          <div className="flex-1 max-w-md hidden lg:flex items-center gap-8 px-8">
            <div className="flex-1 space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-primary" />
                  <Label>Duration</Label>
                </div>
                <span>{settings.duration}s</span>
              </div>
              <Slider value={[settings.duration]} min={10} max={60} step={5} onValueChange={(v) => setSettings({...settings, duration: v[0]})} className="h-4" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Volume2 className="h-3 w-3 text-primary" />
                  <Label>Tempo</Label>
                </div>
                <span>{settings.tempo} BPM</span>
              </div>
              <Slider value={[settings.tempo]} min={60} max={180} step={10} onValueChange={(v) => setSettings({...settings, tempo: v[0]})} className="h-4" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className="h-12 px-6 md:px-8 rounded-xl bg-primary btn-glow font-black text-sm"
            >
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4 fill-current" />}
              {isGenerating ? 'Composing...' : 'Generate Track'}
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 max-w-5xl space-y-12 pt-8">
        {/* Main Composition Workspace */}
        <div className="grid grid-cols-1">
          <StudioTextArea 
            label="Music Prompt"
            value={prompt}
            onChange={setPrompt}
            maxLength={MAX_PROMPT_CHARS}
            placeholder='Describe the track... e.g. "A smooth Lo-Fi study track with a melancholic piano melody, subtle vinyl crackle, and a laid-back 90 BPM beat."'
          />
        </div>

        {/* Informational Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12">
          {[
            { title: "Neural Synthesis", desc: "Studio-grade quality tracks.", icon: Music },
            { title: "Royalty Free", desc: "100% commercial license.", icon: Settings2 },
            { title: "Unique Composition", desc: "Never the same track twice.", icon: Zap },
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-start gap-4 hover:bg-white/[0.04] transition-colors group">
              <feature.icon className="h-5 w-5 text-primary mt-1 group-hover:scale-110 transition-transform" />
              <div>
                <h5 className="text-xs font-black uppercase tracking-widest text-white">{feature.title}</h5>
                <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Audio Player Footer */}
      <AudioPlayerFooter 
        audioUrl={generatedAudio} 
        trackName="AI Music Generation"
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
      />
    </div>
  );
}
