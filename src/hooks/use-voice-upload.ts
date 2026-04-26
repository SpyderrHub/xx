
'use client';

import { useState } from 'react';
import { useFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';

export interface VoiceUploadData {
  voiceName: string;
  languages: string[];
  gender: string;
  ageRange: string;
  accent: string;
  styles: string[];
  description: string;
  referenceText: string;
  selectedGradientIndex?: number;
}

export function useVoiceUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { firestore, user } = useFirebase();

  const uploadFileToR2 = async (file: File, path: string, weight: number, baseProgress: number): Promise<{ url: string; key: string }> => {
    if (!user) throw new Error('User not authenticated');
    
    const idToken = await user.getIdToken();
    
    // 1. Get Presigned URL (Backend enforces uid folder)
    const presignRes = await fetch('/api/r2/presign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type,
        path: path, // 'avatars' or 'voices'
      }),
    });

    if (!presignRes.ok) {
      const err = await presignRes.json();
      throw new Error(err.message || 'Failed to get upload authorization');
    }

    const { presignedUrl, publicUrl, key } = await presignRes.json();

    // 2. Perform XHR upload for progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', presignedUrl, true);
      xhr.setRequestHeader('Content-Type', file.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const fileProgress = (event.loaded / event.total) * weight;
          setProgress(Math.round(baseProgress + fileProgress));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve({ url: publicUrl, key });
        } else {
          reject(new Error('Failed to upload file to R2'));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during upload'));
      xhr.send(file);
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

    if (!firestore) {
      toast({ title: "Service Unavailable", description: "Firestore is not ready.", variant: "destructive" });
      return false;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const voiceId = crypto.randomUUID();
      let avatarUrl = "";
      let avatarKey = "";

      // 1. Handle Avatar (Weight: 20%, Base: 0%)
      if (avatarFile) {
        const res = await uploadFileToR2(avatarFile, 'avatars', 20, 0);
        avatarUrl = res.url;
        avatarKey = res.key;
      } else {
        avatarUrl = `weavy:${formData.selectedGradientIndex || 0}`;
        setProgress(20);
      }

      // 2. Upload Audio (Weight: 70%, Base: 20%)
      const audioRes = await uploadFileToR2(audioFile, 'voices', 70, 20);
      const audioUrl = audioRes.url;
      const audioKey = audioRes.key;

      // 3. Calculate Audio Duration
      const audioDuration = await getAudioDuration(audioFile);

      // 4. Save metadata to Firestore (Base: 90%)
      setProgress(95);
      const voiceDocRef = doc(firestore, 'voices', voiceId);
      const voiceData = {
        voiceId,
        userId: user.uid,
        ...formData,
        avatarUrl,
        avatarKey,
        audioUrl,
        audioKey,
        audioDuration,
        audioFormat: audioFile.type,
        status: "pending_review",
        createdAt: new Date().toISOString(),
        language: formData.languages[0] || "",
        style: formData.styles[0] || "",
      };

      await setDoc(voiceDocRef, voiceData);
      setProgress(100);

      toast({ 
        title: "Upload Successful", 
        description: "Your voice profile has been submitted and is under review.",
      });
      
      return true;
    } catch (error: any) {
      console.error("Upload failed:", error);
      toast({ 
        title: "Upload Failed", 
        description: error.message || "An unexpected error occurred during asset upload.", 
        variant: "destructive" 
      });
      return false;
    } finally {
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
