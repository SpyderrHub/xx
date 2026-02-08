
'use client';

import { useState } from 'react';
import { useFirebase } from '@/firebase';
import { ref, uploadBytesResumable, getDownloadURL, UploadTask } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';

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

  const uploadFile = (file: File, path: string, weight: number, baseProgress: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const fileProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * weight;
          setProgress(Math.round(baseProgress + fileProgress));
        },
        (error) => {
          console.error('Upload task error:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadUrl);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  };

  const uploadVoice = async (
    avatarFile: File | null,
    audioFile: File,
    formData: VoiceUploadData
  ) => {
    if (!user) {
      toast({ title: "Authentication required", variant: "destructive" });
      return false;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      // 1. Generate unique voice ID
      const voiceId = crypto.randomUUID();
      let avatarUrl = "";

      // 2. Upload Avatar (Weight: 30%, Base: 0%)
      if (avatarFile) {
        avatarUrl = await uploadFile(
          avatarFile, 
          `avatars/${user.uid}/${voiceId}/avatar.png`, 
          30, 
          0
        );
      } else {
        setProgress(30);
      }

      // 3. Upload Audio (Weight: 60%, Base: 30%)
      const audioUrl = await uploadFile(
        audioFile, 
        `voices/${user.uid}/${voiceId}/voice_sample.wav`, 
        60, 
        30
      );

      // 4. Calculate Audio Duration
      const audioDuration = await getAudioDuration(audioFile);

      // 5. Save metadata to Firestore (90% to 100%)
      setProgress(95);
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
        title: "Upload Successful", 
        description: "Your voice profile has been submitted for review.",
      });
      
      return true;
    } catch (error: any) {
      console.error("Upload process failed:", error);
      toast({ 
        title: "Upload Failed", 
        description: error.message || "An unexpected error occurred during upload.", 
        variant: "destructive" 
      });
      return false;
    } finally {
      // Wait a bit so the user sees 100% before closing
      setTimeout(() => {
        setIsUploading(false);
        setProgress(0);
      }, 500);
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
      URL.revokeObjectURL(audio.src);
    };
    audio.onerror = () => {
      resolve(0);
    };
  });
}
