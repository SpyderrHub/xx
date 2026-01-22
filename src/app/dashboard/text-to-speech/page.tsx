'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import TextInputCard from '@/components/tts/text-input-card';
import VoiceSelectionCard from '@/components/tts/voice-selection-card';
import AudioOutputCard from '@/components/tts/audio-output-card';
import { Button } from '@/components/ui/button';
import { Loader2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MAX_CHARACTERS = 2500;

interface GeneratedAudio {
  url: string;
  voice: string;
  duration: number;
  characters: number;
}

export default function TextToSpeechPage() {
  const [text, setText] = useState(
    'Welcome to VoxAI, where your words come to life with the most advanced and expressive AI voices.'
  );
  const [selectedVoice, setSelectedVoice] = useState('aria-female-en');
  const [stability, setStability] = useState(75);
  const [clarity, setClarity] = useState(80);
  const [pitch, setPitch] = useState(50);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<GeneratedAudio | null>(
    null
  );

  const characterCount = useMemo(() => text.length, [text]);
  const canGenerate = characterCount > 0 && characterCount <= MAX_CHARACTERS;

  const handleGenerate = useCallback(() => {
    if (!canGenerate || isGenerating) return;

    setIsGenerating(true);
    setGeneratedAudio(null);

    // Mock API call
    setTimeout(() => {
      setGeneratedAudio({
        url: 'https://storage.googleapis.com/studioprod/vox/placeholder_audio.mp3',
        voice: 'Aria',
        duration: 5.2,
        characters: characterCount,
      });
      setIsGenerating(false);
    }, 2500);
  }, [canGenerate, isGenerating, characterCount]);

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
              <AudioOutputCard audioUrl={generatedAudio.url} voice={generatedAudio.voice} duration={generatedAudio.duration} characters={generatedAudio.characters} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4 shadow-2xl backdrop-blur-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <p>Characters: {characterCount} / 2500</p>
              <p>Credits: 4,320 / 6,000</p>
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
