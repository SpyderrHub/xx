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
        className="w-full min-h-[160px] md:min-h-[200px] p-0 text-[18px] md:text-[20px] leading-relaxed outline-none whitespace-pre-wrap bg-transparent placeholder:text-muted-foreground/50 font-medium text-white/90"
        style={{ fontFamily: "'Roboto', sans-serif" }}
        data-placeholder="Describe the track you want to generate..."
      >
        {value}
      </div>
      {value.length === 0 && (
        <div className="absolute top-0 left-0 pointer-events-none text-muted-foreground/30 text-[18px] md:text-[20px] italic font-medium" style={{ fontFamily: "'Roboto', sans-serif" }}>
          Describe the track you want to generate (e.g. 'A smooth lo-fi track with soft piano')...
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
    <div className="max-w-[900px] mx-auto space-y-6 md:space-y-10 pb-20 px-4 md:px-0">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/40 backdrop-blur-[40px] border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden ring-1 ring-white/10"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 md:p-8 border-b border-white/5 bg-white/5 gap-4">
          <div className="flex items-center gap-3 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-white/5 border border-white/10 shadow-lg w-full sm:w-auto">
            <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
              <Music className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-xs md:text-sm font-bold leading-tight">AI Music Generator</p>
              <p className="text-[8px] md:text-[10px] text-muted-foreground uppercase tracking-widest font-black">Generative Studio</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
            <Button 
              variant="outline" 
              className="flex-1 sm:flex-none rounded-full h-10 md:h-12 px-4 md:px-6 border-white/10 bg-white/5 hover:bg-white/10 font-bold text-xs md:text-sm"
              disabled={true}
            >
              <Download className="mr-2 h-3.5 w-3.5 md:h-4 md:w-4" /> Export
            </Button>
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className="flex-[1.5] sm:flex-none rounded-full h-10 md:h-12 px-6 md:px-10 bg-primary hover:bg-primary/90 font-black text-sm md:text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 md:h-5 md:w-5 animate-spin" /> : <Zap className="mr-2 h-4 w-4 md:h-5 md:w-5 fill-current" />}
              {isGenerating ? 'Composing...' : 'Generate'}
            </Button>
          </div>
        </div>

        <div className="p-6 md:p-14 space-y-8 md:space-y-12">
          <div className="p-6 md:p-10 rounded-xl md:rounded-[2rem] bg-white/5 border border-white/10 relative group overflow-hidden">
            <ModernTextEditor 
              value={prompt} 
              onChange={setPrompt} 
              maxLength={MAX_CHARACTERS} 
            />
            
            <div className="flex justify-end pt-4 md:pt-6 border-t border-white/5 mt-4 md:mt-6">
              <div className={cn(
                "text-[9px] md:text-[10px] font-mono font-black tracking-[0.2em] px-3 py-1 rounded-full bg-white/5 border border-white/5",
                characterCount >= MAX_CHARACTERS ? "text-red-500 border-red-500/20 bg-red-500/5" : "text-muted-foreground/50"
              )}>
                {characterCount.toLocaleString()} / {MAX_CHARACTERS.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-6 md:space-y-8">
              <div className="space-y-3 md:space-y-4">
                <Label className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground">
                  <Settings2 className="h-3 w-3 md:h-3.5 md:w-3.5 text-primary" /> Music Genre
                </Label>
                <Select value={params.genre} onValueChange={(v) => setParams({...params, genre: v})}>
                  <SelectTrigger className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-white/5 border-white/10 text-sm md:text-base font-bold">
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl md:rounded-2xl border-white/10 bg-black/90 backdrop-blur-xl">
                    <SelectItem value="lofi">Lo-Fi / Study</SelectItem>
                    <SelectItem value="cinematic">Cinematic / Orchestral</SelectItem>
                    <SelectItem value="electronic">Electronic / Synthwave</SelectItem>
                    <SelectItem value="acoustic">Acoustic / Piano</SelectItem>
                    <SelectItem value="ambient">Ambient / Soundscape</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 md:space-y-4">
                <Label className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground">
                  <Zap className="h-3 w-3 md:h-3.5 md:w-3.5 text-primary" /> Track Mood
                </Label>
                <Select value={params.mood} onValueChange={(v) => setParams({...params, mood: v})}>
                  <SelectTrigger className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-white/5 border-white/10 text-sm md:text-base font-bold">
                    <SelectValue placeholder="Select mood" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl md:rounded-2xl border-white/10 bg-black/90 backdrop-blur-xl">
                    <SelectItem value="relaxing">Relaxing & Calm</SelectItem>
                    <SelectItem value="energetic">Energetic & Upbeat</SelectItem>
                    <SelectItem value="dark">Dark & Mysterious</SelectItem>
                    <SelectItem value="inspiring">Inspirational</SelectItem>
                    <SelectItem value="melancholic">Melancholic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-6 md:space-y-8">
              <div className="space-y-4 md:space-y-6">
                <div className="flex justify-between items-center">
                  <Label className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground">
                    <Clock className="h-3 w-3 md:h-3.5 md:w-3.5 text-primary" /> Duration
                  </Label>
                  <span className="text-[10px] md:text-xs font-mono font-bold text-primary">{params.duration}s</span>
                </div>
                <Slider 
                  value={[params.duration]} 
                  onValueChange={(v) => setParams({...params, duration: v[0]})}
                  min={10}
                  max={60}
                  step={5}
                  className="py-2 md:py-4"
                />
                <div className="flex justify-between text-[8px] md:text-[10px] uppercase tracking-tighter text-muted-foreground/50 font-black">
                  <span>10s</span>
                  <span>60s</span>
                </div>
              </div>

              <div className="space-y-4 md:space-y-6">
                <div className="flex justify-between items-center">
                  <Label className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground">
                    <Volume2 className="h-3 w-3 md:h-3.5 md:w-3.5 text-primary" /> Tempo
                  </Label>
                  <span className="text-[10px] md:text-xs font-mono font-bold text-primary">{params.tempo} BPM</span>
                </div>
                <Slider 
                  value={[params.tempo]} 
                  onValueChange={(v) => setParams({...params, tempo: v[0]})}
                  min={60}
                  max={180}
                  step={5}
                  className="py-2 md:py-4"
                />
                <div className="flex justify-between text-[8px] md:text-[10px] uppercase tracking-tighter text-muted-foreground/50 font-black">
                  <span>Chill</span>
                  <span>Fast</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 md:pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            <div className="text-center md:text-left">
              <p className="text-xs md:text-sm font-bold text-white">Royalty Free Generations</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">100% royalty-free for commercial use.</p>
            </div>
            <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl bg-primary/5 border border-primary/10">
              <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              <span className="text-[10px] md:text-sm font-bold text-primary">License Included</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {[
          { title: "Neural Synthesis", desc: "Studio-grade quality tracks.", icon: Music },
          { title: "Infinite Tracks", desc: "Never the same track twice.", icon: Zap },
          { title: "Commercial", desc: "Use anywhere royalty-free.", icon: Settings2 },
        ].map((feature, i) => (
          <div key={i} className="p-4 md:p-6 rounded-xl md:rounded-[2rem] bg-white/5 border border-white/10 flex items-start gap-3 md:gap-4">
            <feature.icon className="h-4 w-4 md:h-5 md:w-5 text-primary mt-1" />
            <div>
              <h5 className="text-[10px] md:text-sm font-black uppercase tracking-widest text-white">{feature.title}</h5>
              <p className="text-[9px] md:text-xs text-muted-foreground mt-1">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
