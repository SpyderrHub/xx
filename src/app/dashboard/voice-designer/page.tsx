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

const ModernTextEditor = ({ value, onChange, maxLength }: { value: string, onChange: (val: string) => void, maxLength: number }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.innerText;
    if (text.length <= maxLength) {
      onChange(text);
    } else {
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
        className="w-full min-h-[160px] md:min-h-[200px] p-0 text-[18px] md:text-[20px] leading-relaxed outline-none whitespace-pre-wrap bg-transparent placeholder:text-muted-foreground/50 font-medium text-white/90"
        style={{ fontFamily: "'Roboto', sans-serif" }}
        data-placeholder="Type or paste your preview text here..."
      />
      {value.length === 0 && (
        <div className="absolute top-0 left-0 pointer-events-none text-muted-foreground/30 text-[18px] md:text-[20px] italic font-medium" style={{ fontFamily: "'Roboto', sans-serif" }}>
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
    <div className="max-w-[900px] mx-auto space-y-6 md:space-y-10 pb-20 px-4 md:px-0">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/40 backdrop-blur-[40px] border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden ring-1 ring-white/10"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 md:p-8 border-b border-white/5 bg-white/5 gap-4">
          <div className="flex items-center gap-3 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-white/5 border border-white/10 shadow-lg w-full sm:w-auto">
            <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
              <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-xs md:text-sm font-bold leading-tight">AI Voice Designer</p>
              <p className="text-[8px] md:text-[10px] text-muted-foreground uppercase tracking-widest font-black">Generative Studio</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !text}
              className="w-full sm:w-auto rounded-full h-10 md:h-12 px-6 md:px-10 bg-primary hover:bg-primary/90 font-black text-sm md:text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 md:h-5 md:w-5 animate-spin" /> : <Play className="mr-2 h-4 w-4 md:h-5 md:w-5 fill-current" />}
              {isGenerating ? 'Designing...' : 'Generate Sample'}
            </Button>
          </div>
        </div>

        <div className="p-6 md:p-14 space-y-8 md:space-y-12">
          <div className="p-6 md:p-10 rounded-xl md:rounded-[2rem] bg-white/5 border border-white/10 relative group overflow-hidden">
            <ModernTextEditor 
              value={text} 
              onChange={setText} 
              maxLength={MAX_CHARACTERS} 
            />
            
            <div className="flex justify-end pt-4 md:pt-6 border-t border-white/5 mt-4 md:mt-6">
              <div className={cn(
                "text-[9px] md:text-[10px] font-mono font-black tracking-[0.2em] px-3 py-1 rounded-full bg-white/5 border border-white/5",
                characterCount >= MAX_CHARACTERS ? "text-red-500 border-red-500/20 bg-red-500/5" : "text-muted-foreground/50"
              )}>
                {characterCount.toLocaleString()} / {MAX_CHARACTERS.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-6 md:space-y-8">
              <div className="space-y-3 md:space-y-4">
                <Label className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground">
                  <User className="h-3 w-3 md:h-3.5 md:w-3.5 text-primary" /> Base Gender
                </Label>
                <div className="grid grid-cols-3 gap-2 md:gap-3">
                  {['Male', 'Female', 'Neutral'].map((gender) => (
                    <button
                      key={gender}
                      onClick={() => setParams({...params, gender: gender.toLowerCase()})}
                      className={cn(
                        "h-10 md:h-12 rounded-lg md:rounded-xl border text-[10px] md:text-sm font-bold transition-all",
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

              <div className="space-y-3 md:space-y-4">
                <Label className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground">
                  <Zap className="h-3 w-3 md:h-3.5 md:w-3.5 text-primary" /> Target Age
                </Label>
                <Select value={params.age} onValueChange={(v) => setParams({...params, age: v})}>
                  <SelectTrigger className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-white/5 border-white/10 text-sm md:text-base font-bold">
                    <SelectValue placeholder="Select age" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl md:rounded-2xl border-white/10 bg-black/90 backdrop-blur-xl">
                    <SelectItem value="young">Young (Early 20s)</SelectItem>
                    <SelectItem value="middle">Middle Aged (40s)</SelectItem>
                    <SelectItem value="old">Old (60s+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-6 md:space-y-8">
              <div className="space-y-3 md:space-y-4">
                <Label className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground">
                  <Globe2 className="h-3 w-3 md:h-3.5 md:w-3.5 text-primary" /> Regional Accent
                </Label>
                <Select value={params.accent} onValueChange={(v) => setParams({...params, accent: v})}>
                  <SelectTrigger className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-white/5 border-white/10 text-sm md:text-base font-bold">
                    <SelectValue placeholder="Select accent" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl md:rounded-2xl border-white/10 bg-black/90 backdrop-blur-xl">
                    <SelectItem value="british">British (RP Style)</SelectItem>
                    <SelectItem value="american">American (General)</SelectItem>
                    <SelectItem value="indian">Indian (Standard)</SelectItem>
                    <SelectItem value="australian">Australian</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4 md:space-y-6">
                <div className="flex justify-between items-center">
                  <Label className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground">
                    <Volume2 className="h-3 w-3 md:h-3.5 md:w-3.5 text-primary" /> Accent Strength
                  </Label>
                  <span className="text-[10px] md:text-xs font-mono font-bold text-primary">{params.accentStrength}%</span>
                </div>
                <Slider 
                  value={[params.accentStrength]} 
                  onValueChange={(v) => setParams({...params, accentStrength: v[0]})}
                  max={100}
                  step={1}
                  className="py-2 md:py-4"
                />
                <div className="flex justify-between text-[8px] md:text-[10px] uppercase tracking-tighter text-muted-foreground/50 font-black">
                  <span>Subtle</span>
                  <span>Heavy</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 md:pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            <div className="text-center md:text-left">
              <p className="text-xs md:text-sm font-bold text-white">Save as permanent voice?</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">Generated voices can be added to your personal library.</p>
            </div>
            <Button variant="outline" className="w-full md:w-auto rounded-full h-10 md:h-12 px-6 md:px-8 border-white/10 bg-white/5 hover:bg-white/10 font-bold text-xs md:text-sm">
              Add to My Library
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {[
          { title: "Infinite Variety", desc: "Craft unique combinations.", icon: Sparkles },
          { title: "No Royalty", desc: "Synthetic voices are free.", icon: Zap },
          { title: "Consistent", desc: "Reliable settings every time.", icon: CheckCircle2 },
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
