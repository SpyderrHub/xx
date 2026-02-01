
'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import Image from 'next/image';

interface VoiceCardProps {
  name: string;
  language: string;
  avatarUrl: string;
}

export default function VoiceCard({ name, language, avatarUrl }: VoiceCardProps) {
  return (
    <Card className="bg-card/80 overflow-hidden group relative">
      <Image src={avatarUrl} alt={name} width={400} height={250} className="w-full object-cover aspect-[16/10] group-hover:scale-105 transition-transform duration-300"/>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <CardContent className="absolute bottom-0 left-0 right-0 p-4">
        <p className="font-semibold text-white">{name}</p>
        <p className="text-xs text-muted-foreground">{language}</p>
      </CardContent>
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
           <Button variant="default" size="icon" className="h-12 w-12 rounded-full">
                <Play className="h-6 w-6"/>
            </Button>
       </div>
    </Card>
  );
}
