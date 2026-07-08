
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Loader2, 
  Zap, 
  Download, 
  Play, 
  Pause,
  Sparkles,
  Library,
  CalendarDays,
  Clock,
  Volume2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useFirebase, useDoc, useMemoFirebase, errorEmitter, FirestorePermissionError, type SecurityRuleContext } from '@/firebase';
import { doc, collection, runTransaction, getDocs, query, where, setDoc } from 'firebase/firestore';
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
        style={{ fontFamily: "var(--font-universal-sans), sans-serif" }}
      />
    </div>
  );
};

const AudioPlayerFooter = ({ audioUrl, isPlaying, onTogglePlay, onSave, isSaving }: any) => {
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => onTogglePlay(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, onTogglePlay]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audioUrl && audio) {
      audio.src = audioUrl;
      audio.load();
      setProgress(0);
      
      const handleTime = () => setProgress((audio.currentTime / (audio.duration || 1)) * 100);
      const handleEnded = () => onTogglePlay(false);

      audio.addEventListener('timeupdate', handleTime);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', handleTime);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [audioUrl, onTogglePlay]);

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
            onClick={() => onTogglePlay(!isPlaying)}
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
                <a href={audioUrl} download="quantisai-designed-voice.wav" target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4" />
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 rounded-xl border-white/10 bg-white/5" 
                onClick={onSave}
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Library className="h-4 w-4" />}
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
            <a href={audioUrl} download="quantisai-designed-voice.wav" title="Download Audio" target="_blank" rel="noopener noreferrer">
              <Download className="h-5 w-5" />
            </a>
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-12 w-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10" 
            title="Save to Library"
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Library className="h-5 w-5" />}
          </Button>
          <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>
      <audio ref={audioRef} className="hidden" />
    </motion.div>
  );
};

