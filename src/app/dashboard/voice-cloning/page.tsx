'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Upload, 
  Mic2, 
  CheckCircle2, 
  X, 
  Loader2,
  FileAudio,
  Zap,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function VoiceCloningPage() {
  const [voiceName, setVoiceName] = useState('');
  const [description, setDescription] = useState('');
  const [referenceText, setReferenceText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isCloning, setIsCloning] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

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
    if (!voiceName || !referenceText || files.length === 0 || !isAgreed) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields, upload samples, and agree to the terms.",
        variant: "destructive"
      });
      return;
    }
    
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
    <div className="flex flex-col min-h-[calc(100dvh-theme(spacing.16))] pb-32">
      {/* Top Studio Header */}
      <div className="sticky top-16 z-40 glass-card border-b border-white/5 py-4 mb-6 md:mb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
              <Mic2 className="h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <h2 className="text-sm font-black text-white">Voice Cloning Studio</h2>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">v2.1 Identity Engine</p>
            </div>
          </div>

          <Button 
            onClick={handleClone}
            disabled={!voiceName || !referenceText || files.length === 0 || !isAgreed || isCloning}
            className="h-12 px-8 rounded-xl bg-primary btn-glow font-black text-sm"
          >
            {isCloning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4 fill-current" />}
            {isCloning ? 'Processing...' : 'Add Voice Profile'}
          </Button>
        </div>
      </div>

      <main className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left/Center: Borderless Text Area for Reference Script */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Reference Script</label>
              <span className="text-[10px] font-mono text-muted-foreground">{referenceText.length} Characters</span>
            </div>
            <textarea
              value={referenceText}
              onChange={(e) => setReferenceText(e.target.value)}
              placeholder="Paste the script used in your audio samples here. This helps our neural engine map your voice to text accurately..."
              className="w-full min-h-[500px] p-0 text-[20px] text-left leading-relaxed outline-none bg-transparent placeholder:text-muted-foreground/20 font-medium text-white/90 selection:bg-primary/30 border-none resize-none focus:ring-0 scrollbar-hide"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          {/* Single Unified Sidebar */}
          <aside className="lg:col-span-4">
            <div className="glass-card rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col h-fit">
              {/* Identity Section */}
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-white">Voice Identity</h3>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Voice Name</Label>
                  <Input 
                    placeholder="e.g. My Pro Narrator" 
                    value={voiceName}
                    onChange={(e) => setVoiceName(e.target.value)}
                    className="h-12 bg-white/5 border-white/10 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Description</Label>
                  <Textarea 
                    placeholder="Describe the tone..." 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="h-24 resize-none bg-white/5 border-white/10 rounded-xl"
                  />
                </div>
              </div>

              <div className="h-px bg-white/5 mx-8" />

              {/* Upload Section */}
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Upload className="h-4 w-4 text-primary" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-white">Voice Samples</h3>
                </div>

                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={onDrop}
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className={cn(
                    "h-44 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer group",
                    files.length > 0 ? "border-primary/50 bg-primary/5" : "border-white/10 hover:border-primary/30 hover:bg-white/5"
                  )}
                >
                  <input id="file-upload" type="file" multiple accept="audio/*" className="hidden" onChange={handleFileSelect} />
                  <div className="text-center p-4">
                    <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-bold text-sm">Upload Samples</p>
                    <p className="text-[9px] text-muted-foreground mt-1 uppercase tracking-tighter">MP3 or WAV • Max 5 Files</p>
                  </div>
                </div>

                <AnimatePresence>
                  {files.length > 0 && (
                    <div className="space-y-2">
                      {files.map((file, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FileAudio className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span className="text-[10px] font-bold truncate">{file.name}</span>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="text-muted-foreground hover:text-white transition-colors p-1">
                            <X className="h-3 w-3" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <div className="h-px bg-white/5 mx-8" />

              {/* Consent Section */}
              <div className="p-8 space-y-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={isAgreed} 
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary/20"
                  />
                  <div className="flex-1">
                    <p className="text-[10px] font-bold group-hover:text-primary transition-colors leading-tight">I confirm that I have the necessary rights to clone this voice.</p>
                  </div>
                </label>
                
                <div className="pt-2 flex items-start gap-3 text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary/40 shrink-0" />
                  <p className="text-[9px] font-medium leading-relaxed italic">
                    Your samples are used exclusively for neural training and are stored on secure R2 encrypted buckets.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
