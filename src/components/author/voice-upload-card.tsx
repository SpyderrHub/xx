
'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, Mic, Trash2, CheckCircle2, Loader2, Sparkles, X, Globe, Plus, Palette } from 'lucide-react';
import { AudioPreviewPlayer } from './audio-preview-player';
import { AvatarUpload, WEAVY_PRESETS } from './avatar-upload';
import { VoiceStudioTextarea } from './voice-studio-textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { useVoiceUpload } from '@/hooks/use-voice-upload';
import { UploadProgressModal } from './upload-progress-modal';

const PREDEFINED_LANGUAGES = [
  "English, US", "English, UK", "English, India", "Spanish", "Hindi", "Bengali", "Telugu", 
  "Marathi", "Tamil", "Gujarati", "Kannada", "Malayalam", "Punjabi", "French", "German", "Japanese"
];

const STYLES = ["Narration", "Conversational", "Emotional", "News Style", "Storytelling", "Friendly", "Whispering", "Authoritative", "Dramatic"];

export function VoiceUploadCard() {
  const { uploadVoice, isUploading, progress } = useVoiceUpload();
  const [file, setFile] = useState<File | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [selectedGradientIndex, setSelectedGradientIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customLanguage, setCustomLanguage] = useState('');
  const [customStyle, setCustomStyle] = useState('');

  const [formData, setFormData] = useState({
    voiceName: '',
    languages: [] as string[],
    gender: 'Male',
    ageRange: '',
    accent: '',
    styles: [] as string[],
    description: '',
    referenceText: ''
  });

  useEffect(() => {
    setSelectedGradientIndex(Math.floor(Math.random() * WEAVY_PRESETS.length));
  }, []);

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

  const handleAvatarSelect = (file: File | null) => {
    if (file) {
      setAvatarFile(file);
      setAvatarPreviewUrl(URL.createObjectURL(file));
    } else {
      setAvatarFile(null);
      setAvatarPreviewUrl(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({ title: "Error", description: "File size exceeds 10MB limit.", variant: "destructive" });
        return;
      }
      setFile(selectedFile);
      setAudioPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file || !formData.voiceName || formData.languages.length === 0 || formData.styles.length === 0 || formData.description.length < 20) {
      toast({ 
        title: "Validation Error", 
        description: formData.languages.length === 0 
          ? "Please select at least one language."
          : formData.styles.length === 0
          ? "Please select at least one style."
          : "Please fill all required fields.", 
        variant: "destructive" 
      });
      return;
    }

    const success = await uploadVoice(avatarFile, file, {
      ...formData,
      selectedGradientIndex
    } as any);
    
    if (success) {
      setFile(null);
      setAudioPreviewUrl(null);
      setAvatarFile(null);
      setAvatarPreviewUrl(null);
      setSelectedGradientIndex(Math.floor(Math.random() * WEAVY_PRESETS.length));
      setFormData({
        voiceName: '',
        languages: [],
        gender: 'Male',
        ageRange: '',
        accent: '',
        styles: [],
        description: '',
        referenceText: ''
      });
    }
  };

  return (
    <>
      <UploadProgressModal isOpen={isUploading} progress={progress} />
      <Card className="bg-card/50 backdrop-blur-md border-primary/10 overflow-hidden relative group h-fit">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-indigo-600/5 pointer-events-none" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            Create Your AI Voice Profile
          </CardTitle>
          <CardDescription>
            High-quality details help users discover your voice. Assets will be stored in Cloudflare R2.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 relative">
          <div className="flex justify-center">
            <AvatarUpload 
              onAvatarSelect={handleAvatarSelect} 
              avatarPreview={avatarPreviewUrl} 
              onGradientSelect={setSelectedGradientIndex}
              selectedGradientIndex={selectedGradientIndex}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Voice Name</Label>
              <Input 
                placeholder="e.g. Majestic Narrator" 
                value={formData.voiceName}
                onChange={(e) => setFormData({...formData, voiceName: e.target.value})}
                className="rounded-xl bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={formData.gender} onValueChange={(v) => setFormData({...formData, gender: v})}>
                <SelectTrigger className="rounded-xl bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
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
            </Label>
            <div className="flex flex-wrap gap-2 p-4 bg-white/5 border border-white/10 rounded-2xl min-h-[100px] max-h-40 overflow-y-auto scrollbar-hide">
              {PREDEFINED_LANGUAGES.map(lang => (
                <Badge
                  key={lang}
                  variant={formData.languages.includes(lang) ? "default" : "outline"}
                  className="cursor-pointer transition-all"
                  onClick={() => handleToggleLanguage(lang)}
                >
                  {lang}
                </Badge>
              ))}
              {formData.languages.filter(l => !PREDEFINED_LANGUAGES.includes(l)).map(lang => (
                <Badge
                  key={lang}
                  variant="default"
                  className="cursor-pointer bg-indigo-600"
                  onClick={() => handleToggleLanguage(lang)}
                >
                  {lang}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input 
                placeholder="Add other language..." 
                value={customLanguage}
                onChange={(e) => setCustomLanguage(e.target.value)}
                className="h-9 rounded-lg bg-white/5 border-white/10 text-xs"
              />
              <Button variant="secondary" size="sm" onClick={handleAddCustomLanguage}>
                <Plus className="h-3 w-3 mr-1" /> Add
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="h-3 w-3 text-primary" />
                <span>Voice Styles</span>
              </div>
            </Label>
            <div className="flex flex-wrap gap-2 p-4 bg-white/5 border border-white/10 rounded-2xl min-h-[100px] max-h-40 overflow-y-auto scrollbar-hide">
              {STYLES.map(style => (
                <Badge
                  key={style}
                  variant={formData.styles.includes(style) ? "default" : "outline"}
                  className="cursor-pointer transition-all"
                  onClick={() => handleToggleStyle(style)}
                >
                  {style}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input 
                placeholder="Add custom style..." 
                value={customStyle}
                onChange={(e) => setCustomStyle(e.target.value)}
                className="h-9 rounded-lg bg-white/5 border-white/10 text-xs"
              />
              <Button variant="secondary" size="sm" onClick={handleAddCustomStyle}>
                <Plus className="h-3 w-3 mr-1" /> Add
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VoiceStudioTextarea 
              label="Voice Description"
              value={formData.description} 
              onChange={(v) => setFormData({...formData, description: v})} 
              placeholder="Describe your voice tone..."
            />
            <VoiceStudioTextarea 
              label="Reference Text"
              value={formData.referenceText} 
              onChange={(v) => setFormData({...formData, referenceText: v})} 
              placeholder="Provide a sample script..."
            />
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium">30-Second Voice Sample (Cloudflare R2 Upload)</Label>
            <div 
              onClick={() => !file && fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${file ? 'border-primary/50 bg-primary/5' : 'border-white/10 hover:border-primary/50 cursor-pointer'}`}
            >
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                accept=".mp3,.wav" 
                onChange={handleFileChange} 
              />
              <AnimatePresence mode="wait">
                {!file ? (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                    <Mic className="h-10 w-10 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="font-medium text-sm">Click to select voice sample</p>
                    <p className="text-xs text-muted-foreground mt-1">MP3 or WAV, max 10MB</p>
                  </motion.div>
                ) : (
                  <motion.div key="file" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full space-y-4">
                    <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate max-w-[150px]">{file.name}</p>
                          <p className="text-[10px] text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setFile(null); setAudioPreviewUrl(null); }}>
                        <Trash2 className="h-4 w-4 text-destructive/70" />
                      </Button>
                    </div>
                    {audioPreviewUrl && <AudioPreviewPlayer url={audioPreviewUrl} />}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <Button 
            className="w-full h-14 bg-gradient-to-r from-purple-600 to-indigo-600 font-black text-lg shadow-lg shadow-primary/20 rounded-2xl btn-glow" 
            disabled={!file || isUploading || formData.languages.length === 0 || formData.styles.length === 0}
            onClick={handleUpload}
          >
            {isUploading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Upload className="mr-2 h-5 w-5" />}
            {isUploading ? 'Uploading to R2...' : 'Submit Voice Profile'}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
