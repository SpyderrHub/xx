
'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  Zap, 
  Download, 
  Mic2, 
  Play, 
  Pause,
  Sparkles,
  Share2,
  Library
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useFirebase, useCollection, useMemoFirebase, useDoc, errorEmitter } from '@/firebase';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { toast } from '@/hooks/use-toast';
import { collection, query, doc, runTransaction } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { WeavyPattern } from '@/components/author/avatar-upload';

const MAX_CHARACTERS = 2000;

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

  // Sync state with HTML Audio Element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => onTogglePlay(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, onTogglePlay]);

  // Handle source changes and metadata
  useEffect(() => {
    const audio = audioRef.current;
    if (audioUrl && audio) {
      audio.src = audioUrl;
      audio.load();
      setProgress(0);
      setDuration(0);
      
      const handleMetadata = () => {
        if (audio.duration && audio.duration !== Infinity) {
          setDuration(audio.duration);
        }
      };
      
      const handleTime = () => setProgress((audio.currentTime / (audio.duration || 1)) * 100);
      const handleEnded = () => onTogglePlay(false);

      audio.addEventListener('loadedmetadata', handleMetadata);
      audio.addEventListener('timeupdate', handleTime);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('loadedmetadata', handleMetadata);
        audio.removeEventListener('timeupdate', handleTime);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [audioUrl, onTogglePlay]);

  const handleShare = async () => {
    if (!audioUrl) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'QuantisAI Generation',
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
            onClick={() => onTogglePlay(!isPlaying)}
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
                <a href={audioUrl} download={`quantisai_${Date.now()}.wav`} target="_blank" rel="noopener noreferrer">
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
          <span className="text-[10px] font-mono text-muted-foreground">{duration ? Math.floor(duration) : 0}s</span>
        </div>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10" asChild>
            <a href={audioUrl} download={`quantisai_${Date.now()}.wav`} title="Download Audio" target="_blank" rel="noopener noreferrer">
              <Download className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10" onClick={handleShare} title="Share link">
            <Share2 className="h-4 w-4" />
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

export default function TextToSpeechPage() {
  const { user, firestore } = useFirebase();
  const [text, setText] = useState('');
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<{url: string, voice: string, characters: number} | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData } = useDoc(userDocRef);

  const myVoicesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'myVoices');
  }, [user, firestore]);

  const { data: myVoicesDocs, isLoading: isMyVoicesLoading } = useCollection(myVoicesQuery);

  const allVoicesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'voices');
  }, [firestore]);

  const { data: allVoices, isLoading: isAllVoicesLoading } = useCollection(allVoicesQuery);

  const userVoices = useMemo(() => {
    if (!allVoices || !myVoicesDocs) return [];
    const myIds = new Set(myVoicesDocs.map(d => d.id));
    return allVoices.filter(v => myIds.has(v.id));
  }, [allVoices, myVoicesDocs]);

  useEffect(() => {
    if (userVoices.length > 0 && !selectedVoiceId) {
      setSelectedVoiceId(userVoices[0].id);
    }
  }, [userVoices, selectedVoiceId]);

  const selectedVoice = userVoices.find(v => v.id === selectedVoiceId);

  const handleGenerate = async () => {
    if (!text || isGenerating || !selectedVoiceId || !user || !firestore || !selectedVoice) return;

    const charCount = text.length;
    const currentCredits = userData?.credits || 0;

    if (currentCredits < charCount) {
      toast({
        title: "Insufficient Credits",
        description: "Please upgrade your plan to continue generating speech.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedAudio(null);
    setIsPlaying(false);

    try {
      const token = await user.getIdToken();
      
      const response = await fetch('/api/tts', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          text: text,
          reference_audio: selectedVoice.audioUrl,
          reference_text: selectedVoice.referenceText || ""
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Synthesis engine error');
      }

      // Priority parsing for engine response
      const audioUrl = data.audio_download_url || data.audio_url || data.url;
      
      if (!audioUrl) {
        throw new Error("No audio URL was returned by the synthesis engine.");
      }

      await runTransaction(firestore, async (transaction) => {
        const uRef = doc(firestore, 'users', user.uid);
        const uSnap = await transaction.get(uRef);
        
        if (!uSnap.exists()) throw new Error("User record not found");
        
        const dbCredits = uSnap.data().credits || 0;
        if (dbCredits < charCount) throw new Error("Insufficient credits");

        transaction.update(uRef, {
          credits: dbCredits - charCount,
          lastGeneratedAt: new Date().toISOString()
        });

        const historyRef = doc(collection(firestore, 'users', user.uid, 'generations'));
        transaction.set(historyRef, {
          text: text.substring(0, 150) + (text.length > 150 ? '...' : ''),
          fullText: text,
          voiceId: selectedVoiceId,
          voiceName: selectedVoice?.voiceName || 'Unknown',
          characters: charCount,
          audioUrl: audioUrl,
          createdAt: new Date().toISOString(),
          settings: {}
        });
      }).catch(async (serverError) => {
        if (serverError.code === 'permission-denied') {
          const permissionError = new FirestorePermissionError({
            path: `users/${user.uid}/generations`,
            operation: 'write',
            requestResourceData: { 
              text: text.substring(0, 150),
              voiceId: selectedVoiceId,
              characters: charCount
            },
          } satisfies SecurityRuleContext);
          errorEmitter.emit('permission-error', permissionError);
        }
        throw serverError;
      });

      setGeneratedAudio({
        url: audioUrl,
        voice: selectedVoice?.voiceName || 'Selected Voice',
        characters: charCount
      });

      toast({ title: "Synthesis Complete", description: "Audio ready for review." });
    } catch (e: any) {
      toast({ 
        title: "Generation Error", 
        description: e.message || "Failed to process speech synthesis.", 
        variant: "destructive" 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const isLoading = isMyVoicesLoading || isAllVoicesLoading;

  return (
    <div className="flex flex-col min-h-[calc(100dvh-theme(spacing.16))] pb-32">
      {/* Studio Header - Mobile Responsive Single Row */}
      <div className="shrink-0 z-40 glass-card border border-white/5 py-3 px-3 md:py-4 md:px-10 flex flex-row items-center justify-between gap-2 sm:gap-6 mt-4 md:mt-6 mx-4 md:mx-6 rounded-2xl text-[0.9em]">
        <div className="flex items-center gap-2 sm:gap-4 w-auto">
          <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
            <Mic2 className="h-4 w-4 md:h-5 md:w-5" />
          </div>
          <div className="block">
            <h2 className="text-[10px] md:text-sm font-black text-white uppercase tracking-wider leading-tight">Studio</h2>
            <p className="text-[7px] md:text-[10px] text-muted-foreground uppercase tracking-widest font-black hidden sm:block">Synthesis v2.1</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 md:gap-3 w-auto ml-auto">
          <div className="text-right hidden xl:block mr-2">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">{text.length} / {MAX_CHARACTERS}</p>
          </div>

          <Select value={selectedVoiceId || ''} onValueChange={setSelectedVoiceId} disabled={userVoices.length === 0}>
            <SelectTrigger className="w-[80px] sm:w-[130px] md:w-[200px] h-9 md:h-12 rounded-lg md:rounded-xl bg-white/5 border-white/10 text-[9px] md:text-xs font-bold focus:ring-0 px-2">
              <SelectValue placeholder={isLoading ? "..." : userVoices.length === 0 ? "Empty" : "Speaker"} />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-white/10 bg-black/95 backdrop-blur-xl">
              {userVoices.map((v) => {
                const isGradient = v.avatarUrl?.startsWith('weavy:');
                const gradientIndex = isGradient ? parseInt(v.avatarUrl.split(':')[1]) : 0;
                
                return (
                  <SelectItem key={v.id} value={v.id} className="cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-6 w-6 ring-1 ring-white/10 shrink-0">
                        {isGradient ? (
                          <WeavyPattern presetIndex={gradientIndex} />
                        ) : (
                          <AvatarImage src={v.avatarUrl} className="object-cover" />
                        )}
                        <AvatarFallback className="text-[8px] bg-primary/10">{v.voiceName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="text-left min-w-0">
                        <p className="text-xs font-bold truncate">{v.voiceName}</p>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Button 
            onClick={handleGenerate}
            disabled={isGenerating || !text || !selectedVoiceId || userVoices.length === 0}
            className="h-9 md:h-12 px-3 md:px-8 rounded-lg md:rounded-xl bg-primary btn-glow font-black text-[10px] md:text-sm"
          >
            {isGenerating ? <Loader2 className="h-3 w-3 md:mr-2 md:h-4 md:w-4 animate-spin" /> : <Zap className="h-3 w-3 md:mr-2 md:h-4 md:w-4 fill-current" />}
            <span className="hidden sm:inline">{isGenerating ? 'Synthesizing...' : 'Generate Audio'}</span>
            <span className="sm:hidden">{isGenerating ? '' : 'Go'}</span>
          </Button>
        </div>
      </div>

      <main className="flex-1 flex flex-col container mx-auto px-4 md:px-6 pt-12">
        {userVoices.length === 0 && !isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
            <div className="h-20 w-20 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center">
              <Library className="h-8 w-8 text-primary/40" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Your Voice Library is Empty</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                Add voices from the library to start generating ultra-realistic speech.
              </p>
            </div>
            <Button asChild className="rounded-xl bg-white text-black hover:bg-white/90 font-bold h-12 px-8">
              <Link href="/dashboard/voice-library">Browse Voice Library</Link>
            </Button>
          </div>
        ) : (
          <StudioEditor value={text} onChange={setText} maxLength={MAX_CHARACTERS} />
        )}
      </main>

      <AudioPlayerFooter 
        audioUrl={generatedAudio?.url} 
        voice={generatedAudio?.voice} 
        characters={generatedAudio?.characters} 
        isPlaying={isPlaying}
        onTogglePlay={setIsPlaying}
      />
    </div>
  );
}