export default function VoiceDesignerPage() {
  const { user, firestore } = useFirebase();
  const [prompt, setPrompt] = useState('');
  const [referenceText, setReferenceText] = useState('This is how my new designed voice sounds. You can customize my tone and style using the prompt above.');
  const [isDesigning, setIsDesigning] = useState(false);
  const [isSavingToLibrary, setIsSavingToLibrary] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData } = useDoc(userDocRef);

  // Dynamic daily quota based on plan
  const dailyLimit = userData?.plan === 'starter' ? 10 : userData?.plan === 'creator' ? 20 : 30;

  // Daily quota logic
  const todayStr = new Date().toISOString().split('T')[0];
  const dailyCount = userData?.lastVoiceDesignDate === todayStr ? (userData?.dailyVoiceDesignCount || 0) : 0;
  const remainingGenerations = Math.max(0, dailyLimit - dailyCount);

  const credits = userData?.credits || 0;
  const cost = prompt.length;

  const handleGenerate = async () => {
    if (!prompt || !referenceText || isDesigning || !user || !firestore) return;
    
    if (remainingGenerations <= 0) {
      toast({
        title: "Daily Limit Reached",
        description: `You have used your ${dailyLimit} free designs for today.`,
        variant: "destructive"
      });
      return;
    }

    if (credits < cost) {
      toast({
        title: "Insufficient Credits",
        description: `This prompt requires ${cost.toLocaleString()} credits.`,
        variant: "destructive"
      });
      return;
    }

    setIsDesigning(true);
    setGeneratedAudio(null);
    setIsPlaying(false);

    try {
      const token = await user.getIdToken();
      
      const response = await fetch('/api/voice-designer', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt,
          referenceText
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Voice design engine error');

      const audioUrl = data.audio_download_url || data.audio_url || data.url;
      if (!audioUrl) throw new Error("No audio URL returned.");

      await runTransaction(firestore, async (transaction) => {
        const uRef = doc(firestore, 'users', user.uid);
        const uSnap = await transaction.get(uRef);
        if (!uSnap.exists()) throw new Error("User record not found");
        
        const dbCredits = uSnap.data().credits || 0;
        const dbLastDate = uSnap.data().lastVoiceDesignDate || '';
        const dbDailyCount = dbLastDate === todayStr ? (uSnap.data().dailyVoiceDesignCount || 0) : 0;

        if (dbCredits < cost) throw new Error("Insufficient credits");

        transaction.update(uRef, {
          credits: dbCredits - cost,
          dailyVoiceDesignCount: dbDailyCount + 1,
          lastVoiceDesignDate: todayStr,
          lastVoiceDesignedAt: new Date().toISOString()
        });

        const historyRef = doc(collection(firestore, 'users', user.uid, 'generations'));
        transaction.set(historyRef, {
          text: prompt.substring(0, 150) + (prompt.length > 150 ? '...' : ''),
          fullText: prompt,
          referenceText: referenceText,
          voiceId: 'voice-designer-v2',
          voiceName: 'Designed Voice',
          characters: cost,
          audioUrl: audioUrl,
          createdAt: new Date().toISOString(),
          settings: {}
        });
      });

      setGeneratedAudio(audioUrl);
      toast({ title: "Voice Designed", description: "Your unique custom voice is ready to preview." });
    } catch (error: any) {
      toast({ title: "Design Error", description: error.message, variant: "destructive" });
    } finally {
      setIsDesigning(false);
    }
  };

  const handleSaveToLibrary = async () => {
    if (!user || !firestore || !generatedAudio || isSavingToLibrary) return;

    setIsSavingToLibrary(true);
    try {
      // 1. Get current count for sequential naming
      const voicesRef = collection(firestore, 'voices');
      const q = query(voicesRef, where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      const voiceCount = snapshot.size;
      const customName = `custom_${voiceCount + 1}`;

      // 2. Create the voice document
      const voiceId = crypto.randomUUID();
      const voiceData = {
        id: voiceId,
        userId: user.uid,
        voiceName: customName,
        audioUrl: generatedAudio,
        description: `Designed voice from prompt: ${prompt.substring(0, 50)}...`,
        referenceText: referenceText,
        languages: ['English'],
        language: 'English',
        gender: 'Neutral',
        style: 'Custom',
        styles: ['Custom'],
        avatarUrl: `weavy:${Math.floor(Math.random() * 8)}`,
        status: 'approved',
        isPublic: false, // Ensure it's private
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(firestore, 'voices', voiceId), voiceData);

      // 3. Add to user's 'myVoices' collection for TTS access
      await setDoc(doc(firestore, 'users', user.uid, 'myVoices', voiceId), {
        voiceId,
        addedAt: new Date().toISOString()
      });

      toast({ 
        title: "Saved to Library", 
        description: `Voice saved as ${customName}. You can now use it in the Studio.` 
      });
    } catch (error: any) {
      toast({ title: "Save Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsSavingToLibrary(false);
    }
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Top Studio Header */}
      <div className="shrink-0 z-40 glass-card border border-white/5 py-3 px-3 md:py-4 md:px-10 flex flex-row items-center justify-between gap-2 sm:gap-6 mt-4 md:mt-6 mx-4 md:mx-6 rounded-full text-[0.9em]">
        <div className="flex items-center gap-2 sm:gap-4 w-auto">
          <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
            <Sparkles className="h-4 w-4 md:h-5 md:w-5" />
          </div>
          <div>
            <h2 className="text-[10px] md:text-sm font-black text-white uppercase tracking-wider leading-tight">Designer</h2>
            <p className="text-[7px] md:text-[10px] text-muted-foreground uppercase tracking-widest font-black hidden sm:block">Neural Engine v2.0</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-6 ml-auto">
          <div className="hidden xl:flex flex-col items-end">
            <div className="flex items-center gap-1.5 text-primary">
              <CalendarDays className="h-3 w-3" />
              <span className="text-[10px] font-black uppercase tracking-widest">Quota</span>
            </div>
            <p className="text-xs font-bold text-white">{remainingGenerations} Left</p>
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={isDesigning || !prompt || !referenceText || remainingGenerations <= 0}
            className="h-9 md:h-12 px-3 md:px-8 rounded-lg md:rounded-xl bg-primary btn-glow font-black text-[10px] md:text-sm"
          >
            {isDesigning ? <Loader2 className="h-3 w-3 md:mr-2 md:h-4 md:w-4 animate-spin" /> : <Zap className="h-3 w-3 md:mr-2 md:h-4 md:w-4 fill-current" />}
            <span className="hidden sm:inline">{isDesigning ? 'Designing...' : 'Generate Voice'}</span>
            <span className="sm:hidden">{isDesigning ? '' : 'Go'}</span>
          </Button>
        </div>
      </div>

      <main className="container mx-auto px-4 md:px-6 max-w-5xl space-y-12 pt-8">
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12">
          {[
            { title: "Daily Limit", desc: `${dailyLimit} designs per day.`, icon: Clock },
            { title: "Neural Synthesis", desc: "Expressive vocal range.", icon: Volume2 },
            { title: "Private Identity", desc: "Accessible only to you.", icon: Library },
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

      <AudioPlayerFooter 
        audioUrl={generatedAudio} 
        isPlaying={isPlaying}
        onTogglePlay={setIsPlaying}
        onSave={handleSaveToLibrary}
        isSaving={isSavingToLibrary}
      />
    </div>
  );
}
