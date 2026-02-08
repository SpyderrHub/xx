
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadProgressModalProps {
  isOpen: boolean;
  progress: number;
}

export function UploadProgressModal({ isOpen, progress }: UploadProgressModalProps) {
  const isComplete = progress === 100;

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md bg-card/90 backdrop-blur-xl border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-center">
            {isComplete ? 'Upload Complete!' : 'Uploading Voice Profile'}
          </DialogTitle>
        </DialogHeader>
        <div className="py-6 space-y-6 flex flex-col items-center">
          <div className="relative">
            <AnimatePresence mode="wait">
              {isComplete ? (
                <motion.div
                  key="complete"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-green-500/20 p-4 rounded-full"
                >
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="loading"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-primary/10 p-4 rounded-full"
                >
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="w-full space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
              <span>{progress}%</span>
              <span>{isComplete ? 'Syncing...' : 'Uploading files...'}</span>
            </div>
          </div>
          
          <p className="text-sm text-center text-muted-foreground">
            {isComplete 
              ? 'Your voice profile has been saved and is now pending review.' 
              : 'Please stay on this page while we process your high-quality samples.'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
