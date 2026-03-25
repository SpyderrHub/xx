
'use client';

import { useState } from 'react';
import { useFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function useVoiceUpdate() {
  const [isUpdating, setIsUpdating] = useState(false);
  const { firestore, user } = useFirebase();

  const updateVoice = async (voiceId: string, data: any) => {
    if (!user || !firestore) {
      toast({ title: "Auth Error", description: "You must be logged in.", variant: "destructive" });
      return false;
    }

    setIsUpdating(true);

    try {
      const voiceDocRef = doc(firestore, 'voices', voiceId);
      
      await updateDoc(voiceDocRef, {
        ...data,
        updatedAt: new Date().toISOString()
      }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: voiceDocRef.path,
          operation: 'update',
          requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
      });

      toast({ 
        title: "Profile Updated", 
        description: "The voice profile changes have been saved.",
      });
      
      return true;
    } catch (error: any) {
      console.error("Update failed:", error);
      toast({ 
        title: "Update Failed", 
        description: error.message || "An error occurred while updating the voice.", 
        variant: "destructive" 
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateVoice, isUpdating };
}
