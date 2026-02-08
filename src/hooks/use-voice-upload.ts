'use client';

import { useState } from 'react';
import { useFirebase } from '@/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
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
      try {
        if (!storage) {
          throw new Error('Storage service is not available');
        }
        const storageRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const fileProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * weight;
            setProgress(Math.round(baseProgress + fileProgress));
          },
          (error) => {
            console.error('Storage upload error:', error);
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
      } catch (err) {
        reject(err);
      }
    });
  };

  const uploadVoice = async (
    avatarFile: File | null,
    audioFile: File,
    formData: VoiceUploadData
  ) => {
    if (!user) {
      toast({ title: "Authentication required", description: "You must be logged in to upload.", variant: "destructive" });
      return false;
    }

    if (!storage || !firestore) {
      toast({ title: "Service Unavailable", description: "Firebase services are not ready.", variant: "destructive" });
      return false;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      // 1. Generate unique voice ID
      const voiceId = crypto.randomUUID();
      let avatarUrl = "";

      // 2. Upload Avatar (Weight: 20%, Base: 0%)
      // Requested Path Format: avatars/{uid}/{voiceId}/{fileName}.PNG
      if (avatarFile) {
        avatarUrl = await uploadFile(
          avatarFile, 
          `avatars/${user.uid}/${voiceId}/avatar.PNG`, 
          20, 
          0
        );
      } else {
        setProgress(20);
      }

      // 3. Upload Audio (Weight: 70%, Base: 20%)
      // Path: voices/{userId}/{voiceId}/voice_sample.wav
      const audioUrl = await uploadFile(
        audioFile, 
        `voices/${user.uid}/${voiceId}/voice_sample.wav`, 
        70, 
        20
      );

      // 4. Calculate Audio Duration
      const audioDuration = await getAudioDuration(audioFile);

      // 5. Save metadata to Firestore (Base: 90%)
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
      // Small delay for UX so user sees 100%
      setTimeout(() => {
        setIsUploading(false);
        setProgress(0);
      }, 800);
    }
  };

  return { uploadVoice, isUploading, progress };
}

async function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    try {
      const audio = new Audio();
      const objectUrl = URL.createObjectURL(file);
      audio.src = objectUrl;
      audio.onloadedmetadata = () => {
        resolve(audio.duration);
        URL.revokeObjectURL(objectUrl);
      };
      audio.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(0);
      };
    } catch (e) {
      resolve(0);
    }
  });
}