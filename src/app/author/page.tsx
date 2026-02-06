
'use client';

import { motion } from 'framer-motion';
import { VoiceUploadCard } from '@/components/author/voice-upload-card';
import { MyVoicesTable } from '@/components/author/my-voices-table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Mic2, CheckCircle2, Clock } from 'lucide-react';

export default function AuthorDashboardPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Samples</CardTitle>
            <Mic2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <VoiceUploadCard />
        <div className="space-y-8">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle>My Uploaded Voices</CardTitle>
            </CardHeader>
            <CardContent>
              <MyVoicesTable />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
