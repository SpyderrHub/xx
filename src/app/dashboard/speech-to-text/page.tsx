'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Zap,
  Youtube,
  Link as LinkIcon,
  Sparkles
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
        className="w-full flex-1 min-h-[500px] p-0 text-[20px] md:text-[22px] text-left leading-relaxed outline-none whitespace-pre-wrap bg-transparent placeholder:text-muted-foreground/20 font-medium text-white/90 selection:bg-primary/30 border-none resize-none focus:ring-0 scrollbar-hide"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {value}
      </div>
      {value.length === 0 && (
        <div className="absolute top-0 left-0 pointer-events-none text-muted-foreground/20 text-[20px] md:text-[22px] italic font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
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
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [transcription, setTranscription] = useState('');
  const [language, setLanguage] = useState('english');
  const [activeTab, setActiveTab] = useState('upload');

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
    const isYoutube = activeTab === 'youtube';
    const source = isYoutube ? youtubeUrl : file;

    if (!source || !user) {
      toast({ title: "Input Required", description: isYoutube ? "Please enter a valid YouTube URL." : "Please upload an audio file.", variant: "destructive" });
      return;
    }
    
    setIsProcessing(true);
    setProcessingStage('INITIALIZING');
    setTranscription('');

    try {
      const idToken = await user.getIdToken();
      let audioSourceUrl = isYoutube ? youtubeUrl : '';

      // 1. If it's a file, upload to R2
      if (!isYoutube && file) {
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
      }

      setProcessingStage('PROCESSING');

      // 2. Direct fetch to proxy - Wait until final result is returned
      const response = await fetch('/api/stt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ 
          audio_url: audioSourceUrl,
          isYoutube: isYoutube
        }),
      });

      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Transcription failed');
        }

        // Parse result text based on common keys
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
    <div className="flex flex-col h-[calc(100vh-theme(spacing.32))] -mx-4 sm:-mx-6 lg:-mx-10 -mb-4 sm:-mb-6 lg:-mb-10 overflow-hidden bg-transparent">
      {/* Top Studio Header */}
      <div className="shrink-0 z-40 glass-card border border-white/5 py-4 px-6 md:px-10 flex items-center justify-between gap-6 mt-6 mx-6 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
            <Ear className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-wider">Speech to Text Studio</h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Neural Engine v2.1</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {transcription && (
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-mono text-muted-foreground uppercase">
              <span className="text-primary font-black">{transcription.split(' ').length}</span>
              Words Processed
            </div>
          )}
          <Button 
            onClick={handleTranscribe}
            disabled={(activeTab === 'upload' ? !file : !youtubeUrl) || isProcessing}
            className="h-12 px-8 rounded-xl bg-primary btn-glow font-black text-sm"
          >
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4 fill-current" />}
            {isProcessing ? (processingStage || 'Processing...') : 'Transcribe Audio'}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Main Transcription Workspace (Center) */}
        <main className="flex-1 flex flex-col p-8 md:p-14 overflow-y-auto scrollbar-hide bg-transparent">
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

        {/* Right: Fixed Unified Sidebar */}
        <aside className="w-[400px] border-l border-white/10 bg-transparent overflow-y-auto scrollbar-hide backdrop-blur-md">
          <div className="p-8 space-y-10">
            {/* Section: Source Selection */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-black uppercase tracking-widest text-white">Audio Source</h3>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
                <TabsList className="grid w-full grid-cols-2 bg-white/5 rounded-xl p-1 h-12">
                  <TabsTrigger value="upload" className="rounded-lg text-[10px] uppercase font-black tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
                    <Upload className="h-3 w-3 mr-2" /> Upload
                  </TabsTrigger>
                  <TabsTrigger value="youtube" className="rounded-lg text-[10px] uppercase font-black tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
                    <Youtube className="h-3 w-3 mr-2" /> YouTube
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-4 focus:outline-none">
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
                    <div className="text-center p-4">
                      {file ? (
                        <div className="space-y-3">
                          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 border border-primary/30">
                            <FileAudio className="h-5 w-5 text-primary" />
                          </div>
                          <p className="font-bold text-sm text-white truncate max-w-[200px]">{file.name}</p>
                          <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-destructive hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest flex items-center justify-center w-full">
                            <X className="h-3 w-3 mr-1" /> Remove
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                            <Upload className="h-5 w-5 text-primary" />
                          </div>
                          <p className="font-bold text-sm">Upload File</p>
                          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tighter">MP3, WAV, M4A</p>
                        </>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="youtube" className="space-y-4 focus:outline-none">
                  <div className="relative group">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input 
                      placeholder="Paste YouTube Link" 
                      className="h-14 pl-11 bg-white/5 border-white/10 rounded-2xl text-sm font-bold focus:ring-primary/20"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                    />
                  </div>
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                    <Youtube className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <p className="text-[10px] text-muted-foreground leading-relaxed">We extract audio automatically from your link for direct processing.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="h-px bg-white/5" />

            {/* Section: Settings */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Languages className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-black uppercase tracking-widest text-white">Neural Settings</h3>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Language Model</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="h-14 rounded-2xl bg-white/5 border-white/10 text-sm font-bold focus:ring-primary/20">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-white/10 bg-black/95 backdrop-blur-xl">
                    <SelectItem value="english">English (Standard)</SelectItem>
                    <SelectItem value="hindi">Hindi (Regional)</SelectItem>
                    <SelectItem value="multilingual">Auto-Detection</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">Neural Ready</span>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* Section: Actions */}
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 font-black text-xs uppercase tracking-widest"
                disabled={!transcription}
                onClick={handleExport}
              >
                <Download className="mr-2 h-4 w-4" /> Export Transcription
              </Button>
              <p className="text-[10px] text-center text-muted-foreground italic leading-relaxed px-4">
                Transcriptions are processed securely and not stored on our primary servers for your privacy.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
