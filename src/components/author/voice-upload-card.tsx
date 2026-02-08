
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Mic, Trash2, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { AudioPreviewPlayer } from './audio-preview-player';
import { AvatarUpload } from './avatar-upload';
import { VoiceDescriptionTextarea } from './voice-description-textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { useVoiceUpload } from '@/hooks/use-voice-upload';
import { UploadProgressModal } from './upload-progress-modal';

export function VoiceUploadCard() {
  const { uploadVoice, isUploading, progress } = useVoiceUpload();
  const [file, setFile] = useState<File | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    voiceName: '',
    language: 'English, US',
    gender: 'Male',
    ageRange: 'Middle-Aged',
    accent: '',
    style: 'Narration',
    description: ''
  });

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
    if (!file || !formData.voiceName || formData.description.length < 20) {
      toast({ 
        title: "Validation Error", 
        description: formData.description.length < 20 
          ? "Description must be at least 20 characters." 
          : "Please fill all required fields and select a voice sample.", 
        variant: "destructive" 
      });
      return;
    }

    const success = await uploadVoice(avatarFile, file, formData);
    
    if (success) {
      setFile(null);
      setAudioPreviewUrl(null);
      setAvatarFile(null);
      setAvatarPreviewUrl(null);
      setFormData({
        voiceName: '',
        language: 'English, US',
        gender: 'Male',
        ageRange: 'Middle-Aged',
        accent: '',
        style: 'Narration',
        description: ''
      });
    }
  };

  return (
    <>
      <UploadProgressModal isOpen={isUploading} progress={progress} />
      <Card className="bg-card/50 backdrop-blur-md border-primary/10 overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-indigo-600/5 pointer-events-none" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            Create Your AI Voice Profile
          </CardTitle>
          <CardDescription>
            Provide high-quality details to help users discover your voice.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 relative">
          <div className="flex justify-center">
            <AvatarUpload 
              onAvatarSelect={handleAvatarSelect} 
              avatarPreview={avatarPreviewUrl} 
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
              <Label>Language</Label>
              <Select value={formData.language} onValueChange={(v) => setFormData({...formData, language: v})}>
                <SelectTrigger className="rounded-xl bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="English, US">English, US</SelectItem>
                  <SelectItem value="English, UK">English, UK</SelectItem>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="space-y-2">
              <Label>Style</Label>
              <Select value={formData.style} onValueChange={(v) => setFormData({...formData, style: v})}>
                <SelectTrigger className="rounded-xl bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Narration">Narration</SelectItem>
                  <SelectItem value="Conversational">Conversational</SelectItem>
                  <SelectItem value="Emotional">Emotional</SelectItem>
                  <SelectItem value="News Style">News Style</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <VoiceDescriptionTextarea 
            value={formData.description} 
            onChange={(v) => setFormData({...formData, description: v})} 
          />

          <div className="space-y-4">
            <Label className="text-sm font-medium">30-Second Voice Sample</Label>
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
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <Mic className="h-10 w-10 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="font-medium text-sm">Click to select 30s voice sample</p>
                    <p className="text-xs text-muted-foreground mt-1">MP3 or WAV, max 10MB</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="file"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full space-y-4"
                  >
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
                        <Trash2 className="h-4 w-4 text-destructive/70 hover:text-destructive transition-colors" />
                      </Button>
                    </div>
                    {audioPreviewUrl && <AudioPreviewPlayer url={audioPreviewUrl} />}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <motion.div 
            whileHover={{ scale: 1.01 }} 
            whileTap={{ scale: 0.99 }}
          >
            <Button 
              className="w-full h-14 bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-lg shadow-lg shadow-primary/20 rounded-xl" 
              disabled={!file || isUploading || formData.description.length < 20}
              onClick={handleUpload}
            >
              {isUploading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Upload className="mr-2 h-5 w-5" />
              )}
              {isUploading ? 'Uploading Profile...' : 'Submit Voice Profile'}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </>
  );
}
