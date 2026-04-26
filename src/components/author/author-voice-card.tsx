
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Mic2, User, Globe, UserCircle, Trash2, Edit2, Loader2, Palette } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useVoiceManagement } from '@/hooks/use-voice-management';
import { VoiceEditDialog } from './voice-edit-dialog';
import { WeavyPattern } from './avatar-upload';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';

interface AuthorVoiceCardProps {
  voice: any;
}

export function AuthorVoiceCard({ voice }: AuthorVoiceCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { deleteVoice, isDeleting } = useVoiceManagement();

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(voice.audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleDelete = async () => {
    // Pass the storage keys instead of public URLs to ensure server-side verification passes
    await deleteVoice(voice.id, voice.avatarKey, voice.audioKey);
  };

  const languages = Array.isArray(voice.languages) 
    ? voice.languages 
    : [voice.language].filter(Boolean);

  const styles = Array.isArray(voice.styles)
    ? voice.styles
    : [voice.style].filter(Boolean);

  // Determine if we should show a gradient or image
  const isGradient = voice.avatarUrl?.startsWith('weavy:');
  const gradientIndex = isGradient ? parseInt(voice.avatarUrl.split(':')[1]) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full"
    >
      <Card className="h-full bg-card/40 backdrop-blur-md border-white/5 hover:border-primary/20 transition-all overflow-hidden group relative">
        {/* Absolute Actions Overlay */}
        <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="secondary" 
            size="icon" 
            className="h-7 w-7 rounded-full bg-white/5 hover:bg-primary hover:text-white border border-white/10"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="icon" 
                className="h-7 w-7 rounded-full bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white transition-all border border-red-500/30"
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border-white/10">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Delete Voice?</AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  This action will permanently delete this voice and all related data from Cloudflare R2 and Firestore. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-white/5 border-white/10 text-white">Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-red-600 text-white hover:bg-red-700 font-bold"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <CardContent className="p-3 sm:p-4 flex flex-col h-full">
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="relative h-10 w-10 sm:h-14 sm:w-14 rounded-2xl bg-primary/10 overflow-hidden flex items-center justify-center border border-white/10 shrink-0 shadow-lg">
              {isGradient ? (
                <WeavyPattern presetIndex={gradientIndex} />
              ) : voice.avatarUrl ? (
                <Image src={voice.avatarUrl} alt={voice.voiceName} fill className="object-cover" />
              ) : (
                <User className="h-5 w-5 sm:h-7 sm:w-7 text-muted-foreground/50" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xs sm:text-base pr-14 truncate">{voice.voiceName}</h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {styles.slice(0, 2).map((s: string) => (
                  <Badge key={s} variant="secondary" className="text-[8px] bg-primary/10 text-primary border-none px-1.5 py-0 h-4 uppercase font-black tracking-widest">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 mb-3 sm:mb-4 bg-black/20 p-2 sm:p-3 rounded-xl border border-white/5">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-muted-foreground uppercase flex items-center gap-1 font-black tracking-widest">
                <Globe className="h-2 w-2" /> Languages
              </span>
              <div className="flex flex-wrap gap-1">
                {languages.length > 0 && (
                  <Badge variant="secondary" className="text-[8px] bg-white/5 border-none px-1.5 py-0 h-4 font-bold">
                    {languages[0]}
                  </Badge>
                )}
                {languages.length > 1 && (
                  <Badge variant="secondary" className="text-[8px] bg-white/5 border-none px-1.5 py-0 h-4 font-bold">
                    +{languages.length - 1}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-muted-foreground uppercase flex items-center gap-1 font-black tracking-widest">
                <UserCircle className="h-2 w-2" /> Gender
              </span>
              <span className="text-[10px] sm:text-xs font-medium">{voice.gender}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto pt-1">
            <span className="text-[9px] text-muted-foreground italic truncate max-w-[100px]">
              {new Date(voice.createdAt).toLocaleDateString()}
            </span>
            <Button
              variant="secondary"
              size="sm"
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full p-0 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      <VoiceEditDialog 
        voice={voice} 
        isOpen={isEditDialogOpen} 
        onClose={() => setIsEditDialogOpen(false)} 
      />
    </motion.div>
  );
}
