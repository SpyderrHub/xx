'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Save, Loader2, Globe, Plus, Palette, FileText, Sparkles } from 'lucide-react';
import { VoiceStudioTextarea } from './voice-studio-textarea';
import { useVoiceUpdate } from '@/hooks/use-voice-update';
import { AvatarUpload, WEAVY_PRESETS } from './avatar-upload';
import { useFirebase } from '@/firebase';
import { toast } from '@/hooks/use-toast';

const PREDEFINED_LANGUAGES = [
  "Assamese", "Bengali", "Gujarati", "Hindi", "Kannada", "Malayalam", "Marathi", "Odia", 
  "Punjabi", "Tamil", "Telugu", "Chinese", "English", "English (UK)", "English (US)", 
  "English (IN)", "Japanese", "Korean", "German", "French", "Russian", "Portuguese", "Spanish", "Italian"
];

const STYLES = [
  "Advertisement", "Sales", "Promo / Trailer", "Anime", "Cartoon", 
  "Motivational Speaker", "Storytelling", "Dramatic", "Podcast Host", 
  "Narration", "Professional", "Conversational", "Neutral", 
  "Friendly", "Whispering", "Emotional", "News Style"
];

interface VoiceEditDialogProps {
  voice: any;
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceEditDialog({ voice, isOpen, onClose }: VoiceEditDialogProps) {
  const { user } = useFirebase();
  const { updateVoice, isUpdating } = useVoiceUpdate();
  const [customLanguage, setCustomLanguage] = useState('');
  const [customStyle, setCustomStyle] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  // Avatar State
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(
    voice.avatarUrl?.startsWith('http') ? voice.avatarUrl : null
  );
  const [selectedGradientIndex, setSelectedGradientIndex] = useState(
    voice.avatarUrl?.startsWith('weavy:') ? parseInt(voice.avatarUrl.split(':')[1]) : 0
  );

  const [formData, setFormData] = useState({
    voiceName: voice.voiceName || '',
    languages: Array.isArray(voice.languages) ? voice.languages : [voice.language].filter(Boolean),
    gender: voice.gender || 'Male',
    styles: Array.isArray(voice.styles) ? voice.styles : [voice.style].filter(Boolean),
    description: voice.description || '',
    referenceText: voice.referenceText || ''
  });

  // Memory Leak Fix: Revoke Object URL
  useEffect(() => {
    return () => {
      if (avatarPreviewUrl && avatarFile) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
    };
  }, [avatarPreviewUrl, avatarFile]);

  const handleAvatarSelect = (file: File | null) => {
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setAvatarPreviewUrl(url);
    } else {
      setAvatarFile(null);
      setAvatarPreviewUrl(null);
    }
  };

