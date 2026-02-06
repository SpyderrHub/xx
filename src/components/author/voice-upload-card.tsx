
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Mic, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import { AudioPreviewPlayer } from './audio-preview-player';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

export function VoiceUploadCard() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    voiceName: '',
    language: 'English, US',
    gender: 'Male',
    ageRange: 'Middle-Aged',
    accent: '',
    style: 'Narration'
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({ title: "Error", description: "File size exceeds 10MB limit.", variant: "destructive" });
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file || !formData.voiceName) {
      toast({ title: "Validation Error", description: "Please fill all fields and select a voice sample.", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    // Simulation of upload logic
    setTimeout(() => {
      setIsUploading(false);
      setFile(null);
      setPreviewUrl(null);
      setFormData({
        voiceName: '',
        language: 'English, US',
        gender: 'Male',
        ageRange: 'Middle-Aged',
        accent: '',
        style: 'Narration'
      });
      toast({ title: "Success", description: "Voice sample uploaded successfully. It is now pending review." });
    }, 2000);
  };

  return (
    <Card className="bg-card/50 backdrop-blur-md border-primary/10 overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Upload Your Voice Sample
        </CardTitle>
        <CardDescription>
          Submit a high-quality 30-second clean voice recording.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Voice Name</Label>
            <Input 
              placeholder="e.g. Majestic Narrator" 
              value={formData.voiceName}
              onChange={(e) => setFormData({...formData, voiceName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label>Language</Label>
            <Select value={formData.language} onValueChange={(v) => setFormData({...formData, language: v})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="English, US">English, US</SelectItem>
                <SelectItem value="English, UK">English, UK</SelectItem>
                <SelectItem value="Hindi">Hindi</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Gender</Label>
            <Select value={formData.gender} onValueChange={(v) => setFormData({...formData, gender: v})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
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
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Narration">Narration</SelectItem>
                <SelectItem value="Conversational">Conversational</SelectItem>
                <SelectItem value="Emotional">Emotional</SelectItem>
                <SelectItem value="News Style">News Style</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

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
                <Mic className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="font-medium">Click to select voice sample</p>
                <p className="text-sm text-muted-foreground mt-1">MP3 or WAV, max 10MB</p>
              </motion.div>
            ) : (
              <motion.div 
                key="file"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                    <div>
                      <p className="font-medium truncate max-w-[200px]">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => { setFile(null); setPreviewUrl(null); }}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                {previewUrl && <AudioPreviewPlayer url={previewUrl} />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button 
          className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 font-bold" 
          disabled={!file || isUploading}
          onClick={handleUpload}
        >
          {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
          Upload Voice Sample
        </Button>
      </CardContent>
    </Card>
  );
}
