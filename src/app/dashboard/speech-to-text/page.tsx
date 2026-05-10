'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
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
  Zap,
  Mic,
  Youtube,
  StopCircle,
  Play,
  Pause,
  Link as LinkIcon
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
  TabsTrigger 
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useFirebase } from '@/firebase';

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
        className="w-full min-h-[300px] md:min-h-[400px] p-0 text-[18px] md:text-[20px] leading-relaxed outline-none whitespace-pre-wrap bg-transparent placeholder:text-muted-foreground/50 font-medium text-white/90"
        style={{ fontFamily: "'Inter', sans-serif" }}
        data-placeholder="Your transcription will appear here..."
      >
        {value}
      </div>
      {value.length === 0 && (
        <div className="absolute top-0 left-0 pointer-events-none text-muted-foreground/30 text-[18px] md:text-[20px] italic font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
          Transcription output will appear here once processing is complete...
        </div>
      )}
    </div>
  );
};

export default function SpeechToTextPage() {
  const { user } = useFirebase();
  const [isProcessing, setIsProcessing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [transcription, setTranscription] = useState('');
  const [language, setLanguage] = useState('english');
  const [activeTab, setActiveTab] = useState('upload');

  // Mic Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const recordedFile = new File([blob], `recording_${Date.now()}.webm`, { type: 'audio/webm' });
        setFile(recordedFile);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Mic error:', err);
      toast({ title: "Microphone Error", description: "Could not access your microphone.", variant: "destructive" });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

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
    if ((activeTab !== 'youtube' && !file) || isProcessing || !user) return;
    
    setIsProcessing(true);
    setTranscription('');

    try {
      const idToken = await user.getIdToken();
      let audioSourceUrl = '';

      if (activeTab === 'youtube') {
        if (!youtubeUrl.includes('youtube.com') && !youtubeUrl.includes('youtu.be')) {
          throw new Error('Please enter a valid YouTube URL');
        }
        audioSourceUrl = youtubeUrl;
      } else if (file) {
        // 1. Get Presigned URLs for R2
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

        // 2. Upload to R2
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

      // 3. Send Source URL to Transcription Proxy
      const response = await fetch('/api/stt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ audio_url: audioSourceUrl }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || errData.message || 'Transcription failed');
      }

      const data = await response.json();
      const resultText = data.text || data.transcription || (typeof data === 'string' ? data : JSON.stringify(data));
      setTranscription(resultText);
      
      toast({
        title: "Transcription Complete",
        description: "Your audio has been successfully converted to text.",
      });
    } catch (error: any) {
      console.error('Transcription error:', error);
      toast({
        title: "Transcription Error",
        description: error.message || "Failed to process audio file.",
        variant: "destructive"
      });
    } finally {
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
    <div className="max-w-[900px] mx-auto space-y-6 md:space-y-10 pb-20 px-4 md:px-0">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/40 backdrop-blur-[40px] border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden ring-1 ring-white/10"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 md:p-8 border-b border-white/5 bg-white/5 gap-4">
          <div className="flex items-center gap-3 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-white/5 border border-white/10 shadow-lg w-full sm:w-auto">
            <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
              <Ear className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-xs md:text-sm font-bold leading-tight">AI Speech to Text</p>
              <p className="text-[8px] md:text-[10px] text-muted-foreground uppercase tracking-widest font-black">Transcription Studio</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
            <Button 
              variant="outline" 
              className="flex-1 sm:flex-none rounded-full h-10 md:h-12 px-4 md:px-6 border-white/10 bg-white/5 hover:bg-white/10 font-bold text-xs md:text-sm"
              disabled={!transcription}
              onClick={handleExport}
            >
              <Download className="mr-2 h-3.5 w-3.5 md:h-4 md:w-4" /> Export
            </Button>
            <Button 
              onClick={handleTranscribe}
              disabled={(!file && activeTab !== 'youtube') || isProcessing || (activeTab === 'youtube' && !youtubeUrl)}
              className="flex-[1.5] sm:flex-none rounded-full h-10 md:h-12 px-6 md:px-10 bg-primary hover:bg-primary/90 font-black text-sm md:text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              {isProcessing ? <Loader2 className="mr-2 h-4 w-4 md:h-5 md:w-5 animate-spin" /> : <Zap className="mr-2 h-4 w-4 md:h-5 md:w-5 fill-current" />}
              {isProcessing ? 'Processing...' : 'Transcribe'}
            </Button>
          </div>
        </div>

        <div className="p-6 md:p-14 space-y-6 md:space-y-10">
          {!transcription ? (
            <Tabs defaultValue="upload" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 bg-white/5 p-1 rounded-2xl mb-8">
                <TabsTrigger value="upload" className="rounded-xl font-bold text-xs">
                  <Upload className="mr-2 h-3.5 w-3.5" /> Upload
                </TabsTrigger>
                <TabsTrigger value="record" className="rounded-xl font-bold text-xs">
                  <Mic className="mr-2 h-3.5 w-3.5" /> Record
                </TabsTrigger>
                <TabsTrigger value="youtube" className="rounded-xl font-bold text-xs">
                  <Youtube className="mr-2 h-3.5 w-3.5" /> YouTube
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-6">
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={onDrop}
                  onClick={() => !file && document.getElementById('audio-upload')?.click()}
                  className={cn(
                    "h-48 md:h-64 border-2 border-dashed rounded-[1.5rem] md:rounded-[2.5rem] flex flex-col items-center justify-center transition-all cursor-pointer group",
                    file ? "border-primary/50 bg-primary/5" : "border-white/10 hover:border-primary/30 hover:bg-white/5"
                  )}
                >
                  <input id="audio-upload" type="file" accept="audio/*" className="hidden" onChange={handleFileSelect} />
                  <div className="text-center p-4">
                    {file ? (
                      <div className="space-y-3 md:space-y-4">
                        <div className="inline-flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-xl md:rounded-2xl bg-primary/20 border border-primary/30">
                          <FileAudio className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-lg md:text-xl text-white truncate max-w-[200px] md:max-w-none">{file.name}</p>
                          <p className="text-[10px] md:text-sm text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB • Ready</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-destructive hover:text-destructive/80 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">
                          <X className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" /> Remove
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="mb-4 md:mb-6 inline-flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                          <Upload className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                        </div>
                        <p className="font-bold text-xl md:text-2xl text-white">Upload Audio</p>
                        <p className="text-[10px] md:text-sm text-muted-foreground mt-2 max-w-[240px] mx-auto">MP3, WAV, or M4A supported.</p>
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="record" className="space-y-6">
                <div className="h-48 md:h-64 border-2 border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] flex flex-col items-center justify-center bg-white/5 relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    {!file ? (
                      <motion.div 
                        key="recording"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center space-y-6"
                      >
                        <div className="relative">
                          {isRecording && (
                            <motion.div 
                              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="absolute inset-0 bg-primary rounded-full blur-xl"
                            />
                          )}
                          <Button 
                            onClick={isRecording ? stopRecording : startRecording}
                            className={cn(
                              "h-20 w-20 rounded-full shadow-2xl relative z-10 transition-all",
                              isRecording ? "bg-red-500 hover:bg-red-600 scale-110" : "bg-primary hover:bg-primary/90"
                            )}
                          >
                            {isRecording ? <StopCircle className="h-10 w-10 fill-current" /> : <Mic className="h-10 w-10" />}
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <p className="font-bold text-xl">{isRecording ? "Recording Live..." : "Capture Audio"}</p>
                          <p className={cn(
                            "font-mono text-2xl font-black transition-colors",
                            isRecording ? "text-primary" : "text-muted-foreground"
                          )}>
                            {formatDuration(recordingTime)}
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="recorded"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-4"
                      >
                         <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 border border-primary/30">
                          <FileAudio className="h-8 w-8 text-primary" />
                        </div>
                        <p className="font-bold text-xl text-white">Clip Captured</p>
                        <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="text-destructive font-bold uppercase tracking-widest text-[10px]">
                          <X className="h-3 w-3 mr-1" /> Discard
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </TabsContent>

              <TabsContent value="youtube" className="space-y-6">
                <div className="h-48 md:h-64 border-2 border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] flex flex-col items-center justify-center bg-white/5 p-8">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
                    <Youtube className="h-8 w-8 text-red-500" />
                  </div>
                  <div className="w-full max-w-md space-y-4">
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Paste YouTube Link..." 
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        className="h-14 pl-12 bg-black/20 border-white/10 rounded-xl focus:ring-primary/20"
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground text-center">Video audio will be extracted and transcribed instantly.</p>
                  </div>
                </div>
              </TabsContent>

              <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center mt-10">
                <div className="w-full md:w-1/2 space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Detection Language</label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-white/5 border-white/10 text-sm md:text-base font-bold">
                      <Languages className="h-4 w-4 mr-2 text-primary" />
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl md:rounded-2xl border-white/10 bg-black/90 backdrop-blur-xl">
                      <SelectItem value="english">English (Global)</SelectItem>
                      <SelectItem value="hindi">Hindi (Indian)</SelectItem>
                      <SelectItem value="spanish">Spanish (Latin)</SelectItem>
                      <SelectItem value="french">French (Standard)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-6 rounded-xl md:rounded-2xl bg-primary/5 border border-primary/10 h-12 md:h-auto">
                  <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-sm font-bold text-primary">
                    <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5" />
                    High-Fidelity Neural Engine
                  </div>
                </div>
              </div>
            </Tabs>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 md:space-y-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-4 md:pb-6">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="h-7 w-7 md:h-8 md:w-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-500" />
                  </div>
                  <p className="text-[10px] md:text-sm font-bold text-white uppercase tracking-wider">Transcription Complete</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => { setTranscription(''); setFile(null); setYoutubeUrl(''); }} className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white">
                  Start New
                </Button>
              </div>

              <TranscriptionEditor value={transcription} onChange={setTranscription} />
              
              <div className="flex flex-col sm:flex-row justify-between items-center pt-6 md:pt-8 border-t border-white/5 gap-4">
                <div className="flex gap-2 md:gap-4 w-full sm:w-auto justify-center">
                  <Button variant="ghost" size="sm" className="text-[10px] md:text-xs font-bold text-muted-foreground hover:text-white uppercase tracking-widest px-2">
                    <FileText className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 md:mr-2 text-primary" /> Timestamps
                  </Button>
                  <Button variant="ghost" size="sm" className="text-[10px] md:text-xs font-bold text-muted-foreground hover:text-white uppercase tracking-widest px-2">
                    <Ear className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 md:mr-2 text-primary" /> Diarization
                  </Button>
                </div>
                <div className="text-[10px] md:text-xs font-mono font-black tracking-[0.2em] px-3 py-1 rounded-full bg-white/5 border border-white/5 text-muted-foreground/50">
                  {transcription.split(' ').length} WORDS
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {[
          { title: "Neural Accuracy", desc: "Industry-leading error rates.", icon: Ear },
          { title: "Multi-Source", icon: Zap, desc: "Mic, Files, or YouTube." },
          { title: "Instant Export", desc: "Download as TXT or SRT.", icon: FileText },
        ].map((feature, i) => (
          <div key={i} className="p-4 md:p-6 rounded-xl md:rounded-[2rem] bg-white/5 border border-white/10 flex items-start gap-3 md:gap-4">
            <feature.icon className="h-4 w-4 md:h-5 md:w-5 text-primary mt-1" />
            <div>
              <h5 className="text-[10px] md:text-sm font-black uppercase tracking-widest text-white">{feature.title}</h5>
              <p className="text-[9px] md:text-xs text-muted-foreground mt-1">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
