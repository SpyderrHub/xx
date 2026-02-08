
'use client';

import { useState } from 'react';
import { useFirebase } from '@/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

export interface VoiceUploadData {
  voiceName: string;
  language: string;
  gender: string;
  ageRange: string;
  accent: string;
  style: string;
  description: string;
}

export function useVoiceUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { storage, firestore, user } = useFirebase();

  const uploadVoice = async (
    avatarFile: File | null,
    audioFile: File,
    formData: VoiceUploadData
  ) => {
    if (!user) {
      toast({ title: "Authentication required", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    setProgress(10);

    try {
      const voiceId = uuidv4();
      let avatarUrl = "";
      
      // 1. Upload Avatar if exists
      if (avatarFile) {
        const avatarRef = ref(storage, `avatars/${user.uid}/${voiceId}/avatar.png`);
        const avatarSnap = await uploadBytes(avatarRef, avatarFile);
        avatarUrl = await getDownloadURL(avatarSnap.ref);
      }
      setProgress(40);

      // 2. Upload Audio
      const audioRef = ref(storage, `voices/${user.uid}/${voiceId}/voice_sample.wav`);
      const audioSnap = await uploadBytes(audioRef, audioFile);
      const audioUrl = await getDownloadURL(audioSnap.ref);
      setProgress(70);

      // 3. Get Audio Duration
      const audioDuration = await getAudioDuration(audioFile);

      // 4. Save to Firestore
      const voiceDocRef = doc(firestore, 'voices', voiceId);
      const voiceData = {
        voiceId,
        userId: user.uid,
        ...formData,
        avatarUrl,
        audioUrl,
        audioDuration,
        audioFormat: audioFile.type,
        status: "pending_review",
        createdAt: new Date().toISOString(),
      };

      await setDoc(voiceDocRef, voiceData);
      setProgress(100);

      toast({ 
        title: "Success", 
        description: "Voice profile submitted for review!",
      });
      
      return voiceId;
    } catch (error: any) {
      console.error("Upload failed:", error);
      toast({ 
        title: "Upload failed", 
        description: error.message || "An unexpected error occurred", 
        variant: "destructive" 
      });
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return { uploadVoice, isUploading, progress };
}

async function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    audio.onloadedmetadata = () => {
      resolve(audio.duration);
    };
  });
}
