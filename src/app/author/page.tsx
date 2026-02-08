
'use client';

import { motion } from 'framer-motion';
import { VoiceUploadCard } from '@/components/author/voice-upload-card';
import { MyUploadedVoicesList } from '@/components/author/my-uploaded-voices-list';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Mic2 } from 'lucide-react';
import { useUserVoicesRealtime } from '@/hooks/use-user-voices-realtime';

export default function AuthorDashboardPage() {
  const { voices } = useUserVoicesRealtime();

  const totalSamples = voices?.length || 0;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-start"
      >
        <Card className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border-primary/20 w-full md:w-64">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Samples</CardTitle>
            <Mic2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSamples}</div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <VoiceUploadCard />
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">My Uploaded Voices</h2>
          </div>
          <MyUploadedVoicesList />
        </div>
      </div>
    </div>
  );
}
