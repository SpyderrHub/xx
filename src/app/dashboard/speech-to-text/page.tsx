'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Ear, 
  Upload, 
  FileAudio, 
  X, 
  Loader2, 
  CheckCircle2, 
  Download, 
  FileText,
  Zap,
  Sparkles,
  Globe
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useFirebase } from '@/firebase';

const TranscriptionEditor = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    onChange(e.currentTarget.innerText);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex-1 flex flex-col">
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        suppressContentEditableWarning
        className="w-full flex-1 min-h-[300px] md:min-h-[500px] p-0 text-[18px] md:text-[22px] text-left leading-relaxed outline-none whitespace-pre-wrap bg-transparent placeholder:text-muted-foreground/20 font-medium text-white/90 selection:bg-primary/30 border-none resize-none focus:ring-0 scrollbar-hide"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {value}
      </div>
      {value.length === 0 && (
        <div className="absolute top-0 left-0 pointer-events-none text-muted-foreground/20 text-[18px] md:text-[22px] italic font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
          Transcription output will appear here once processing is complete...
        </div>
      )}
    </div>
  );
};

export default function SpeechToTextPage() {
  const { user } = useFirebase();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState('');

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('audio/')) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleTranscribe = async () => {
    if (!file || !user) {
      toast({ title: "Input Required", description: "Please upload an audio file.", variant: "destructive" });
      return;
    }
    
    setIsProcessing(true);
    setProcessingStage('INITIALIZING');
    setTranscription('');

    try {
      const idToken = await user.getIdToken();
      let audioSourceUrl = '';

      // 1. Upload to R2
      setProcessingStage('UPLOADING');
      const fileName = `${crypto.randomUUID()}-${file.name}`;
      const presignRes = await fetch('/api/r2/presign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          fileName,
          contentType: file.type,
          path: 'stt',
        }),
      });

      const presignData = await presignRes.json();
      if (!presignRes.ok) throw new Error(presignData.message || 'Storage authorization failed');

      const uploadRes = await fetch(presignData.presignedUrl, {
        method: 'PUT',
        headers: { 
          'Content-Type': presignData.enforcedMimeType || file.type,
          'Cache-Control': 'public, max-age=31536000, immutable'
        },
        body: file,
      });

      if (!uploadRes.ok) throw new Error("Failed to upload audio to storage.");
      audioSourceUrl = presignData.signedReadUrl;

      setProcessingStage('PROCESSING');

      // 2. Direct fetch to proxy - Wait until final result is returned
      const response = await fetch('/api/stt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ 
          audio_path: audioSourceUrl,
          isYoutube: false
        }),
      });

      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Transcription failed');
        }

        const resultText = data.text || data.transcription || data.output || "";
          
        if (!resultText) {
          throw new Error("No transcription text was found in the response.");
        }

        setTranscription(resultText);
        toast({ title: "Success", description: "Transcription complete." });
      }
    } catch (error: any) {
      console.error('Transcription error:', error);
      toast({
        title: "Process Error",
        description: error.message || "Failed to process content.",
        variant: "destructive"
      });
    } finally {
      setProcessingStage(null);
      setIsProcessing(false);
    }
  };

  const handleExport = () => {
    if (!transcription) return;
    const blob = new Blob([transcription], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcription_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-auto lg:h-[calc(100vh-theme(spacing.32))] -mx-4 sm:-mx-6 lg:-mx-10 -mb-4 sm:-mb-6 lg:-mb-10 overflow-hidden bg-transparent">
      {/* Top Studio Header */}
      <div className="shrink-0 z-40 glass-card border border-white/5 py-4 px-4 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 mt-4 md:mt-6 mx-4 md:mx-6 rounded-2xl">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
            <Ear className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-wider">Speech to Text Studio</h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Neural Engine v2.1</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          {transcription && (
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-mono text-muted-foreground uppercase">
              <span className="text-primary font-black">{transcription.split(' ').length}</span>
              Words
            </div>
          )}
          <Button 
            onClick={handleTranscribe}
            disabled={!file || isProcessing}
            className="flex-1 sm:flex-none h-12 px-8 rounded-xl bg-primary btn-glow font-black text-sm"
          >
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4 fill-current" />}
            {isProcessing ? (processingStage || 'Processing...') : 'Transcribe'}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Left: Main Transcription Workspace (Center) */}
        <main className="flex-1 flex flex-col p-6 md:p-14 overflow-y-auto scrollbar-hide bg-transparent order-2 lg:order-1">
          <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col space-y-6">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Transcription Output</label>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-muted-foreground">{transcription.length} Characters</span>
              </div>
            </div>
            
            <TranscriptionEditor value={transcription} onChange={setTranscription} />
          </div>
        </main>

        {/* Right: Fixed Unified Sidebar (Stacks on top on mobile for workflow flow) */}
        <aside className="w-full lg:w-[400px] border-l border-white/10 bg-transparent overflow-y-auto scrollbar-hide backdrop-blur-md order-1 lg:order-2">
          <div className="p-6 md:p-8 space-y-10">
            {/* Section: Audio Source */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-black uppercase tracking-widest text-white">Audio Source</h3>
              </div>

              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                onClick={() => !file && document.getElementById('audio-upload-sidebar')?.click()}
                className={cn(
                  "h-48 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all cursor-pointer group",
                  file ? "border-primary/50 bg-primary/5" : "border-white/10 hover:border-primary/30 hover:bg-white/5"
                )}
              >
                <input id="audio-upload-sidebar" type="file" accept="audio/*" className="hidden" onChange={handleFileSelect} />
                <div className="text-center p-6">
                  {file ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <FileAudio className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-xs text-white truncate max-w-[200px]">{file.name}</p>
                        <p className="text-[9px] text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="h-8 text-[9px] uppercase font-black text-destructive hover:bg-destructive/10 hover:text-destructive">
                        <X className="h-3 w-3 mr-1" /> Remove
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <p className="font-bold text-sm">Select Audio File</p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-1">MP3, WAV up to 50MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* Section: Language Model */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-black uppercase tracking-widest text-white">Language Model</h3>
              </div>
              
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Auto-Detection</p>
                    <p className="text-[9px] text-muted-foreground italic">Neural Engine Enabled</p>
                  </div>
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* Section: Actions */}
            <div className="space-y-4 pt-4">
              <Button 
                variant="outline" 
                className="w-full h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 font-black text-[10px] uppercase tracking-widest"
                disabled={!transcription}
                onClick={handleExport}
              >
                <Download className="mr-2 h-4 w-4" /> Export Text
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
