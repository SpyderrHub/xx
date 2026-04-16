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
  Settings2,
  Library,
  CalendarDays,
  Clock
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useFirebase, useDoc, useMemoFirebase, errorEmitter, FirestorePermissionError, type SecurityRuleContext } from '@/firebase';
import { doc, collection, runTransaction } from 'firebase/firestore';
import Link from 'next/link';

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
        className="w-full min-h-[200px] p-6 text-[18px] text-left leading-relaxed outline-none bg-white/[0.02] border border-white/5 rounded-[2rem] placeholder:text-muted-foreground/20 font-medium text-white/90 selection:bg-primary/30 resize-none focus:ring-1 focus:ring-primary/20 transition-all shadow-inner"
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

  const handleSaveToLibrary = () => {
    toast({
      title: "Voice Saved",
      description: "This designed voice has been added to your library.",
    });
  };

  if (!audioUrl) return null;

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-white/10 p-4 md:p-6"
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
            <p className="text-xs md:text-sm font-black text-white truncate max-w-[180px]">Designed Voice Preview</p>
            <p className="text-[8px] md:text-[10px] text-muted-foreground uppercase tracking-widest font-black">Synthetic Neural Generation</p>
          </div>

          <div className="ml-auto flex items-center gap-2 md:hidden">
             <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-white/10 bg-white/5" asChild>
                <a href={audioUrl} download="quantisai-designed-voice.mp3">
                  <Download className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-white/10 bg-white/5" onClick={handleSaveToLibrary}>
                <Library className="h-4 w-4" />
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
            <a href={audioUrl} download="quantisai-designed-voice.mp3" title="Download Audio">
              <Download className="h-5 w-5" />
            </a>
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-12 w-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10" 
            title="Save to Library"
            onClick={handleSaveToLibrary}
          >
            <Library className="h-5 w-5" />
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

