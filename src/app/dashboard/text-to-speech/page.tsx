'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  Zap, 
  Download, 
  Play, 
  ChevronDown, 
  User, 
  Settings2,
  Volume2,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { getAuth } from 'firebase/auth';
import { toast } from '@/hooks/use-toast';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
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

  // Simple tag highlighting logic: wrap [text] in a styled span
  const highlightTags = (text: string) => {
    return text.replace(/\[([^\]]+)\]/g, '<span class="text-primary font-bold bg-primary/10 px-1 rounded">[$1]</span>');
  };

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
        className="w-full min-h-[300px] p-0 text-xl leading-relaxed outline-none whitespace-pre-wrap bg-transparent placeholder:text-muted-foreground/50"
        data-placeholder="Type or paste your text here... Use tags like [laughs softly] for expression."
      />
      {value.length === 0 && (
        <div className="absolute top-0 left-0 pointer-events-none text-muted-foreground/30 text-xl italic">
          What would you like to say? Try adding [whispers softly]...
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
    <div className="max-w-[900px] mx-auto space-y-10 pb-20">
      {/* Main SaaS Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-[2rem] shadow-2xl overflow-hidden"
      >
        {/* Top Action Bar */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedVoiceObject?.avatarUrl} />
                    <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-bold leading-tight group-hover:text-primary transition-colors">
                      {selectedVoiceObject?.voiceName || 'Select Voice'}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                      {selectedVoiceObject?.language || 'Studio Voice'}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-black/90 border-white/10" align="start">
                <DropdownMenuItem className="focus:bg-primary/10 focus:text-primary">
                  <Settings2 className="mr-2 h-4 w-4" /> Voice Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-primary/10 focus:text-primary">
                  <Share2 className="mr-2 h-4 w-4" /> Share Profile
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="rounded-full h-12 px-6 border-white/10 bg-white/5 hover:bg-white/10"
              disabled={!generatedAudio}
              asChild={!!generatedAudio}
            >
              {generatedAudio ? (
                <a href={generatedAudio.url} download={`${generatedAudio.voice}.wav`}>
                  <Download className="mr-2 h-4 w-4" /> Download
                </a>
              ) : (
                <span><Download className="mr-2 h-4 w-4" /> Download</span>
              )}
            </Button>
            <Button 
              onClick={handleGenerate}
              disabled={!canGenerate || isGenerating}
              className="rounded-full h-12 px-8 bg-primary hover:bg-primary/90 font-bold text-lg shadow-lg shadow-primary/20"
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
        <div className="p-10 space-y-6">
          <ModernTextEditor 
            value={text} 
            onChange={setText} 
            maxLength={MAX_CHARACTERS} 
          />
          <div className="flex justify-between items-center pt-6 border-t border-white/5">
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-white">
                <Volume2 className="h-3 w-3 mr-1" /> Pronunciation
              </Button>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-white">
                <Zap className="h-3 w-3 mr-1" /> Speed
              </Button>
            </div>
            <div className={cn(
              "text-xs font-mono tracking-widest",
              characterCount >= MAX_CHARACTERS ? "text-red-500" : "text-muted-foreground/50"
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
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
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Select Speaker</h3>
          <Button variant="link" className="text-xs text-primary h-auto p-0" asChild>
            <a href="/dashboard/voice-library">Browse Library</a>
          </Button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {voicesLoading ? (
            [1, 2, 3, 4].map(i => (
              <div key={i} className="min-w-[220px] h-[70px] rounded-2xl bg-white/5 animate-pulse" />
            ))
          ) : detailedVoices.map((voice) => (
            <button
              key={voice.id}
              onClick={() => setSelectedVoiceId(voice.id)}
              className={cn(
                "min-w-[220px] h-[70px] flex items-center gap-3 px-4 rounded-2xl border transition-all text-left relative overflow-hidden group",
                selectedVoiceId === voice.id 
                  ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(168,85,247,0.1)]" 
                  : "bg-card/50 border-white/5 hover:border-white/20"
              )}
            >
              <Avatar className="h-10 w-10 border border-white/10 shrink-0">
                <AvatarImage src={voice.avatarUrl} className="object-cover" />
                <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "font-bold text-sm truncate",
                  selectedVoiceId === voice.id ? "text-primary" : "text-white"
                )}>
                  {voice.voiceName}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest truncate">
                  {voice.style || 'Narrator'}
                </p>
              </div>
              {selectedVoiceId === voice.id && (
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
