
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Camera, 
  Save, 
  Loader2, 
  ShieldCheck,
  Calendar,
  Sparkles,
  AlertTriangle,
  Trash2,
  Upload,
  CheckCircle2
} from 'lucide-react';
import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { updateProfile, deleteUser } from 'firebase/auth';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { user, firestore, auth } = useFirebase();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData, isLoading: isDocLoading } = useDoc(userDocRef);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: "Invalid file", description: "Please upload an image.", variant: "destructive" });
      return;
    }

    setIsUploading(true);

    try {
      const idToken = await user.getIdToken();
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
          contentType: file.type,
          path: 'users',
        }),
      });

      const presignData = await presignRes.json();
      if (!presignRes.ok) throw new Error(presignData.message);

      // 2. Upload to R2 with Immutable Cache System Headers
      const uploadRes = await fetch(presignData.presignedUrl, {
        method: 'PUT',
        headers: { 
          'Content-Type': file.type,
          'Cache-Control': 'public, max-age=31536000, immutable'
        },
        body: file,
      });

      if (!uploadRes.ok) throw new Error("Upload rejected by storage server.");

      setPhotoURL(presignData.publicUrl);
      toast({ title: "Image Uploaded", description: "Avatar updated and cached for 1 year." });
    } catch (error: any) {
      toast({ title: "Upload Error", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !firestore || !auth) return;

    setIsSaving(true);

    try {
      await updateProfile(user, {
        displayName: displayName,
        photoURL: photoURL
      });

      const userRef = doc(firestore, 'users', user.uid);
      await updateDoc(userRef, {
        name: displayName,
        updatedAt: new Date().toISOString()
      });

      toast({ title: "Profile Updated", description: "Your changes have been saved." });
    } catch (error: any) {
      toast({ title: "Update Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !firestore) return;
    setIsDeleting(true);
    try {
      const userRef = doc(firestore, 'users', user.uid);
      await deleteDoc(userRef);
      await deleteUser(user);
      router.push('/login');
    } catch (error: any) {
      toast({ title: "Deletion Error", description: error.message, variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  const getInitials = (name: string) => name.split(' ').map((n) => n[0]).join('').toUpperCase();

  if (isDocLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-32">
      <header className="px-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Account Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Identity management with R2 immutable storage.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-white/[0.02] border-white/5 overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div 
                className="relative group mb-4 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Avatar className="h-24 w-24 ring-4 ring-primary/10 transition-all group-hover:ring-primary/30">
                  <AvatarImage src={photoURL} className="object-cover" />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary font-black">
                    {displayName ? getInitials(displayName) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 rounded-full transition-opacity backdrop-blur-[2px]">
                  {isUploading ? <Loader2 className="h-6 w-6 text-white animate-spin" /> : <Upload className="h-6 w-6 text-white" />}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
              </div>
              <h3 className="font-bold text-white text-lg">{displayName || 'User'}</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-black mt-1">
                {userData?.plan || 'Free'} Plan
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <form onSubmit={handleSaveProfile}>
            <Card className="bg-white/[0.02] border-white/5 rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 border-b border-white/5 bg-white/[0.01]">
                <CardTitle className="text-xl font-bold">Public Profile</CardTitle>
                <CardDescription>All media served via 1-year immutable caching.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Display Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="h-12 pl-11 bg-white/5 border-white/10 rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Avatar R2 Key</Label>
                  <Input 
                    value={photoURL}
                    readOnly
                    className="h-12 bg-black/20 border-white/5 rounded-xl text-[10px] font-mono text-muted-foreground italic truncate"
                  />
                </div>
              </CardContent>
              <CardFooter className="p-8 border-t border-white/5 flex justify-end">
                <Button type="submit" disabled={isSaving} className="h-12 px-8 rounded-xl bg-primary font-black btn-glow">
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