export default function VoiceDesignerPage() {
  const { user, firestore } = useFirebase();
  const [prompt, setPrompt] = useState('');
  const [referenceText, setReferenceText] = useState('This is how my new designed voice sounds. You can customize my tone and style using the prompt above.');
  const [isDesigning, setIsDesigning] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [settings, setSettings] = useState({
    stability: 75,
    clarity: 85
  });

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData } = useDoc(userDocRef);

  // Dynamic daily quota based on plan
  const dailyLimit = userData?.plan === 'starter' ? 10 : 20;

  // Daily quota logic
  const todayStr = new Date().toISOString().split('T')[0];
  const dailyCount = userData?.lastVoiceDesignDate === todayStr ? (userData?.dailyVoiceDesignCount || 0) : 0;
  const remainingGenerations = Math.max(0, dailyLimit - dailyCount);

  const credits = userData?.credits || 0;
  const cost = prompt.length;

  const handleGenerate = async () => {
    if (!prompt || !referenceText || isDesigning || !user || !firestore) return;
    
    // 1. Check daily limit
    if (remainingGenerations <= 0) {
      toast({
        title: "Daily Limit Reached",
        description: `You have used your ${dailyLimit} free designs for today. Please try again tomorrow.`,
        variant: "destructive"
      });
      return;
    }

    // 2. Check credits
    if (credits < cost) {
      toast({
        title: "Insufficient Credits",
        description: `This prompt requires ${cost.toLocaleString()} credits. Please upgrade your plan.`,
        variant: "destructive"
      });
      return;
    }

    setIsDesigning(true);
    setGeneratedAudio(null);

    try {
      // 1. Mock Design Logic (Simulated neural processing)
      const audioUrl = await new Promise<string>((resolve) => {
        setTimeout(() => resolve('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'), 2500);
      });

      // 2. Atomic Transaction for quota, credit deduction, and history
      await runTransaction(firestore, async (transaction) => {
        const uRef = doc(firestore, 'users', user.uid);
        const uSnap = await transaction.get(uRef);
        
        if (!uSnap.exists()) throw new Error("User record not found");
        
        const data = uSnap.data();
        const dbCredits = data.credits || 0;
        const dbLastDate = data.lastVoiceDesignDate || '';
        const dbDailyCount = dbLastDate === todayStr ? (data.dailyVoiceDesignCount || 0) : 0;
        const dbPlan = data.plan || 'free';
        const dbLimit = dbPlan === 'starter' ? 10 : 20;

        // Verify limits again in transaction
        if (dbCredits < cost) throw new Error("Insufficient credits");
        if (dbDailyCount >= dbLimit) throw new Error("Daily limit reached");

        // Update User Doc
        transaction.update(uRef, {
          credits: dbCredits - cost,
          dailyVoiceDesignCount: dbDailyCount + 1,
          lastVoiceDesignDate: todayStr,
          lastVoiceDesignedAt: new Date().toISOString()
        });

        // Add to history
        const historyRef = doc(collection(firestore, 'users', user.uid, 'generations'));
        transaction.set(historyRef, {
          text: prompt.substring(0, 150) + (prompt.length > 150 ? '...' : ''),
          fullText: prompt,
          voiceId: 'voice-designer-v2',
          voiceName: 'Designed Voice',
          characters: cost,
          audioUrl: audioUrl,
          createdAt: new Date().toISOString(),
          settings: settings
        });
      }).catch(async (serverError) => {
        if (serverError.code === 'permission-denied') {
          const permissionError = new FirestorePermissionError({
            path: `users/${user.uid}/generations`,
            operation: 'write',
            requestResourceData: { text: prompt.substring(0, 50), cost },
          } satisfies SecurityRuleContext);
          errorEmitter.emit('permission-error', permissionError);
        }
        throw serverError;
      });

      setGeneratedAudio(audioUrl);
      toast({
        title: "Voice Designed",
        description: "Your unique custom voice is ready to preview.",
      });
    } catch (error: any) {
      console.error('Voice Design failed:', error);
      toast({
        title: "Design Error",
        description: error.message || "Failed to design voice profile.",
        variant: "destructive"
      });
    } finally {
      setIsDesigning(false);
    }
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Top Studio Header */}
      <div className="sticky top-16 z-40 glass-card border-b border-white/5 py-4 mb-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white">Voice Designer</h2>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Neural Engine v2.0</p>
            </div>
          </div>

          <div className="flex-1 max-w-md hidden lg:flex items-center gap-8 px-8">
            <div className="flex-1 space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground">
                <Label>Stability</Label>
                <span>{settings.stability}%</span>
              </div>
              <Slider value={[settings.stability]} onValueChange={(v) => setSettings({...settings, stability: v[0]})} className="h-4" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground">
                <Label>Clarity</Label>
                <span>{settings.clarity}%</span>
              </div>
              <Slider value={[settings.clarity]} onValueChange={(v) => setSettings({...settings, clarity: v[0]})} className="h-4" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <div className="flex items-center gap-1.5 text-primary">
                <CalendarDays className="h-3 w-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">Daily Quota</span>
              </div>
              <p className="text-xs font-bold text-white">{remainingGenerations} / {dailyLimit} Left</p>
            </div>

            <Button 
              onClick={handleGenerate}
              disabled={isDesigning || !prompt || !referenceText || remainingGenerations <= 0}
              className="h-12 px-6 md:px-8 rounded-xl bg-primary btn-glow font-black text-sm"
            >
              {isDesigning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4 fill-current" />}
              {isDesigning ? 'Designing...' : 'Generate Voice'}
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 max-w-5xl space-y-12 pt-8">
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
            label="Reference Text"
            value={referenceText}
            onChange={setReferenceText}
            maxLength={MAX_PREVIEW_CHARS}
            placeholder="Enter the text you want the designed voice to speak for the preview..."
          />
        </div>

        {/* Informational Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12">
          {[
            { title: "Daily Limit", desc: `${dailyLimit} designs per day.`, icon: Clock },
            { title: "Neural Synthesis", desc: "Expressive vocal range.", icon: Volume2 },
            { title: "Library Sync", desc: "Save clones to library.", icon: Library },
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
        voice="Custom Designed Voice"
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
      />
    </div>
  );
}