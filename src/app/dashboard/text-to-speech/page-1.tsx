
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import TextInputCard from '@/components/tts/text-input-card';
import VoiceSelectionCard from '@/components/tts/voice-selection-card';
import AudioOutputCard from '@/components/tts/audio-output-card';
import { Button } from '@/components/ui/button';
import { Loader2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateSpeech } from '@/ai/flows/tts-flow';
import { toast } from '@/hooks/use-toast';
import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const MAX_CHARACTERS = 2500;

interface GeneratedAudio {
  url: string;
  voice: string;
  duration: number;
  characters: number;
}

export default function TextToSpeechPage() {
  const { user, firestore } = useFirebase();
  const [text, setText] = useState(
    'Welcome to QuantisAI, where your words come to life with the most advanced and expressive AI voices.'
  );
  const [selectedVoice, setSelectedVoice] = useState('Algenib');
  const [stability, setStability] = useState(75);
  const [clarity, setClarity] = useState(80);
  const [pitch, setPitch] = useState(50);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<GeneratedAudio | null>(
    null
  );

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData } = useDoc(userDocRef);

  const characterCount = useMemo(() => text.length, [text]);
  const canGenerate = characterCount > 0 && characterCount <= MAX_CHARACTERS;
  const credits = userData?.credits || 0;

  const handleGenerate = useCallback(async () => {
    if (!canGenerate || isGenerating || !user || !firestore) return;

    if (credits < characterCount) {
      toast({
        title: "Insufficient Credits",
        description: "Please upgrade your plan to continue generating speech.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedAudio(null);

    try {
      const result = await generateSpeech({
        text,
        voiceName: selectedVoice,
      });

      setGeneratedAudio({
        url: result.audioDataUri,
        voice: selectedVoice,
        duration: characterCount / 10, // Approximate duration
        characters: characterCount,
      });

      // Deduct credits
      const userRef = doc(firestore, 'users', user.uid);
      await updateDoc(userRef, {
        credits: Math.max(0, credits - characterCount)
      });

      toast({
        title: "Success",
        description: "Audio generated successfully.",
      });
    } catch (error: any) {
      console.error('Generation failed:', error);
      toast({
        title: "Error",
        description: "Failed to generate speech. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  }, [canGenerate, isGenerating, characterCount, user, firestore, credits, text, selectedVoice]);

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
            selectedVoice={selectedVoice}
            setSelectedVoice={setSelectedVoice}
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
                audioUrl={generatedAudio.url} 
                voice={generatedAudio.voice} 
                duration={generatedAudio.duration} 
                characters={generatedAudio.characters} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4 shadow-2xl backdrop-blur-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <p>Characters: {characterCount} / 2500</p>
              <p>Credits: {credits.toLocaleString()} remaining</p>
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
                {isGenerating ? 'Generating...' : 'Generate Audio'}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
