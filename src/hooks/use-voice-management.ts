'use client';

import { useState } from 'react';
import { useFirebase } from '@/firebase';
import { ref, deleteObject } from 'firebase/storage';
import { doc, deleteDoc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';

export function useVoiceManagement() {
  const [isDeleting, setIsDeleting] = useState(false);
  const { storage, firestore, user } = useFirebase();

  const deleteVoice = async (voiceId: string, avatarUrl?: string, audioUrl?: string) => {
    if (!user) {
      toast({ title: "Auth Error", description: "You must be logged in.", variant: "destructive" });
      return false;
    }

    setIsDeleting(true);

    try {
      // 1. Delete Audio Sample from Storage
      if (audioUrl) {
        const audioRef = ref(storage, `voices/${user.uid}/${voiceId}/voice_sample.wav`);
        await deleteObject(audioRef).catch(e => console.warn("Audio file already gone or inaccessible", e));
      }

      // 2. Delete Avatar from Storage
      if (avatarUrl) {
        const avatarRef = ref(storage, `avatars/${user.uid}/${voiceId}/avatar.PNG`);
        await deleteObject(avatarRef).catch(e => console.warn("Avatar file already gone or inaccessible", e));
      }

      // 3. Delete Firestore Document
      const voiceDocRef = doc(firestore, 'voices', voiceId);
      await deleteDoc(voiceDocRef);

      toast({ 
        title: "Voice deleted", 
        description: "The voice profile has been permanently removed.",
      });
      
      return true;
    } catch (error: any) {
      console.error("Deletion failed:", error);
      toast({ 
        title: "Deletion Failed", 
        description: error.message || "An error occurred while deleting the voice.", 
        variant: "destructive" 
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteVoice, isDeleting };
}
