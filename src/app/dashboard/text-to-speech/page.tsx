'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
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
  Waves, 
  Play, 
  Pause,
  Clock,
  Sparkles,
  Share2
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { toast } from '@/hooks/use-toast';
import { collection, query, getDocs } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const MAX_CHARACTERS = 5000;

const StudioEditor = ({ value, onChange, maxLength }: { value: string, onChange: (val: string) => void, maxLength: number }) => {
  return (
    <div className="relative w-full max-w-4xl mx-auto flex-1 flex flex-col">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        dir="ltr"
        placeholder='What should I say? Try "[laughs] Welcome to the future..."'
        className="w-full flex-1 min-h-[300px] md:min-h-[500px] p-0 text-[18px] text-left leading-relaxed outline-none whitespace-pre-wrap bg-transparent placeholder:text-muted-foreground/20 font-medium text-white/90 selection:bg-primary/30 border-none resize-none focus:ring-0 scrollbar-hide"
        style={{ fontFamily: "'Inter', sans-serif" }}
      />
    </div>
  );
};

const AudioPlayerFooter = ({ audioUrl, voice, characters, isPlaying, onTogglePlay }: any) => {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.onloadedmetadata = () => setDuration(audioRef.current?.duration || 0);
      audioRef.current.ontimeupdate = () => setProgress((audioRef.current?.currentTime || 0) / (audioRef.current?.duration || 1) * 100);
    }
  }, [audioUrl]);

  const handleShare = async () => {
    if (!audioUrl) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Saanchi AI Generation',
          text: `Check out this AI-generated voice: ${voice}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({ title: "Link Copied", description: "Share link copied to clipboard." });
      }
    } catch (err) {
      console.error('Sharing failed', err);
    }
  };

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
          <div className="flex flex-col">
            <p className="text-xs md:text-sm font-black text-white truncate max-w-[120px]">{voice}</p>
            <p className="text-[8px] md:text-[10px] text-muted-foreground uppercase tracking-widest font-black">{characters} Characters</p>
          </div>
          <div className="ml-auto flex items-center gap-2 md:hidden">
             <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-white/10 bg-white/5" asChild>
                <a href={audioUrl} download="saanchi-ai-generation.mp3">
                  <Download className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-white/10 bg-white/5" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
          </div>
        </div>

        <div className="flex-1 flex items-center gap-3 md:gap-4 w-full">
          <span className="text-[10px] font-mono text-muted-foreground">0:00</span>
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden relative">
            <motion.div className="absolute h-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">{Math.floor(duration)}s</span>
        </div>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10" asChild>
            <a href={audioUrl} download="saanchi-ai-generation.mp3" title="Download Audio">
              <Download className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10" onClick={handleShare} title="Share link">
            <Share2 className="h-5 w-5" />
          </Button>
          <Button className="h-12 w-12 rounded-xl bg-white/10 hover:bg-white/20">
            <Sparkles className="h-5 w-5 text-primary" />
          </Button>
        </div>
      </div>
      <audio ref={audioRef} src={audioUrl} />
    </motion.div>
  );
};

export default function TextToSpeechPage() {
  const [text, setText] = useState('');
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<{url: string, voice: string, characters: number} | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [settings, setParams] = useState({ stability: 75, clarity: 85, speed: 1.0 });

  const { firestore } = useFirebase();
  const [voices, setVoices] = useState<any[]>([]);

  useEffect(() => {
    const fetchVoices = async () => {
      if (!firestore) return;
      const q = query(collection(firestore, 'voices'));
      const snap = await getDocs(q);
      const results: any[] = [];
      snap.forEach(d => results.push({ id: d.id, ...d.data() }));
      setVoices(results);
      if (results.length > 0) setSelectedVoiceId(results[0].id);
    };
    fetchVoices();
  }, [firestore]);

  const selectedVoice = voices.find(v => v.id === selectedVoiceId);

  const handleGenerate = async () => {
    if (!text || isGenerating || !selectedVoiceId) return;
    setIsGenerating(true);
    setGeneratedAudio(null);

    try {
      // Mock synthesis logic - Replace with actual API call if backend is ready
      setTimeout(() => {
        setGeneratedAudio({
          url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          voice: selectedVoice.voiceName,
          characters: text.length
        });
        setIsGenerating(false);
        toast({ title: "Synthesis Complete", description: "Audio ready for review." });
      }, 2000);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100dvh-theme(spacing.16))] pb-32">
      {/* Top Studio Controls */}
      <div className="sticky top-16 z-40 glass-card border-b border-white/5 py-3 md:py-4 mb-6 md:mb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-3 md:gap-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
              <Mic2 className="h-4 w-4 md:h-5 md:w-5" />
            </div>
            <div className="hidden sm:block">
              <h2 className="text-xs md:text-sm font-black text-white">Studio Workspace</h2>
              <p className="text-[8px] md:text-[10px] text-muted-foreground uppercase tracking-widest font-black">v2.0</p>
            </div>
          </div>

          <div className="flex-1 max-w-md hidden lg:flex items-center gap-8 px-8">
            <div className="flex-1 space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground">
                <Label>Speed</Label>
                <span>{settings.speed}x</span>
              </div>
              <Slider value={[settings.speed * 100]} min={50} max={200} onValueChange={(v) => setParams({...settings, speed: v[0]/100})} className="h-4" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground">
                <Label>Tone</Label>
                <span>{settings.stability}%</span>
              </div>
              <Slider value={[settings.stability]} onValueChange={(v) => setParams({...settings, stability: v[0]})} className="h-4" />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 ml-auto">
            <div className="text-right hidden xl:block mr-2">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">{text.length} / {MAX_CHARACTERS}</p>
            </div>

            <Select value={selectedVoiceId || ''} onValueChange={setSelectedVoiceId}>
              <SelectTrigger className="w-[130px] md:w-[200px] h-10 md:h-12 rounded-xl bg-white/5 border-white/10 text-[10px] md:text-xs font-bold focus:ring-0">
                <SelectValue placeholder="Speaker" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-white/10 bg-black/95 backdrop-blur-xl">
                {voices.map((v) => (
                  <SelectItem key={v.id} value={v.id} className="cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-6 w-6 ring-1 ring-white/10 shrink-0">
                        <AvatarImage src={v.avatarUrl} className="object-cover" />
                        <AvatarFallback className="text-[8px] bg-primary/10">{v.voiceName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="text-left min-w-0">
                        <p className="text-xs font-bold truncate">{v.voiceName}</p>
                        <p className="text-[8px] text-muted-foreground uppercase font-black">{v.language}</p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !text || !selectedVoiceId}
              className="h-10 md:h-12 px-4 md:px-8 rounded-xl bg-primary btn-glow font-black text-xs md:text-sm"
            >
              {isGenerating ? <Loader2 className="md:mr-2 h-4 w-4 animate-spin" /> : <Zap className="md:mr-2 h-4 w-4 fill-current" />}
              <span className="hidden md:inline">{isGenerating ? 'Synthesizing...' : 'Generate'}</span>
              <span className="md:hidden">{isGenerating ? '' : 'Go'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Studio Editor */}
      <main className="flex-1 flex flex-col container mx-auto px-4 md:px-6">
        <StudioEditor value={text} onChange={setText} maxLength={MAX_CHARACTERS} />
      </main>

      {/* Audio Player Footer */}
      <AudioPlayerFooter 
        audioUrl={generatedAudio?.url} 
        voice={generatedAudio?.voice} 
        characters={generatedAudio?.characters} 
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
      />
    </div>
  );
}
