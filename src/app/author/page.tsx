'use client';

import { motion } from 'framer-motion';
import { VoiceUploadCard } from '@/components/author/voice-upload-card';
import { AllVoicesList } from '@/components/author/all-voices-list';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Mic2, Globe, Sparkles } from 'lucide-react';
import { useAllVoicesRealtime } from '@/hooks/use-all-voices-realtime';

export default function AuthorDashboardPage() {
  const { voices } = useAllVoicesRealtime();

  const totalVoices = voices?.length || 0;

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-32 px-4 md:px-0">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-3">
            <Sparkles className="h-3 w-3" />
            <span>Platform Content Hub</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
            Library <span className="text-primary">Curator</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1 max-w-md">
            Manage, edit, and audit every AI voice profile available in the QuantisAI Labs studio.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full md:w-auto"
        >
          <Card className="bg-white/[0.02] border-primary/20 md:min-w-[200px] overflow-hidden relative">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Globe className="h-12 w-12 text-primary" />
            </div>
            <CardHeader className="pb-2 space-y-0">
              <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Samples</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-white">{totalVoices.toLocaleString()}</div>
              <p className="text-[9px] text-primary font-bold uppercase mt-1">Platform Active</p>
            </CardContent>
          </Card>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Upload Column */}
        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <VoiceUploadCard />
          </div>
        </div>
        
        {/* Management Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <Mic2 className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight text-white">Platform Library</h2>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Real-time Feed</span>
          </div>
          
          <AllVoicesList />
        </div>
      </div>
    </div>
  );
}
