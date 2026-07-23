'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Camera, 
  Save, 
  Loader2, 
  Upload,
  Trash2,
  AlertTriangle
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
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';

/**
 * Converts any image to WebP format for optimal caching (Content-Type: image/webp)
 */
async function convertToWebP(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context failed'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
              type: 'image/webp',
              lastModified: Date.now()
            });
            resolve(webpFile);
          } else {
            reject(new Error('Conversion failed'));
          }
        }, 'image/webp', 0.85);
      };
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });
}

export default function SettingsPage() {
  const { user, firestore, auth } = useFirebase();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
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
      const webpFile = await convertToWebP(file);
      const idToken = await user.getIdToken();
      const uniqueFileName = `${crypto.randomUUID()}-${webpFile.name}`;

      // 1. Get Presigned URL
      const presignRes = await fetch('/api/r2/presign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          fileName: uniqueFileName,
          contentType: webpFile.type,
          path: 'users',
        }),
      });

      const presignData = await presignRes.json();
      if (!presignRes.ok) throw new Error(presignData.message);

      // 2. Upload to R2 with Immutable Cache System Headers
      const uploadRes = await fetch(presignData.presignedUrl, {
        method: 'PUT',
        headers: { 
          'Content-Type': presignData.enforcedMimeType || webpFile.type,
          'Cache-Control': presignData.enforcedCacheControl || 'public, max-age=31536000, immutable'
        },
        body: webpFile,
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
      // 1. Delete Firestore Document
      await deleteDoc(doc(firestore, 'users', user.uid));

      // 2. Delete Auth User
      await deleteUser(user);

      toast({ 
        title: "Account Deleted", 
        description: "Your data has been permanently removed from QuantisAI Labs." 
      });
      
      router.replace('/login');
    } catch (error: any) {
      console.error("Deletion failed:", error);
      if (error.code === 'auth/requires-recent-login') {
        toast({ 
          title: "Sensitive Operation", 
          description: "For security, please log out and back in to delete your account.", 
          variant: "destructive" 
        });
      } else {
        toast({ 
          title: "Deletion Error", 
          description: error.message || "Failed to remove account data.", 
          variant: "destructive" 
        });
      }
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
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Account Settings</h1>
        <p className="text-muted-foreground mt-1 text-xs md:text-sm">Identity management with R2 immutable storage.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-white/[0.02] border-white/5 overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div 
                className="relative group mb-4 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Avatar className="h-20 md:h-24 w-20 md:w-24 ring-4 ring-primary/10 transition-all group-hover:ring-primary/30">
                  <AvatarImage src={photoURL} className="object-cover" />
                  <AvatarFallback className="text-xl md:text-2xl bg-primary/10 text-primary font-black">
                    {displayName ? getInitials(displayName) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 rounded-full transition-opacity backdrop-blur-[2px]">
                  {isUploading ? <Loader2 className="h-5 md:h-6 w-5 md:w-6 text-white animate-spin" /> : <Camera className="h-5 md:h-6 w-5 md:w-6 text-white" />}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
              </div>
              <h3 className="font-bold text-white text-base md:text-lg">{displayName || 'User'}</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mt-1">
                {userData?.subscriptionPlan || 'Free'} Plan
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-8">
          <form onSubmit={handleSaveProfile}>
            <Card className="bg-white/[0.02] border-white/5 rounded-[2rem] overflow-hidden">
              <CardHeader className="p-6 md:p-8 border-b border-white/5 bg-white/[0.01]">
                <CardTitle className="text-lg md:text-xl font-bold">Public Profile</CardTitle>
                <CardDescription className="text-xs md:text-sm">All media served via 1-year immutable caching.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 md:p-8 space-y-6">
                <div className="space-y-2">
                  <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Display Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="h-10 md:h-12 pl-10 md:pl-11 bg-white/5 border-white/10 rounded-xl text-sm md:text-base"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      value={user?.email || ''}
                      readOnly
                      className="h-10 md:h-12 pl-10 md:pl-11 bg-black/20 border-white/10 rounded-xl text-muted-foreground cursor-not-allowed text-sm md:text-base"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 md:p-8 border-t border-white/5 flex justify-end">
                <Button type="submit" disabled={isSaving} className="h-10 md:h-12 px-6 md:px-8 rounded-xl bg-primary font-black btn-glow text-xs md:text-sm">
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </form>

          {/* Danger Zone */}
          <Card className="bg-red-500/5 border-red-500/20 rounded-[2rem] overflow-hidden mt-8">
            <CardHeader className="p-6 md:p-8 border-b border-red-500/10 bg-red-500/[0.02]">
              <CardTitle className="text-lg md:text-xl font-bold text-red-500 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription className="text-xs md:text-sm text-red-400/70"> Irreversible account actions. Proceed with extreme caution.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">Delete Account</p>
                  <p className="text-xs text-muted-foreground">Permanently remove your account, character credits, and all generated audio data.</p>
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      disabled={isDeleting}
                      className="h-10 md:h-12 px-6 rounded-xl font-black bg-red-600 hover:bg-red-700 transition-all text-xs uppercase tracking-widest"
                    >
                      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                      Delete Permanently
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-black/95 border-red-500/20 backdrop-blur-xl rounded-[2rem]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-xl font-black text-white">Final Confirmation</AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground text-sm leading-relaxed">
                        Are you sure you want to permanently delete your QuantisAI Labs account? This action cannot be undone. You will immediately lose access to your current character balance and generation history.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-6">
                      <AlertDialogCancel className="bg-white/5 border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest">Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteAccount}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-widest"
                      >
                        Delete My Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
