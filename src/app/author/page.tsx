
'use client';

import { motion } from 'framer-motion';
import { VoiceUploadCard } from '@/components/author/voice-upload-card';
import { MyUploadedVoicesList } from '@/components/author/my-uploaded-voices-list';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Mic2, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useUserVoicesRealtime } from '@/hooks/use-user-voices-realtime';

export default function AuthorDashboardPage() {
  const { voices } = useUserVoicesRealtime();

  const stats = {
    total: voices?.length || 0,
    approved: voices?.filter(v => v.status === 'approved').length || 0,
    pending: voices?.filter(v => v.status === 'pending_review').length || 0,
    rejected: voices?.filter(v => v.status === 'rejected').length || 0,
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Samples</CardTitle>
            <Mic2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Approved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
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
