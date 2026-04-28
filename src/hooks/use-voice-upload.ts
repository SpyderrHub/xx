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
    const contentType = file.type || 'application/octet-stream';
    
    // Fix: Generate unique filename to avoid cache collision
    const uniqueFileName = `${crypto.randomUUID()}-${file.name}`;

    // 1. Get Presigned URL
    const presignRes = await fetch('/api/r2/presign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        fileName: uniqueFileName,
        contentType: contentType,
        path: path, 
      }),
    });

    const presignData = await presignRes.json();
    if (!presignRes.ok) {
      throw new Error(presignData.message || 'Failed to get upload authorization');
    }

    const { presignedUrl, publicUrl, key } = presignData;

    // 2. Perform XHR upload for progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', presignedUrl, true);
      
      // Headers must match the presigned command exactly
      xhr.setRequestHeader('Content-Type', contentType);
      xhr.setRequestHeader('Cache-Control', 'public, max-age=31536000, immutable');

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const fileProgress = (event.loaded / event.total) * weight;
          setProgress(Math.round(baseProgress + fileProgress));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 204) {
          resolve({ url: publicUrl, key });
        } else {
          console.error('R2 Error:', xhr.responseText);
          reject(new Error(`Storage server rejected upload. Ensure CORS is configured for your domain.`));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error during R2 upload. Check bucket CORS configuration.'));
      };

      xhr.send(file);
    });
  };

  const uploadVoice = async (
    avatarFile: File | null,
    audioFile: File,
    formData: VoiceUploadData
  ) => {
    if (!user || !firestore) return false;

    setIsUploading(true);
    setProgress(0);

    try {
      const voiceId = crypto.randomUUID();
      let avatarUrl = "";
      let avatarKey = "";

      // 1. Upload Avatar (Weight: 20%) to 'avatars' root
      if (avatarFile) {
        const res = await uploadFileToR2(avatarFile, 'avatars', 20, 0);
        avatarUrl = res.url;
        avatarKey = res.key;
      } else {
        avatarUrl = `weavy:${formData.selectedGradientIndex || 0}`;
        setProgress(20);
      }

      // 2. Upload Audio (Weight: 70%) to 'voices' root
      const audioRes = await uploadFileToR2(audioFile, 'voices', 70, 20);
      const audioUrl = audioRes.url;
      const audioKey = audioRes.key;

      // 3. Audio Metadata
      const audioDuration = await getAudioDuration(audioFile);

      // 4. Save to Firestore
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
        status: "approved",
        createdAt: new Date().toISOString(),
        language: formData.languages[0] || "",
        style: formData.styles[0] || "",
      };

      await setDoc(voiceDocRef, voiceData);
      setProgress(100);

      toast({ title: "Upload Successful", description: "Voice profile saved to R2 library." });
      return true;
    } catch (error: any) {
      toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
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
