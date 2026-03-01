'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  Zap, 
  Download, 
  Play, 
  User, 
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { getAuth } from 'firebase/auth';
import { toast } from '@/hooks/use-toast';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import AudioOutputCard from '@/components/tts/audio-output-card';

const MAX_CHARACTERS = 4000;

// Helper to extract storage path from a Firebase Storage URL
const getStoragePathFromUrl = (url: string): string | null => {
  if (!url) return null;
  try {
    const urlObject = new URL(url);
    const pathParts = urlObject.pathname.split('/o/');
    if (pathParts.length > 1) {
      const encodedPath = pathParts[1];
      return decodeURIComponent(encodedPath);
    }
  } catch (e) {
    console.error('Could not parse storage URL:', e);
  }
  return null;
};

// Component for the tag-supporting text area
const ModernTextEditor = ({ value, onChange, maxLength }: { value: string, onChange: (val: string) => void, maxLength: number }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.innerText;
    if (text.length <= maxLength) {
      onChange(text);
    } else {
      // Prevent overflow
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
        className="w-full min-h-[320px] p-0 text-xl md:text-2xl leading-relaxed outline-none whitespace-pre-wrap bg-transparent placeholder:text-muted-foreground/50 font-medium text-white/90"
        data-placeholder="Type or paste your text here..."
      />
      {value.length === 0 && (
        <div className="absolute top-0 left-0 pointer-events-none text-muted-foreground/30 text-xl md:text-2xl italic font-medium">
          What would you like to say? Try adding [laughs softly]...
        </div>
      )}
    </div>
  );
};

