
'use client';

import { useState } from 'react';
import { useFirebase } from '@/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';

export function useVoiceManagement() {
  const [isDeleting, setIsDeleting] = useState(false);
  const { firestore, user } = useFirebase();

  const deleteVoice = async (voiceId: string, avatarKey?: string, audioKey?: string) => {
    if (!user || !firestore) {
      toast({ title: "Auth Error", description: "You must be logged in.", variant: "destructive" });
      return false;
    }

    setIsDeleting(true);

    try {
      const idToken = await user.getIdToken();

      // 1. Delete Files from Cloudflare R2 via Secure API
      const deletePromises = [];
      
      if (audioKey) {
        deletePromises.push(
          fetch('/api/r2/delete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({ key: audioKey }),
          })
        );
      }

      if (avatarKey) {
        deletePromises.push(
          fetch('/api/r2/delete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({ key: avatarKey }),
          })
        );
      }

      if (deletePromises.length > 0) {
        await Promise.all(deletePromises);
      }

      // 2. Delete Firestore Document
      const voiceDocRef = doc(firestore, 'voices', voiceId);
      await deleteDoc(voiceDocRef);

      toast({ 
        title: "Voice deleted", 
        description: "The voice profile and associated R2 files have been permanently removed.",
      });
      
      return true;
    } catch (error: any) {
      console.error("Deletion failed:", error);
      toast({ 
        title: "Deletion Failed", 
        description: error.message || "An error occurred while deleting files from R2.", 
        variant: "destructive" 
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteVoice, isDeleting };
}
