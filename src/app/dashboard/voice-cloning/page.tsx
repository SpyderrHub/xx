'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Upload, 
  Mic2, 
  Info, 
  CheckCircle2, 
  X, 
  Loader2,
  FileAudio
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function VoiceCloningPage() {
  const [voiceName, setVoiceName] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isCloning, setIsCloning] = useState(false);
  const [isAgreed, setIsCheck] = useState(false);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('audio/'));
    setFiles(prev => [...prev, ...droppedFiles].slice(0, 5));
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(f => f.type.startsWith('audio/'));
      setFiles(prev => [...prev, ...selectedFiles].slice(0, 5));
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleClone = async () => {
    if (!voiceName || files.length === 0 || !isAgreed) return;
    
    setIsCloning(true);
    // Simulate process
    setTimeout(() => {
      setIsCloning(false);
      toast({
        title: "Success",
        description: "Voice cloning initiated. You will be notified when it's ready.",
      });
    }, 2000);
  };

  return (
    <div className="max-w-[900px] mx-auto space-y-10 pb-20 px-4 md:px-0">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/40 backdrop-blur-[40px] border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden ring-1 ring-white/10"
      >
        {/* Top Action Bar */}
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 shadow-lg">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                <Mic2 className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold leading-tight">Instant Voice Cloning</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Professional Studio</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              onClick={handleClone}
              disabled={!voiceName || files.length === 0 || !isAgreed || isCloning}
              className="rounded-full h-12 px-10 bg-primary hover:bg-primary/90 font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              {isCloning ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle2 className="mr-2 h-5 w-5" />}
              {isCloning ? 'Processing...' : 'Add Voice'}
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-10 md:p-14 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Voice Name</Label>
                <Input 
                  placeholder="e.g. My Professional Narrator" 
                  value={voiceName}
                  onChange={(e) => setVoiceName(e.target.value)}
                  className="h-14 rounded-2xl bg-white/5 border-white/10 text-lg font-medium focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Description (Optional)</Label>
                <Textarea 
                  placeholder="How does this voice sound? (e.g. Calm, Deep, Energetic)" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-32 resize-none rounded-2xl bg-white/5 border-white/10 text-base font-medium focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-6">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Voice Samples (MP3/WAV)</Label>
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
                className={cn(
                  "h-56 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all cursor-pointer group",
                  files.length > 0 ? "border-primary/50 bg-primary/5" : "border-white/10 hover:border-primary/30 hover:bg-white/5"
                )}
              >
                <input id="file-upload" type="file" multiple accept="audio/*" className="hidden" onChange={handleFileSelect} />
                <div className="text-center p-6">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                    <Upload className="h-7 w-7 text-primary" />
                  </div>
                  <p className="font-bold text-lg">Click or Drag Samples</p>
                  <p className="text-xs text-muted-foreground mt-1">Upload at least 1 minute of clear audio for best results.</p>
                </div>
              </div>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileAudio className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm font-bold truncate">{file.name}</span>
                  </div>
                  <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-white transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Rights Confirmation */}
          <div className="pt-10 border-t border-white/5">
            <label className="flex items-start gap-4 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={isAgreed} 
                onChange={(e) => setIsCheck(e.target.checked)}
                className="mt-1 h-5 w-5 rounded-md border-white/10 bg-white/5 text-primary focus:ring-primary/20"
              />
              <div className="flex-1">
                <p className="text-sm font-bold group-hover:text-primary transition-colors">I confirm that I have the necessary rights to clone this voice.</p>
                <p className="text-xs text-muted-foreground mt-1">Cloning someone else's voice without their explicit permission is a violation of our Terms of Service.</p>
              </div>
            </label>
          </div>
        </div>
      </motion.div>

      {/* Info Card */}
      <div className="bg-primary/5 border border-primary/10 rounded-[2rem] p-8 flex items-start gap-6">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <Info className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h4 className="font-black text-lg uppercase tracking-widest text-primary mb-2">Cloning Best Practices</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground font-medium">
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Use high-quality recordings without background noise.</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Include multiple samples for varied emotional range.</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Recordings should be between 1-5 minutes total.</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Maintain consistent microphone distance.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