export default function TextToSpeechPage() {
  const [text, setText] = useState('Experience the power of Saanchi AI voices. Simply type your text and choose a speaker to begin.');
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<{url: string, voice: string, duration: number, characters: number} | null>(null);

  const { user, firestore } = useFirebase();
  const [detailedVoices, setDetailedVoices] = useState<any[]>([]);
  const [voicesLoading, setVoicesLoading] = useState(true);

  // 1. Fetch user's voice IDs
  const myVoicesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'users', user.uid, 'myVoices'));
  }, [user, firestore]);
  const { data: myVoicesList } = useCollection(myVoicesQuery);

  // 2. Fetch full details
  useEffect(() => {
    const fetchVoiceDetails = async () => {
      if (!myVoicesList || !firestore || myVoicesList.length === 0) {
        setDetailedVoices([]);
        setVoicesLoading(false);
        return;
      }

      setVoicesLoading(true);
      try {
        const voiceIds = myVoicesList.map((v) => v.id);
        const q = query(collection(firestore, 'voices'), where('__name__', 'in', voiceIds));
        const snapshot = await getDocs(q);
        const results: any[] = [];
        snapshot.forEach((doc) => results.push({ id: doc.id, ...doc.data() }));
        setDetailedVoices(results);
        if (!selectedVoiceId && results.length > 0) setSelectedVoiceId(results[0].id);
      } catch (error) {
        console.error(error);
      } finally {
        setVoicesLoading(false);
      }
    };
    fetchVoiceDetails();
  }, [myVoicesList, firestore]);

  const selectedVoiceObject = useMemo(() => 
    detailedVoices.find(v => v.id === selectedVoiceId), 
  [detailedVoices, selectedVoiceId]);

  const characterCount = text.length;
  const canGenerate = characterCount > 0 && characterCount <= MAX_CHARACTERS && !!selectedVoiceId;

  const handleGenerate = useCallback(async () => {
    if (!canGenerate || isGenerating || !selectedVoiceId || !selectedVoiceObject) return;
    
    setIsGenerating(true);
    setGeneratedAudio(null);

    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('Login required');
      
      const token = await currentUser.getIdToken();
      const audioPath = getStoragePathFromUrl(selectedVoiceObject.audioUrl);
      if (!audioPath) throw new Error('Invalid voice path');

      const requestBody = {
        text: text,
        audio_prompt_path: audioPath,
        language_id: selectedVoiceObject.language?.toLowerCase().includes('hindi') ? 'hi' : 'en',
      };

      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://58.224.7.137:45153/v1/text-to-speech').replace(/\/$/, '') + '/';

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) throw new Error('API Error');
      const data = await res.json();

      if (data.audio_url) {
        setGeneratedAudio({
          url: data.audio_url,
          voice: selectedVoiceObject.voiceName,
          duration: 0,
          characters: characterCount,
        });
        toast({ title: 'Success', description: 'Audio generated successfully!' });
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  }, [canGenerate, isGenerating, text, selectedVoiceId, selectedVoiceObject, characterCount]);

  return (
    <div className="max-w-[950px] mx-auto space-y-10 pb-20 px-4 md:px-0">
      {/* Main SaaS Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/40 backdrop-blur-[40px] border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden ring-1 ring-white/10"
      >
        {/* Top Action Bar */}
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-4">
            {/* Simple static profile section without dropdown */}
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 shadow-lg">
              <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                <AvatarImage src={selectedVoiceObject?.avatarUrl} className="object-cover" />
                <AvatarFallback className="bg-primary/10"><User className="h-5 w-5 text-primary" /></AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-bold leading-tight">
                  {selectedVoiceObject?.voiceName || 'Select Voice'}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">
                  {selectedVoiceObject?.language || 'Studio Voice'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="rounded-full h-12 px-6 border-white/10 bg-white/5 hover:bg-white/10 hidden sm:flex font-bold"
              disabled={!generatedAudio}
              asChild={!!generatedAudio}
            >
              {generatedAudio ? (
                <a 
                  href={generatedAudio.url} 
                  download={`${generatedAudio.voice}.wav`}
                  className="flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4 shrink-0" /> <span className="inline-block">Download</span>
                </a>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Download className="h-4 w-4 shrink-0" /> <span className="inline-block">Download</span>
                </span>
              )}
            </Button>
            <Button 
              onClick={handleGenerate}
              disabled={!canGenerate || isGenerating}
              className="rounded-full h-12 px-10 bg-primary hover:bg-primary/90 font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              {isGenerating ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Play className="mr-2 h-5 w-5 fill-current" />
              )}
              {isGenerating ? 'Generating...' : 'Play'}
            </Button>
          </div>
        </div>

        {/* Text Input Area */}
        <div className="p-10 md:p-14 space-y-8">
          <ModernTextEditor 
            value={text} 
            onChange={setText} 
            maxLength={MAX_CHARACTERS} 
          />
          <div className="flex justify-between items-center pt-8 border-t border-white/5">
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" className="text-xs font-bold text-muted-foreground hover:text-white uppercase tracking-widest">
                <Volume2 className="h-3.5 w-3.5 mr-2 text-primary" /> Pronunciation
              </Button>
              <Button variant="ghost" size="sm" className="text-xs font-bold text-muted-foreground hover:text-white uppercase tracking-widest">
                <Zap className="h-3.5 w-3.5 mr-2 text-primary" /> Speed
              </Button>
            </div>
            <div className={cn(
              "text-xs font-mono font-black tracking-[0.2em] px-3 py-1 rounded-full bg-white/5 border border-white/5",
              characterCount >= MAX_CHARACTERS ? "text-red-500 border-red-500/20 bg-red-500/5" : "text-muted-foreground/50"
            )}>
              {characterCount.toLocaleString()} / {MAX_CHARACTERS.toLocaleString()}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Generated Audio Display */}
      <AnimatePresence>
        {generatedAudio && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="ring-1 ring-primary/20 rounded-2xl overflow-hidden"
          >
            <AudioOutputCard
              audioUrl={generatedAudio.url}
              voice={generatedAudio.voice}
              duration={generatedAudio.duration}
              characters={generatedAudio.characters}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Speaker Section (Below Main Card) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/80">Select Speaker</h3>
          </div>
          <Button variant="link" className="text-xs font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors h-auto p-0" asChild>
            <a href="/dashboard/voice-library">Browse Library</a>
          </Button>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide snap-x">
          {voicesLoading ? (
            [1, 2, 3, 4].map(i => (
              <div key={i} className="min-w-[220px] h-[75px] rounded-2xl bg-white/5 animate-pulse border border-white/5" />
            ))
          ) : detailedVoices.map((voice) => (
            <button
              key={voice.id}
              onClick={() => setSelectedVoiceId(voice.id)}
              className={cn(
                "min-w-[240px] h-[75px] flex items-center gap-4 px-5 rounded-2xl border transition-all text-left relative overflow-hidden group snap-start",
                selectedVoiceId === voice.id 
                  ? "bg-primary/10 border-primary shadow-[0_0_30px_rgba(168,85,247,0.15)] ring-1 ring-primary/20" 
                  : "bg-card/50 border-white/5 hover:border-white/20 hover:bg-white/5"
              )}
            >
              <Avatar className="h-11 w-11 border-2 border-white/10 shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                <AvatarImage src={voice.avatarUrl} className="object-cover" />
                <AvatarFallback className="bg-white/5"><User className="h-5 w-5 text-muted-foreground" /></AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "font-bold text-sm truncate transition-colors",
                  selectedVoiceId === voice.id ? "text-primary" : "text-white group-hover:text-primary/80"
                )}>
                  {voice.voiceName}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest truncate font-black mt-0.5 opacity-60">
                  {voice.style || 'Narrator'}
                </p>
              </div>
              {selectedVoiceId === voice.id && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute right-0 top-0 bottom-0 w-1.5 bg-primary shadow-[0_0_15px_rgba(168,85,247,0.5)]" 
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