  const uploadFileToR2 = async (file: File): Promise<{ url: string; key: string }> => {
    if (!user) throw new Error('User not authenticated');
    
    const idToken = await user.getIdToken();
    const contentType = file.type || 'application/octet-stream';
    
    const presignRes = await fetch('/api/r2/presign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        fileName: file.name,
        contentType: contentType,
        path: 'avatars', 
      }),
    });

    const presignData = await presignRes.json();
    if (!presignRes.ok) throw new Error(presignData.message || 'Failed to get upload authorization');

    const { presignedUrl, publicUrl, key } = presignData;

    const uploadRes = await fetch(presignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
      body: file,
    });

    if (!uploadRes.ok) throw new Error('Failed to upload image to storage');

    return { url: publicUrl, key };
  };

  const handleToggleLanguage = (lang: string) => {
    setFormData(prev => {
      const exists = prev.languages.includes(lang);
      if (exists) {
        return { ...prev, languages: prev.languages.filter(l => l !== lang) };
      } else {
        return { ...prev, languages: [...prev.languages, lang] };
      }
    });
  };

  const handleAddCustomLanguage = () => {
    if (!customLanguage.trim()) return;
    if (formData.languages.includes(customLanguage.trim())) {
      setCustomLanguage('');
      return;
    }
    setFormData(prev => ({ ...prev, languages: [...prev.languages, customLanguage.trim()] }));
    setCustomLanguage('');
  };

  const handleToggleStyle = (style: string) => {
    setFormData(prev => {
      const exists = prev.styles.includes(style);
      if (exists) {
        return { ...prev, styles: prev.styles.filter(s => s !== style) };
      } else {
        return { ...prev, styles: [...prev.styles, style] };
      }
    });
  };

  const handleAddCustomStyle = () => {
    if (!customStyle.trim()) return;
    if (formData.styles.includes(customStyle.trim())) {
      setCustomStyle('');
      return;
    }
    setFormData(prev => ({ ...prev, styles: [...prev.styles, customStyle.trim()] }));
    setCustomStyle('');
  };

  const handleSave = async () => {
    setIsUploadingImage(true);
    let avatarUrl = voice.avatarUrl;
    let avatarKey = voice.avatarKey;

    try {
      // 1. Handle Avatar Change
      if (avatarFile) {
        const res = await uploadFileToR2(avatarFile);
        avatarUrl = res.url;
        avatarKey = res.key;
      } else if (!avatarPreviewUrl) {
        // It's a gradient
        avatarUrl = `weavy:${selectedGradientIndex}`;
        avatarKey = ""; 
      } else if (avatarPreviewUrl === voice.avatarUrl && voice.avatarUrl.startsWith('weavy:')) {
        // Gradient might have changed index but not mode
        avatarUrl = `weavy:${selectedGradientIndex}`;
      }

      // 2. Update Firestore
      const success = await updateVoice(voice.id, {
        ...formData,
        avatarUrl,
        avatarKey,
        style: formData.styles[0] || 'Narration',
      });
      
      if (success) onClose();
    } catch (error: any) {
      toast({ title: "Update Error", description: error.message, variant: "destructive" });
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl bg-card/95 backdrop-blur-2xl border-white/10 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Edit Voice Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* Avatar Section */}
          <div className="flex justify-center border-b border-white/5 pb-8">
            <AvatarUpload 
              onAvatarSelect={handleAvatarSelect} 
              avatarPreview={avatarPreviewUrl} 
              onGradientSelect={setSelectedGradientIndex}
              selectedGradientIndex={selectedGradientIndex}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Voice Name</Label>
              <Input 
                value={formData.voiceName} 
                onChange={(e) => setFormData({...formData, voiceName: e.target.value})}
                className="bg-white/5 border-white/10 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={formData.gender} onValueChange={(v) => setFormData({...formData, gender: v})}>
                <SelectTrigger className="bg-white/5 border-white/10 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-3 w-3 text-primary" />
                <span>Supported Languages</span>
              </div>
              <span className="text-[10px] text-muted-foreground uppercase font-black">Select Multiple</span>
            </Label>
            <div className="flex flex-wrap gap-2 p-3 bg-white/5 border border-white/10 rounded-xl max-h-32 overflow-y-auto scrollbar-hide">
              {PREDEFINED_LANGUAGES.map(lang => (
                <Badge
                  key={lang}
                  variant={formData.languages.includes(lang) ? "default" : "outline"}
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => handleToggleLanguage(lang)}
                >
                  {lang}
                  {formData.languages.includes(lang) && <X className="ml-1 h-3 w-3" />}
                </Badge>
              ))}
              {formData.languages.filter(l => !PREDEFINED_LANGUAGES.includes(l)).map(lang => (
                <Badge
                  key={lang}
                  variant="default"
                  className="cursor-pointer transition-all hover:scale-105 bg-indigo-600"
                  onClick={() => handleToggleLanguage(lang)}
                >
                  {lang}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input 
                placeholder="Add other language..." 
                value={customLanguage}
                onChange={(e) => setCustomLanguage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomLanguage()}
                className="h-9 rounded-lg bg-white/5 border-white/10 text-xs"
              />
              <Button variant="secondary" size="sm" onClick={handleAddCustomLanguage} className="h-9 rounded-lg">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="h-3 w-3 text-primary" />
                <span>Voice Styles</span>
              </div>
              <span className="text-[10px] text-muted-foreground uppercase font-black">Select Multiple</span>
            </Label>
            <div className="flex flex-wrap gap-2 p-3 bg-white/5 border border-white/10 rounded-xl max-h-32 overflow-y-auto scrollbar-hide">
              {STYLES.map(s => (
                <Badge
                  key={s}
                  variant={formData.styles.includes(s) ? "default" : "outline"}
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => handleToggleStyle(s)}
                >
                  {s}
                  {formData.styles.includes(s) && <X className="ml-1 h-3 w-3" />}
                </Badge>
              ))}
              {formData.styles.filter(s => !STYLES.includes(s)).map(style => (
                <Badge
                  key={style}
                  variant="default"
                  className="cursor-pointer transition-all hover:scale-105 bg-indigo-600"
                  onClick={() => handleToggleStyle(style)}
                >
                  {style}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input 
                placeholder="Add custom style..." 
                value={customStyle}
                onChange={(e) => setCustomStyle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomStyle()}
                className="h-9 rounded-lg bg-white/5 border-white/10 text-xs"
              />
              <Button variant="secondary" size="sm" onClick={handleAddCustomStyle} className="h-9 rounded-lg">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <VoiceStudioTextarea 
              label="Voice Description"
              value={formData.description} 
              onChange={(v) => setFormData({...formData, description: v})} 
              placeholder="Describe the voice character..."
              hint="Publicly visible info."
            />
            <VoiceStudioTextarea 
              label="Reference Text"
              value={formData.referenceText} 
              onChange={(v) => setFormData({...formData, referenceText: v})} 
              placeholder="Example script for the voice..."
              hint="Demonstrates character."
              minLength={10}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} disabled={isUpdating || isUploadingImage}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            disabled={isUpdating || isUploadingImage || formData.languages.length === 0 || formData.styles.length === 0}
            className="bg-primary hover:bg-primary/90 min-w-[120px]"
          >
            {isUpdating || isUploadingImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
