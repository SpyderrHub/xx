
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Trash2
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
  
  // Form State
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  // Fetch Firestore User Data
  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData, isLoading: isDocLoading } = useDoc(userDocRef);

  // Sync local state when data loads
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !firestore || !auth) return;

    setIsSaving(true);

    try {
      // 1. Update Firebase Auth Profile
      await updateProfile(user, {
        displayName: displayName,
        photoURL: photoURL
      });

      // 2. Update Firestore User Document
      const userRef = doc(firestore, 'users', user.uid);
      await updateDoc(userRef, {
        name: displayName,
        updatedAt: new Date().toISOString()
      });

      toast({
        title: "Profile Updated",
        description: "Your settings have been saved successfully.",
      });
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Update Error",
        description: error.message || "Could not save profile changes.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !firestore) return;

    setIsDeleting(true);

    try {
      // 1. Delete Firestore User Document
      const userRef = doc(firestore, 'users', user.uid);
      await deleteDoc(userRef);

      // 2. Delete Auth User (Note: may require recent login)
      await deleteUser(user);

      toast({
        title: "Account Deleted",
        description: "Your account and data have been permanently removed.",
      });
      
      router.push('/login');
    } catch (error: any) {
      console.error("Account deletion failed:", error);
      
      if (error.code === 'auth/requires-recent-login') {
        toast({
          title: "Security Re-authentication Required",
          description: "Please log out and log back in before deleting your account for security purposes.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Deletion Error",
          description: error.message || "Could not complete account deletion.",
          variant: "destructive"
        });
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  if (isDocLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-32">
      <header className="px-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Account Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage your profile information and account preferences.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Summary Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-white/[0.02] border-white/5 overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="relative group mb-4">
                <Avatar className="h-24 w-24 ring-4 ring-primary/10 transition-all group-hover:ring-primary/30">
                  <AvatarImage src={photoURL} className="object-cover" />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary font-black">
                    {displayName ? getInitials(displayName) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-full transition-opacity cursor-pointer backdrop-blur-[2px]">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="font-bold text-white text-lg">{displayName || 'Anonymous User'}</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-black mt-1">
                {userData?.plan || 'Free'} Plan
              </p>
              
              <div className="w-full h-px bg-white/5 my-6" />
              
              <div className="w-full space-y-4">
                <div className="flex items-center gap-3 text-left">
                  <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground uppercase font-black">Member Since</p>
                    <p className="text-xs text-white/80 font-medium truncate">
                      {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground uppercase font-black">Account Status</p>
                    <p className="text-xs text-white/80 font-medium truncate">Verified & Active</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-black uppercase tracking-widest text-white">Pro Tip</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Using a high-resolution avatar helps you stand out in the community and voice library.
            </p>
          </div>
        </div>

        {/* Main Editor Form */}
        <div className="md:col-span-2 space-y-8">
          <form onSubmit={handleSaveProfile}>
            <Card className="bg-white/[0.02] border-white/5 rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 border-b border-white/5 bg-white/[0.01]">
                <CardTitle className="text-xl font-bold">Public Profile</CardTitle>
                <CardDescription>This information will be visible to other users in the studio.</CardDescription>
              </CardHeader>
              
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Display Name</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="displayName"
                        placeholder="John Doe" 
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="h-12 pl-11 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email Address (Primary)</Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                      <Input 
                        id="email"
                        value={user?.email || ''} 
                        readOnly 
                        className="h-12 pl-11 bg-black/20 border-white/5 rounded-xl text-muted-foreground cursor-not-allowed italic"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Verified</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground ml-1 italic">Contact support to change your primary email.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avatarUrl" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Profile Image URL</Label>
                    <div className="relative">
                      <Camera className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="avatarUrl"
                        placeholder="https://images.unsplash.com/..." 
                        value={photoURL}
                        onChange={(e) => setPhotoURL(e.target.value)}
                        className="h-12 pl-11 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20 transition-all font-medium"
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground ml-1 italic">Paste a link to a public image (PNG, JPG, or GIF).</p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-8 border-t border-white/5 bg-white/[0.01] flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 font-black text-sm shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 btn-glow"
                >
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  {isSaving ? 'Saving Changes...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          </form>

          {/* Danger Zone */}
          <Card className="border-red-500/20 bg-red-500/[0.02] rounded-[2rem] overflow-hidden">
            <CardHeader className="p-8 border-b border-red-500/10 bg-red-500/[0.01]">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <CardTitle className="text-xl font-bold text-red-500">Danger Zone</CardTitle>
              </div>
              <CardDescription className="text-red-500/60 font-medium">Permanent actions that cannot be undone.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h4 className="font-bold text-white mb-1">Delete Account</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                    Permanently remove your QuantisAI account, subscription data, and all generated audio history. This action is irreversible.
                  </p>
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      className="h-12 px-6 rounded-xl font-bold bg-red-600/10 hover:bg-red-600 hover:text-white border border-red-600/20 text-red-500 transition-all shrink-0"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-black/95 backdrop-blur-2xl border-white/10 rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground">
                        This will permanently delete your QuantisAI account and remove all your data from our servers. You will lose access to your character balance and history.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-white/5 border-white/10 text-white rounded-xl hover:bg-white/10">Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl"
                      >
                        {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Delete Permanently
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
