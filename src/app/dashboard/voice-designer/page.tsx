'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Sparkles, 
  Play, 
  Loader2, 
  User, 
  Volume2, 
  Zap,
  Globe2,
  CheckCircle2
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

const MAX_CHARACTERS = 1000;

// Component for the tag-supporting text area (same as TTS page)
const ModernTextEditor = ({ value, onChange, maxLength }: { value: string, onChange: (val: string) => void, maxLength: number }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.innerText;
    if (text.length <= maxLength) {
      onChange(text);
    } else {
      // Prevent overflow
      e.currentTarget.innerText = text.slice(0, maxLength);
    }
  };

  return (
    <div className="relative group">
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        suppressContentEditableWarning
        className="w-full min-h-[200px] p-0 text-[20px] leading-relaxed outline-none whitespace-pre-wrap bg-transparent placeholder:text-muted-foreground/50 font-medium text-white/90"
        style={{ fontFamily: "'Roboto', sans-serif" }}
        data-placeholder="Type or paste your preview text here..."
      />
      {value.length === 0 && (
        <div className="absolute top-0 left-0 pointer-events-none text-muted-foreground/30 text-[20px] italic font-medium" style={{ fontFamily: "'Roboto', sans-serif" }}>
          What would you like the designed voice to say?
        </div>
      )}
    </div>
  );
};

export default function VoiceDesignerPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [text, setText] = useState("This is a preview of the unique voice you're designing. Adjust the parameters below to find the perfect sound.");
  const [params, setParams] = useState({
    gender: 'female',
    age: 'young',
    accent: 'british',
    accentStrength: 50,
  });

  const characterCount = text.length;

  const handleGenerate = () => {
    if (!text || isGenerating) return;
    
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Sample Generated",
        description: "Your unique custom voice is ready to preview.",
      });
    }, 1500);
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
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold leading-tight">AI Voice Designer</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Generative Studio</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !text}
              className="rounded-full h-12 px-10 bg-primary hover:bg-primary/90 font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              {isGenerating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Play className="mr-2 h-5 w-5 fill-current" />}
              {isGenerating ? 'Designing...' : 'Generate Sample'}
            </Button>
          </div>
        </div>

        {/* Designer Workspace */}
        <div className="p-10 md:p-14 space-y-12">
          {/* Editor Area (Replaced static preview) */}
          <div className="p-10 rounded-[2rem] bg-white/5 border border-white/10 relative group overflow-hidden">
            <ModernTextEditor 
              value={text} 
              onChange={setText} 
              maxLength={MAX_CHARACTERS} 
            />
            
            <div className="flex justify-end pt-6 border-t border-white/5 mt-6">
              <div className={cn(
                "text-[10px] font-mono font-black tracking-[0.2em] px-3 py-1 rounded-full bg-white/5 border border-white/5",
                characterCount >= MAX_CHARACTERS ? "text-red-500 border-red-500/20 bg-red-500/5" : "text-muted-foreground/50"
              )}>
                {characterCount.toLocaleString()} / {MAX_CHARACTERS.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <Label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                  <User className="h-3.5 w-3.5 text-primary" /> Base Gender
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {['Male', 'Female', 'Neutral'].map((gender) => (
                    <button
                      key={gender}
                      onClick={() => setParams({...params, gender: gender.toLowerCase()})}
                      className={cn(
                        "h-12 rounded-xl border text-sm font-bold transition-all",
                        params.gender === gender.toLowerCase() 
                          ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                          : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                      )}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                  <Zap className="h-3.5 w-3.5 text-primary" /> Target Age
                </Label>
                <Select value={params.age} onValueChange={(v) => setParams({...params, age: v})}>
                  <SelectTrigger className="h-14 rounded-2xl bg-white/5 border-white/10 text-base font-bold">
                    <SelectValue placeholder="Select age" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-white/10 bg-black/90 backdrop-blur-xl">
                    <SelectItem value="young">Young (Early 20s)</SelectItem>
                    <SelectItem value="middle">Middle Aged (40s)</SelectItem>
                    <SelectItem value="old">Old (60s+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <Label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                  <Globe2 className="h-3.5 w-3.5 text-primary" /> Regional Accent
                </Label>
                <Select value={params.accent} onValueChange={(v) => setParams({...params, accent: v})}>
                  <SelectTrigger className="h-14 rounded-2xl bg-white/5 border-white/10 text-base font-bold">
                    <SelectValue placeholder="Select accent" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-white/10 bg-black/90 backdrop-blur-xl">
                    <SelectItem value="british">British (Received Pronunciation)</SelectItem>
                    <SelectItem value="american">American (General)</SelectItem>
                    <SelectItem value="indian">Indian (Hinglish Style)</SelectItem>
                    <SelectItem value="australian">Australian (Outback)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <Label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                    <Volume2 className="h-3.5 w-3.5 text-primary" /> Accent Strength
                  </Label>
                  <span className="text-xs font-mono font-bold text-primary">{params.accentStrength}%</span>
                </div>
                <Slider 
                  value={[params.accentStrength]} 
                  onValueChange={(v) => setParams({...params, accentStrength: v[0]})}
                  max={100}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-[10px] uppercase tracking-tighter text-muted-foreground/50 font-black">
                  <span>Subtle</span>
                  <span>Heavy</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <p className="text-sm font-bold text-white">Save as permanent voice?</p>
              <p className="text-xs text-muted-foreground">Generated voices can be added to your personal library for recurring use.</p>
            </div>
            <Button variant="outline" className="rounded-full h-12 px-8 border-white/10 bg-white/5 hover:bg-white/10 font-bold">
              Add to My Library
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Feature Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Infinite Variety", desc: "Craft millions of unique combinations.", icon: Sparkles },
          { title: "No Royalty", desc: "Synthetic voices are free from license fees.", icon: Zap },
          { title: "Consistent", desc: "The same settings always produce the same voice.", icon: CheckCircle2 },
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
