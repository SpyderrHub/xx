'use client';

import Link from 'next/link';
import {
  ArrowRight,
  ChevronRight,
  MessageSquare,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import StatsCard from '@/components/dashboard/stats-card';
import RecentGenerationsTable from '@/components/dashboard/recent-table';
import VoiceCard from '@/components/dashboard/voice-card';

const stats = [
  {
    name: 'Characters Generated',
    value: '1,250,320',
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    name: 'Credits Remaining',
    value: '4,320',
    icon: <Wallet className="h-4 w-4" />,
  },
  { name: 'Voices Used', value: '12', icon: <Users className="h-4 w-4" /> },
  {
    name: 'API Requests',
    value: '8,765',
    icon: <Zap className="h-4 w-4" />,
  },
];

const voiceLibrary = [
  { name: 'Aria', language: 'English, US' },
  { name: 'Javier', language: 'Spanish' },
  { name: 'Chloé', language: 'French' },
  { name: 'Kenji', language: 'Japanese' },
  { name: 'Isabella', language: 'English, UK' },
  { name: 'Marco', language: 'Italian' },
  { name: 'Lena', language: 'German' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard
            key={stat.name}
            title={stat.name}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Grid for Quick Action and Recent Generations */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="h-full bg-white/5 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Generations</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/my-generations">
                  View all <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <RecentGenerationsTable />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card className="flex h-full flex-col justify-between bg-gradient-to-br from-purple-600/50 to-indigo-600/50 p-6">
            <div>
              <MessageSquare className="h-8 w-8" />
              <h3 className="mt-4 text-xl font-bold">
                Create your first voice over
              </h3>
              <p className="mt-2 text-sm text-purple-200">
                Use our powerful Text to Speech tool to generate audio from text
                in seconds.
              </p>
            </div>
            <Button
              asChild
              className="mt-6 w-full justify-between bg-white/90 text-indigo-700 hover:bg-white"
            >
              <Link href="/text-to-speech">
                <span>Go to Text to Speech</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Card>
        </div>
      </div>

      {/* Voice Library Preview */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Explore the Voice Library</h3>
          <Button asChild variant="ghost" size="sm">
            <Link href="/voice-library">
              View all <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <Carousel
          opts={{
            align: 'start',
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent>
            {voiceLibrary.map((voice) => (
              <CarouselItem
                key={voice.name}
                className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
              >
                <VoiceCard name={voice.name} language={voice.language} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden lg:flex" />
          <CarouselNext className="hidden lg:flex" />
        </Carousel>
      </div>
    </div>
  );
}
