'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import TextInputCard from '@/components/tts/text-input-card';
import VoiceSelectionCard from '@/components/tts/voice-selection-card';
import AudioOutputCard from '@/components/tts/audio-output-card';
import { Button } from '@/components/ui/button';
import { Loader2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { getAuth } from 'firebase/auth';
import { toast } from '@/hooks/use-toast';
import { collection, query, where, getDocs } from 'firebase/firestore';

const MAX_CHARACTERS = 4000;

interface GeneratedAudio {
  url: string;
  voice: string;
  duration: number;
  characters: number;
}

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


export default function TextToSpeechPage() {
  const [text, setText] = useState(
    'Welcome to Saanchi AI, where your words come to life with the most advanced and expressive AI voices.'
  );

  // States for voice selection and settings
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);
  const [stability, setStability] = useState(75);
  const [clarity, setClarity] = useState(80);
  const [pitch, setPitch] = useState(50);

  // States for generation process
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<GeneratedAudio | null>(
    null
  );

  // Data fetching states
  const { user, firestore } = useFirebase();
  const [detailedVoices, setDetailedVoices] = useState<any[]>([]);
  const [voicesLoading, setVoicesLoading] = useState(true);

  // 1. Fetch user's voice IDs from their subcollection
  const myVoicesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'users', user.uid, 'myVoices'));
  }, [user, firestore]);
  const { data: myVoicesList } = useCollection(myVoicesQuery);

  // 2. Fetch full voice details based on the IDs
  useEffect(() => {
    const fetchVoiceDetails = async () => {
      if (!myVoicesList || !firestore) {
        setDetailedVoices([]);
        setVoicesLoading(false);
        return;
      }
      if (myVoicesList.length === 0) {
        setDetailedVoices([]);
        setVoicesLoading(false);
        return;
      }

      setVoicesLoading(true);
      try {
        const voiceIds = myVoicesList.map((v) => v.id);

        const chunks = [];
        for (let i = 0; i < voiceIds.length; i += 10) {
          chunks.push(voiceIds.slice(i, i + 10));
        }

        const results: any[] = [];
        for (const chunk of chunks) {
          if (chunk.length === 0) continue;
          const q = query(
            collection(firestore, 'voices'),
            where('__name__', 'in', chunk)
          );
          const snapshot = await getDocs(q);
          snapshot.forEach((doc) =>
            results.push({ id: doc.id, ...doc.data() })
          );
        }
        setDetailedVoices(results);

        // Auto-select first voice if none is selected
        if (!selectedVoiceId && results.length > 0) {
          setSelectedVoiceId(results[0].id);
        }
      } catch (error) {
        console.error('Error fetching voice details:', error);
        toast({
          title: 'Error',
          description: 'Could not fetch your voice library.',
          variant: 'destructive',
        });
      } finally {
        setVoicesLoading(false);
      }
    };

    fetchVoiceDetails();
  }, [myVoicesList, firestore, selectedVoiceId]);

  const characterCount = useMemo(() => text.length, [text]);
  const canGenerate =
    characterCount > 0 && characterCount <= MAX_CHARACTERS && !!selectedVoiceId;

  // Function to map language names to language codes
  const getLanguageCode = (languageName: string = '') => {
    const lowerLang = languageName.toLowerCase();
    if (lowerLang.includes('hindi')) return 'hi';
    if (lowerLang.includes('english')) return 'en';
    return 'en'; // Default to English
  };

  const handleGenerate = useCallback(async () => {
    if (!canGenerate || isGenerating || !selectedVoiceId) return;

    const selectedVoiceObject = detailedVoices.find(
      (v) => v.id === selectedVoiceId
    );
    if (!selectedVoiceObject) {
      toast({
        title: 'No Voice Selected',
        description: 'Please select a voice from your library.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsGenerating(true);
    setGeneratedAudio(null);

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        toast({
          title: 'Login Required',
          description: 'You must be logged in to generate audio.',
          variant: 'destructive',
        });
        setIsGenerating(false);
        return;
      }
      const token = await user.getIdToken();

      const audioPath = getStoragePathFromUrl(selectedVoiceObject.audioUrl);
      if (!audioPath) {
        throw new Error('Failed to parse audio path from URL.');
      }

      const requestBody = {
        text: text,
        audio_prompt_path: audioPath,
        language_id: getLanguageCode(selectedVoiceObject.language),
      };

      // Use the environment variable for the API URL, falling back to the default if not provided
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://58.224.7.137:45153/v1/text-to-speech';

      const res = await fetch(
        apiUrl,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: res.statusText }));
        throw new Error(errorData.detail || `API Error: ${res.status}`);
      }

      const data = await res.json();

      if (data.audio_url) {
        setGeneratedAudio({
          url: data.audio_url,
          voice: selectedVoiceObject.voiceName,
          duration: 0, // Will be updated by the audio player
          characters: characterCount,
        });
      } else {
        throw new Error('Invalid response from API, audio_url not found.');
      }
    } catch (error: any) {
      console.error('TTS Generation Error:', error);
      toast({
        title: 'Generation Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  }, [
    canGenerate,
    isGenerating,
    text,
    selectedVoiceId,
    detailedVoices,
    characterCount,
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault();
        handleGenerate();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleGenerate]);

  const handleAudioMetadata = (duration: number) => {
    if (generatedAudio) {
      setGeneratedAudio((prev) => (prev ? { ...prev, duration } : null));
    }
  };

  return (
    <div className="flex h-full flex-col space-y-4">
      <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
        <div className="flex min-h-[300px] flex-col lg:min-h-0">
          <TextInputCard
            text={text}
            setText={setText}
            characterCount={characterCount}
            maxCharacters={MAX_CHARACTERS}
          />
        </div>
        <div className="flex min-h-[300px] flex-col lg:min-h-0">
          <VoiceSelectionCard
            voices={detailedVoices}
            isLoading={voicesLoading}
            selectedVoice={selectedVoiceId}
            setSelectedVoice={setSelectedVoiceId}
            stability={stability}
            setStability={setStability}
            clarity={clarity}
            setClarity={setClarity}
            pitch={pitch}
            setPitch={setPitch}
          />
        </div>
      </div>

      <div className="shrink-0">
        <AnimatePresence>
          {generatedAudio && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="mb-4"
            >
              <AudioOutputCard
                key={generatedAudio.url}
                audioUrl={generatedAudio.url}
                voice={generatedAudio.voice}
                duration={generatedAudio.duration}
                characters={generatedAudio.characters}
                onMetadataLoaded={handleAudioMetadata}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4 shadow-2xl backdrop-blur-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <p>Characters: {characterCount} / 4000</p>
              <p>Credits: ...</p>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                className="h-14 rounded-xl px-10 text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                onClick={handleGenerate}
                disabled={!canGenerate || isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="mr-2 animate-spin" />
                ) : (
                  <Zap className="mr-2" />
                )}
                Generate
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
