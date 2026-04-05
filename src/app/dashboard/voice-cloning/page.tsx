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
  const [referenceText, setReferenceText] = useState('');
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
    if (!voiceName || !referenceText || files.length === 0 || !isAgreed) return;
    
    setIsCloning(true);
    setTimeout(() => {
      setIsCloning(false);
      toast({
        title: "Success",
        description: "Voice cloning initiated. You will be notified when it's ready.",
      });
    }, 2000);
  };

  return (
    <div className="max-w-[900px] mx-auto space-y-6 md:space-y-10 pb-20 px-4 md:px-0">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/40 backdrop-blur-[40px] border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden ring-1 ring-white/10"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 md:p-8 border-b border-white/5 bg-white/5 gap-4">
          <div className="flex items-center gap-3 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-white/5 border border-white/10 shadow-lg w-full sm:w-auto">
            <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
              <Mic2 className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-xs md:text-sm font-bold leading-tight">Instant Voice Cloning</p>
              <p className="text-[8px] md:text-[10px] text-muted-foreground uppercase tracking-widest font-black">Professional Studio</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
            <Button 
              onClick={handleClone}
              disabled={!voiceName || !referenceText || files.length === 0 || !isAgreed || isCloning}
              className="w-full sm:w-auto rounded-full h-10 md:h-12 px-6 md:px-10 bg-primary hover:bg-primary/90 font-black text-sm md:text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              {isCloning ? <Loader2 className="mr-2 h-4 w-4 md:h-5 md:w-5 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4 md:h-5 md:w-5" />}
              {isCloning ? 'Processing...' : 'Add Voice'}
            </Button>
          </div>
        </div>

        <div className="p-6 md:p-14 space-y-8 md:space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <div className="space-y-4 md:space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground">Voice Name</Label>
                <Input 
                  placeholder="e.g. My Pro Narrator" 
                  value={voiceName}
                  onChange={(e) => setVoiceName(e.target.value)}
                  className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-white/5 border-white/10 text-base md:text-lg font-medium focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground">Description</Label>
                <Textarea 
                  placeholder="How does this voice sound?" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-24 md:h-28 resize-none rounded-xl md:rounded-2xl bg-white/5 border-white/10 text-sm md:text-base font-medium focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground">Reference Text</Label>
                <Textarea 
                  placeholder="Paste the script provided in your audio samples..." 
                  value={referenceText}
                  onChange={(e) => setReferenceText(e.target.value)}
                  className="h-24 md:h-28 resize-none rounded-xl md:rounded-2xl bg-white/5 border-white/10 text-sm md:text-base font-medium focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              <Label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground">Voice Samples</Label>
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
                className={cn(
                  "h-40 md:h-[320px] border-2 border-dashed rounded-xl md:rounded-[2rem] flex flex-col items-center justify-center transition-all cursor-pointer group",
                  files.length > 0 ? "border-primary/50 bg-primary/5" : "border-white/10 hover:border-primary/30 hover:bg-white/5"
                )}
              >
                <input id="file-upload" type="file" multiple accept="audio/*" className="hidden" onChange={handleFileSelect} />
                <div className="text-center p-4">
                  <div className="mb-2 md:mb-4 inline-flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                    <Upload className="h-5 w-5 md:h-7 md:w-7 text-primary" />
                  </div>
                  <p className="font-bold text-base md:text-lg">Click or Drag Samples</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Upload clear audio for best results.</p>
                </div>
              </div>
            </div>
          </div>

          {files.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {files.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 md:gap-3 min-w-0">
                    <FileAudio className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0" />
                    <span className="text-[10px] md:text-sm font-bold truncate">{file.name}</span>
                  </div>
                  <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-white transition-colors">
                    <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="pt-6 md:pt-10 border-t border-white/5">
            <label className="flex items-start gap-3 md:gap-4 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={isAgreed} 
                onChange={(e) => setIsCheck(e.target.checked)}
                className="mt-1 h-4 w-4 md:h-5 md:w-5 rounded border-white/10 bg-white/5 text-primary focus:ring-primary/20"
              />
              <div className="flex-1">
                <p className="text-[10px] md:text-sm font-bold group-hover:text-primary transition-colors">I confirm that I have the necessary rights to clone this voice.</p>
                <p className="text-[9px] md:text-xs text-muted-foreground mt-1">Cloning without permission violates our Terms of Service.</p>
              </div>
            </label>
          </div>
        </div>
      </motion.div>

      <div className="bg-primary/5 border border-primary/10 rounded-xl md:rounded-[2rem] p-6 md:p-8 flex items-start gap-4 md:gap-6">
        <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <Info className="h-5 w-5 md:h-6 md:w-6 text-primary" />
        </div>
        <div>
          <h4 className="font-black text-base md:text-lg uppercase tracking-widest text-primary mb-2">Cloning Best Practices</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-[10px] md:text-sm text-muted-foreground font-medium">
            <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 text-primary" /> High-quality recordings only.</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 text-primary" /> Multiple samples for range.</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 text-primary" /> 1-5 minutes of audio total.</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 text-primary" /> Minimal background noise.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
