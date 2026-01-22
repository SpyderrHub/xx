
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, PlusCircle } from 'lucide-react';

export type Voice = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  category: string;
  avatarUrl: string;
};

interface VoiceCardProps {
  voice: Voice;
}

export default function VoiceCard({ voice }: VoiceCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="h-full"
    >
      <Card className="group flex h-full flex-col overflow-hidden rounded-2xl border-white/10 bg-black/20 shadow-lg backdrop-blur-lg">
        <CardContent className="relative p-0">
          <div className="relative aspect-[16/10]">
            <Image
              src={voice.avatarUrl}
              alt={voice.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-4 h-12 w-12 rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-white/30"
            >
              <PlayCircle className="h-7 w-7" />
            </Button>
            <div className="absolute bottom-4 left-4">
              <h3 className="text-xl font-bold text-white">{voice.name}</h3>
            </div>
          </div>
          <div className="p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {voice.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="border-none bg-white/10 text-white"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{voice.description}</p>
          </div>
        </CardContent>
        <CardFooter className="mt-auto p-4 pt-0">
          <Button
            asChild
            className="w-full rounded-xl bg-white/10 font-bold text-white hover:bg-white/20"
          >
            <Link href="/dashboard/text-to-speech">
              <PlusCircle className="mr-2 h-5 w-5" />
              Use Voice
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
