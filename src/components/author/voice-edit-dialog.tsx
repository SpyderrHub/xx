
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Save, Loader2, Globe } from 'lucide-react';
import { VoiceDescriptionTextarea } from './voice-description-textarea';
import { useVoiceUpdate } from '@/hooks/use-voice-update';

const LANGUAGES = [
  "English, US", "English, UK", "English, India", "Spanish", "Hindi", "Bengali", "Telugu", 
  "Marathi", "Tamil", "Gujarati", "Kannada", "Malayalam", "Punjabi", "French", "German", "Japanese"
];

interface VoiceEditDialogProps {
  voice: any;
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceEditDialog({ voice, isOpen, onClose }: VoiceEditDialogProps) {
  const { updateVoice, isUpdating } = useVoiceUpdate();
  const [formData, setFormData] = useState({
    voiceName: voice.voiceName || '',
    languages: Array.isArray(voice.languages) ? voice.languages : [voice.language].filter(Boolean),
    gender: voice.gender || 'Male',
    style: voice.style || 'Narration',
    description: voice.description || ''
  });

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

  const handleSave = async () => {
    const success = await updateVoice(voice.id, formData);
    if (success) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl bg-card/95 backdrop-blur-2xl border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Edit Voice Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
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
              <span>Supported Languages</span>
              <span className="text-[10px] text-muted-foreground uppercase font-black">Select Multiple</span>
            </Label>
            <div className="flex flex-wrap gap-2 p-3 bg-white/5 border border-white/10 rounded-xl max-h-32 overflow-y-auto">
              {LANGUAGES.map(lang => (
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
            </div>
          </div>

          <div className="space-y-2">
            <Label>Voice Style</Label>
            <Select value={formData.style} onValueChange={(v) => setFormData({...formData, style: v})}>
              <SelectTrigger className="bg-white/5 border-white/10 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Narration", "Conversational", "Emotional", "News Style", "Storytelling", "Friendly"].map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <VoiceDescriptionTextarea 
            value={formData.description} 
            onChange={(v) => setFormData({...formData, description: v})} 
          />
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} disabled={isUpdating}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            disabled={isUpdating || formData.languages.length === 0}
            className="bg-primary hover:bg-primary/90 min-w-[120px]"
          >
            {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
