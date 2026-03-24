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
  User, 
  Volume2, 
  Mic2, 
  Play, 
  Pause,
  Sparkles,
  Globe2,
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

const MAX_PROMPT_CHARS = 500;
const MAX_PREVIEW_CHARS = 1000;

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
        className="w-full min-h-[200px] p-6 text-[18px] text-left leading-relaxed outline-none bg-white/[0.02] border border-white/5 rounded-[2rem] placeholder:text-muted-foreground/20 font-medium text-white/90 selection:bg-primary/30 resize-none focus:ring-1 focus:ring-primary/20 transition-all"
        style={{ fontFamily: "'Inter', sans-serif" }}
      />
    </div>
  );
};

const AudioPlayerFooter = ({ audioUrl, voice, isPlaying, onTogglePlay }: any) => {
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
      className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-white/10 p-4 md:p-6"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6">
        <div className="flex items-center gap-4 shrink-0">
          <Button 
            onClick={onTogglePlay}
            className="h-14 w-14 rounded-2xl bg-white text-black hover:bg-white/90 btn-glow"
          >
            {isPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current ml-1" />}
          </Button>
          <div className="hidden sm:block">
            <p className="text-sm font-black text-white">Designed Voice Preview</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Synthetic Generation</p>
          </div>
        </div>

        <div className="flex-1 flex items-center gap-4 w-full">
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden relative">
            <motion.div className="absolute h-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button variant="outline" className="h-12 px-6 rounded-xl border-white/10 bg-white/5 font-bold">
            <Download className="mr-2 h-4 w-4" /> Save Voice
          </Button>
        </div>
      </div>
      <audio ref={audioRef} src={audioUrl} />
    </motion.div>
  );
};

export default function VoiceDesignerPage() {
  const [prompt, setPrompt] = useState('');
  const [previewText, setPreviewText] = useState('This is how my new designed voice sounds. You can customize my tone and style using the prompt above.');
  const [isDesigning, setIsDesigning] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [params, setParams] = useState({
    gender: 'female',
    age: 'young',
    accent: 'british',
    strength: 75
  });

  const handleGenerate = () => {
    if (!prompt || !previewText || isDesigning) return;
    
    setIsDesigning(true);
    setGeneratedAudio(null);

    // Mock synthesis logic
    setTimeout(() => {
      setGeneratedAudio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
      setIsDesigning(false);
      toast({
        title: "Voice Designed",
        description: "Your unique custom voice is ready to preview.",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Top Studio Header */}
      <div className="sticky top-16 z-40 glass-card border-b border-white/5 py-4 mb-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <h2 className="text-sm font-black text-white">Voice Designer</h2>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Neural Engine v2.0</p>
            </div>
          </div>

          <div className="flex-1 max-w-xs hidden lg:flex items-center gap-4 px-8">
            <div className="flex-1 space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground">
                <Label>Accent Strength</Label>
                <span>{params.strength}%</span>
              </div>
              <Slider value={[params.strength]} onValueChange={(v) => setParams({...params, strength: v[0]})} className="h-4" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              onClick={handleGenerate}
              disabled={isDesigning || !prompt || !previewText}
              className="h-12 px-6 md:px-8 rounded-xl bg-primary btn-glow font-black text-sm"
            >
              {isDesigning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4 fill-current" />}
              {isDesigning ? 'Designing...' : 'Generate Voice'}
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 max-w-5xl space-y-12">
        {/* Advanced Parameter Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <User className="h-3 w-3" /> Base Gender
            </Label>
            <Select value={params.gender} onValueChange={(v) => setParams({...params, gender: v})}>
              <SelectTrigger className="h-12 rounded-xl bg-white/5 border-white/10 text-xs font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl bg-black/95 backdrop-blur-xl border-white/10">
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Settings2 className="h-3 w-3" /> Target Age
            </Label>
            <Select value={params.age} onValueChange={(v) => setParams({...params, age: v})}>
              <SelectTrigger className="h-12 rounded-xl bg-white/5 border-white/10 text-xs font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl bg-black/95 backdrop-blur-xl border-white/10">
                <SelectItem value="young">Young (20s)</SelectItem>
                <SelectItem value="middle">Middle Aged (40s)</SelectItem>
                <SelectItem value="old">Old (60s+)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Globe2 className="h-3 w-3" /> Regional Accent
            </Label>
            <Select value={params.accent} onValueChange={(v) => setParams({...params, accent: v})}>
              <SelectTrigger className="h-12 rounded-xl bg-white/5 border-white/10 text-xs font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl bg-black/95 backdrop-blur-xl border-white/10">
                <SelectItem value="british">British (RP)</SelectItem>
                <SelectItem value="american">American (General)</SelectItem>
                <SelectItem value="indian">Indian (Standard)</SelectItem>
                <SelectItem value="australian">Australian</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Text Area Workspaces */}
        <div className="grid grid-cols-1 gap-10">
          <StudioTextArea 
            label="Voice Prompt"
            value={prompt}
            onChange={setPrompt}
            maxLength={MAX_PROMPT_CHARS}
            placeholder='Describe the voice... e.g. "A deep, raspy cinematic male voice with a calm, slow pace and a slight southern accent."'
          />

          <StudioTextArea 
            label="Preview Text"
            value={previewText}
            onChange={setPreviewText}
            maxLength={MAX_PREVIEW_CHARS}
            placeholder="Enter the text you want the designed voice to speak for the preview..."
          />
        </div>
      </main>

      {/* Audio Player Footer */}
      <AudioPlayerFooter 
        audioUrl={generatedAudio} 
        voice="Custom Designed Voice"
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
      />
    </div>
  );
}
