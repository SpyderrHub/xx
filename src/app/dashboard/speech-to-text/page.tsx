'use client';

import { useState, useRef, useCallback } from 'react';
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
  Languages,
  Zap
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Component for the high-end Roboto 20px editor (matches TTS page)
const TranscriptionEditor = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    onChange(e.currentTarget.innerText);
  };

  return (
    <div className="relative group">
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        suppressContentEditableWarning
        className="w-full min-h-[400px] p-0 text-[20px] leading-relaxed outline-none whitespace-pre-wrap bg-transparent placeholder:text-muted-foreground/50 font-medium text-white/90"
        style={{ fontFamily: "'Roboto', sans-serif" }}
        data-placeholder="Your transcription will appear here..."
      >
        {value}
      </div>
      {value.length === 0 && (
        <div className="absolute top-0 left-0 pointer-events-none text-muted-foreground/30 text-[20px] italic font-medium" style={{ fontFamily: "'Roboto', sans-serif" }}>
          Transcription output will appear here once processing is complete...
        </div>
      )}
    </div>
  );
};

export default function SpeechToTextPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState('');
  const [language, setLanguage] = useState('english');

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

  const handleTranscribe = () => {
    if (!file || isProcessing) return;
    
    setIsProcessing(true);
    // Simulate high-fidelity transcription
    setTimeout(() => {
      setTranscription("Experience the power of Saanchi AI voices. Our advanced speech-to-text engine captures every nuance, punctuation, and speaker transition with studio-grade accuracy. This transcribed text can now be edited or exported for your convenience.");
      setIsProcessing(false);
      toast({
        title: "Transcription Complete",
        description: "Your audio has been successfully converted to text.",
      });
    }, 2500);
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
                <Ear className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold leading-tight">AI Speech to Text</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Transcription Studio</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="rounded-full h-12 px-6 border-white/10 bg-white/5 hover:bg-white/10 hidden sm:flex font-bold"
              disabled={!transcription}
              onClick={handleExport}
            >
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button 
              onClick={handleTranscribe}
              disabled={!file || isProcessing}
              className="rounded-full h-12 px-10 bg-primary hover:bg-primary/90 font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Zap className="mr-2 h-5 w-5 fill-current" />}
              {isProcessing ? 'Processing...' : 'Transcribe'}
            </Button>
          </div>
        </div>

        {/* Studio Content Area */}
        <div className="p-10 md:p-14 space-y-10">
          {!transcription && (
            <div className="space-y-8">
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                onClick={() => !file && document.getElementById('audio-upload')?.click()}
                className={cn(
                  "h-64 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center transition-all cursor-pointer group",
                  file ? "border-primary/50 bg-primary/5" : "border-white/10 hover:border-primary/30 hover:bg-white/5"
                )}
              >
                <input id="audio-upload" type="file" accept="audio/*" className="hidden" onChange={handleFileSelect} />
                <div className="text-center p-6">
                  {file ? (
                    <div className="space-y-4">
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 border border-primary/30">
                        <FileAudio className="h-8 w-8 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-xl text-white">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to transcribe</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-destructive hover:text-destructive/80 font-bold uppercase tracking-widest text-[10px]">
                        <X className="h-3.5 w-3.5 mr-1" /> Remove File
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                        <Upload className="h-8 w-8 text-primary" />
                      </div>
                      <p className="font-bold text-2xl text-white">Upload Audio File</p>
                      <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">Drag and drop your audio here or click to browse. Supports MP3, WAV, and M4A.</p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-1/2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Audio Language</label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="h-14 rounded-2xl bg-white/5 border-white/10 text-base font-bold">
                      <Languages className="h-4 w-4 mr-2 text-primary" />
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-white/10 bg-black/90 backdrop-blur-xl">
                      <SelectItem value="english">English (Global)</SelectItem>
                      <SelectItem value="hindi">Hindi (Indian)</SelectItem>
                      <SelectItem value="spanish">Spanish (Latin)</SelectItem>
                      <SelectItem value="french">French (Standard)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-1/2 flex items-center justify-center p-6 rounded-2xl bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-3 text-sm font-bold text-primary">
                    <CheckCircle2 className="h-5 w-5" />
                    High-Fidelity Neural Engine
                  </div>
                </div>
              </div>
            </div>
          )}

          {transcription && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                  <p className="text-sm font-bold text-white">Transcription Complete</p>
                </div>
                <Button variant="ghost" onClick={() => { setTranscription(''); setFile(null); }} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white">
                  Start New
                </Button>
              </div>

              <TranscriptionEditor value={transcription} onChange={setTranscription} />
              
              <div className="flex justify-between items-center pt-8 border-t border-white/5">
                <div className="flex gap-4">
                  <Button variant="ghost" size="sm" className="text-xs font-bold text-muted-foreground hover:text-white uppercase tracking-widest">
                    <FileText className="h-3.5 w-3.5 mr-2 text-primary" /> Timestamps
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs font-bold text-muted-foreground hover:text-white uppercase tracking-widest">
                    <Ear className="h-3.5 w-3.5 mr-2 text-primary" /> Diarization
                  </Button>
                </div>
                <div className="text-xs font-mono font-black tracking-[0.2em] px-3 py-1 rounded-full bg-white/5 border border-white/5 text-muted-foreground/50">
                  {transcription.split(' ').length} WORDS
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Feature Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Neural Accuracy", desc: "Industry-leading error rates for any audio.", icon: Ear },
          { title: "Multi-Speaker", desc: "Automatically identify different voices.", icon: Zap },
          { title: "Instant Export", desc: "Download as TXT, SRT, or VTT files.", icon: FileText },
        ].map((feature, i) => (
          <div key={i} className="p-6 rounded-[2rem] bg-white/5 border border-white/10 flex items-start gap-4">
            <feature.icon className="h-5 w-5 text-primary mt-1" />
            <div>
              <h5 className="text-sm font-black uppercase tracking-widest text-white">{feature.title}</h5>
              <p className="text-xs text-muted-foreground mt-1">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
