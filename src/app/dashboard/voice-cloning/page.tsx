'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Upload, 
  Mic2, 
  X, 
  Loader2,
  FileAudio,
  Zap,
  Sparkles,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function VoiceCloningPage() {
  const [voiceName, setVoiceName] = useState('');
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
    // Simulation of cloning process
    setTimeout(() => {
      setIsCloning(false);
      toast({
        title: "Success",
        description: "Voice cloning initiated. You will be notified when it's ready.",
      });
    }, 2000);
  };

  return (
    <div className="flex flex-col h-auto lg:h-[calc(100vh-theme(spacing.32))] -mx-4 sm:-mx-6 lg:-mx-10 -mb-4 sm:-mb-6 lg:-mb-10 overflow-hidden bg-transparent">
      {/* Top Studio Header */}
      <div className="shrink-0 z-40 glass-card border border-white/5 py-4 px-4 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 mt-4 md:mt-6 mx-4 md:mx-6 rounded-2xl">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
            <Mic2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-wider">Voice Cloning Studio</h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Identity Engine v2.1</p>
          </div>
        </div>

        <Button 
          onClick={handleClone}
          disabled={!voiceName || !referenceText || files.length === 0 || !isAgreed || isCloning}
          className="w-full sm:w-auto h-12 px-8 rounded-xl bg-primary btn-glow font-black text-sm"
        >
          {isCloning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4 fill-current" />}
          {isCloning ? 'Processing...' : 'Create Voice Clone'}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Left: Main Script Area (Center) - Dedicated to Reference Text */}
        <main className="flex-1 flex flex-col p-6 md:p-14 overflow-y-auto scrollbar-hide bg-transparent order-2 lg:order-1">
          <div className="max-w-4xl w-full mx-auto space-y-6">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Reference Script</label>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">{referenceText.length} Characters</span>
            </div>
            <textarea
              value={referenceText}
              onChange={(e) => setReferenceText(e.target.value)}
              placeholder="Paste the exact script of what the speaker says in your uploaded samples. This text is used to map your voice characteristics accurately..."
              className="w-full min-h-[300px] md:min-h-[600px] p-0 text-[18px] md:text-[22px] text-left leading-relaxed outline-none bg-transparent placeholder:text-muted-foreground/20 font-medium text-white/90 selection:bg-primary/30 border-none resize-none focus:ring-0"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>
        </main>

        {/* Right: Fixed Unified Sidebar */}
        <aside className="w-full lg:w-[400px] border-l border-white/10 bg-transparent overflow-y-auto scrollbar-hide backdrop-blur-md order-1 lg:order-2">
          <div className="p-6 md:p-8 space-y-10">
            {/* Section: Identity */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-black uppercase tracking-widest text-white">Voice Identity</h3>
              </div>
              
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Voice Name</Label>
                <Input 
                  placeholder="e.g. My Custom Narrator" 
                  value={voiceName}
                  onChange={(e) => setVoiceName(e.target.value)}
                  className="h-14 bg-white/5 border-white/10 rounded-2xl text-lg font-bold px-6 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* Section: Uploads */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Upload className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-black uppercase tracking-widest text-white">Voice Samples</h3>
              </div>

              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
                className={cn(
                  "h-48 md:h-56 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center transition-all cursor-pointer group",
                  files.length > 0 ? "border-primary/50 bg-primary/5" : "border-white/10 hover:border-primary/30 hover:bg-white/5"
                )}
              >
                <input id="file-upload" type="file" multiple accept="audio/*" className="hidden" onChange={handleFileSelect} />
                <div className="text-center p-6">
                  <div className="mb-4 inline-flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                    <Upload className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                  </div>
                  <p className="font-bold text-base md:text-lg">Upload Samples</p>
                  <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-widest font-black">MP3 / WAV • Max 5 Files</p>
                </div>
              </div>

              <AnimatePresence>
                {files.length > 0 && (
                  <div className="space-y-3">
                    {files.map((file, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <FileAudio className="h-4 w-4 text-primary shrink-0" />
                          <span className="text-xs font-bold truncate">{file.name}</span>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="text-muted-foreground hover:text-white transition-colors p-1">
                          <X className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-px bg-white/5" />

            {/* Section: Security */}
            <div className="space-y-5">
              <label className="flex items-start gap-4 cursor-pointer group p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <input 
                  type="checkbox" 
                  checked={isAgreed} 
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded-lg border-white/10 bg-white/5 text-primary focus:ring-primary/20"
                />
                <div className="flex-1">
                  <p className="text-xs font-bold group-hover:text-primary transition-colors leading-tight">I confirm I have explicit permission to clone this voice.</p>
                </div>
              </label>
              
              <div className="flex items-start gap-3 text-muted-foreground px-2">
                <ShieldCheck className="h-5 w-5 text-primary/40 shrink-0" />
                <p className="text-[10px] font-medium leading-relaxed italic">
                  Private cloning ensures your neural data is encrypted and secure.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
