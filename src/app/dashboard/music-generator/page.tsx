'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Music, 
  Play, 
  Loader2, 
  Zap,
  CheckCircle2,
  Download,
  Volume2,
  Clock,
  Settings2
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const MAX_CHARACTERS = 500;

// Component for the high-end Roboto 20px prompt editor
const ModernTextEditor = ({ value, onChange, maxLength }: { value: string, onChange: (val: string) => void, maxLength: number }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.innerText;
    if (text.length <= maxLength) {
      onChange(text);
    } else {
      e.currentTarget.innerText = text.slice(0, maxLength);
    }
  };

  return (
    <div className="relative group">
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        suppressContentEditableWarning
        className="w-full min-h-[200px] p-0 text-[20px] leading-relaxed outline-none whitespace-pre-wrap bg-transparent placeholder:text-muted-foreground/50 font-medium text-white/90"
        style={{ fontFamily: "'Roboto', sans-serif" }}
        data-placeholder="Describe the track you want to generate (e.g., 'A smooth lo-fi hip hop track with rainy window vibes and a soft piano melody')..."
      >
        {value}
      </div>
      {value.length === 0 && (
        <div className="absolute top-0 left-0 pointer-events-none text-muted-foreground/30 text-[20px] italic font-medium" style={{ fontFamily: "'Roboto', sans-serif" }}>
          Describe the track you want to generate...
        </div>
      )}
    </div>
  );
};

export default function MusicGeneratorPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [params, setParams] = useState({
    genre: 'lofi',
    mood: 'relaxing',
    duration: 30,
    tempo: 90,
  });

  const characterCount = prompt.length;

  const handleGenerate = () => {
    if (!prompt || isGenerating) return;
    
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Track Generated",
        description: "Your unique AI music track is ready to preview.",
      });
    }, 3000);
  };

  return (
    <div className="max-w-[900px] mx-auto space-y-10 pb-20 px-4 md:px-0">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/40 backdrop-blur-[40px] border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden ring-1 ring-white/10"
      >
        {/* Top Action Bar */}
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 shadow-lg">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                <Music className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold leading-tight">AI Music Generator</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Generative Studio</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="rounded-full h-12 px-6 border-white/10 bg-white/5 hover:bg-white/10 hidden sm:flex font-bold"
              disabled={true} // Enabled after generation
            >
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className="rounded-full h-12 px-10 bg-primary hover:bg-primary/90 font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              {isGenerating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Zap className="mr-2 h-5 w-5 fill-current" />}
              {isGenerating ? 'Composing...' : 'Generate Music'}
            </Button>
          </div>
        </div>

        {/* Music Workspace */}
        <div className="p-10 md:p-14 space-y-12">
          {/* Editor Area */}
          <div className="p-10 rounded-[2rem] bg-white/5 border border-white/10 relative group overflow-hidden">
            <ModernTextEditor 
              value={prompt} 
              onChange={setPrompt} 
              maxLength={MAX_CHARACTERS} 
            />
            
            <div className="flex justify-end pt-6 border-t border-white/5 mt-6">
              <div className={cn(
                "text-[10px] font-mono font-black tracking-[0.2em] px-3 py-1 rounded-full bg-white/5 border border-white/5",
                characterCount >= MAX_CHARACTERS ? "text-red-500 border-red-500/20 bg-red-500/5" : "text-muted-foreground/50"
              )}>
                {characterCount.toLocaleString()} / {MAX_CHARACTERS.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <Label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                  <Settings2 className="h-3.5 w-3.5 text-primary" /> Music Genre
                </Label>
                <Select value={params.genre} onValueChange={(v) => setParams({...params, genre: v})}>
                  <SelectTrigger className="h-14 rounded-2xl bg-white/5 border-white/10 text-base font-bold">
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-white/10 bg-black/90 backdrop-blur-xl">
                    <SelectItem value="lofi">Lo-Fi / Study</SelectItem>
                    <SelectItem value="cinematic">Cinematic / Orchestral</SelectItem>
                    <SelectItem value="electronic">Electronic / Synthwave</SelectItem>
                    <SelectItem value="acoustic">Acoustic / Piano</SelectItem>
                    <SelectItem value="ambient">Ambient / Soundscape</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                  <Zap className="h-3.5 w-3.5 text-primary" /> Track Mood
                </Label>
                <Select value={params.mood} onValueChange={(v) => setParams({...params, mood: v})}>
                  <SelectTrigger className="h-14 rounded-2xl bg-white/5 border-white/10 text-base font-bold">
                    <SelectValue placeholder="Select mood" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-white/10 bg-black/90 backdrop-blur-xl">
                    <SelectItem value="relaxing">Relaxing & Calm</SelectItem>
                    <SelectItem value="energetic">Energetic & Upbeat</SelectItem>
                    <SelectItem value="dark">Dark & Mysterious</SelectItem>
                    <SelectItem value="inspiring">Inspirational</SelectItem>
                    <SelectItem value="melancholic">Melancholic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <Label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 text-primary" /> Track Duration
                  </Label>
                  <span className="text-xs font-mono font-bold text-primary">{params.duration}s</span>
                </div>
                <Slider 
                  value={[params.duration]} 
                  onValueChange={(v) => setParams({...params, duration: v[0]})}
                  min={10}
                  max={60}
                  step={5}
                  className="py-4"
                />
                <div className="flex justify-between text-[10px] uppercase tracking-tighter text-muted-foreground/50 font-black">
                  <span>10s Snippet</span>
                  <span>Full 60s</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <Label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                    <Volume2 className="h-3.5 w-3.5 text-primary" /> BPM / Tempo
                  </Label>
                  <span className="text-xs font-mono font-bold text-primary">{params.tempo} BPM</span>
                </div>
                <Slider 
                  value={[params.tempo]} 
                  onValueChange={(v) => setParams({...params, tempo: v[0]})}
                  min={60}
                  max={180}
                  step={5}
                  className="py-4"
                />
                <div className="flex justify-between text-[10px] uppercase tracking-tighter text-muted-foreground/50 font-black">
                  <span>Chill</span>
                  <span>Fast</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <p className="text-sm font-bold text-white">Royalty Free Generations</p>
              <p className="text-xs text-muted-foreground">All music generated is 100% royalty-free for personal and commercial use.</p>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span className="text-sm font-bold text-primary">Commercial License Included</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Feature Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Neural Synthesis", desc: "Studio-grade quality with complex harmonies.", icon: Music },
          { title: "Infinite Tracks", desc: "Never the same track twice. Unique generations.", icon: Zap },
          { title: "Stem Export", desc: "Coming soon: Export individual instruments.", icon: Settings2 },
        ].map((feature, i) => (
          <div key={i} className="p-6 rounded-[2rem] bg-white/5 border border-white/10 flex items-start gap-4">
            <feature.icon className="h-5 w-5 text-primary mt-1" />
            <div>
              <h5 className="text-sm font-black uppercase tracking-widest text-white">{feature.title}</h5>
              <p className="text-xs text-muted-foreground mt-1">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
