
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X, PlusCircle } from 'lucide-react';
import VoiceCard from '@/components/voices/voice-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const allVoices = [
  {
    id: 'aria-female-en-us',
    name: 'Aria',
    description: 'A clear and professional voice, perfect for narration.',
    tags: ['Female', 'English, US', 'Narration'],
    category: 'Featured',
    avatarUrl: 'https://picsum.photos/seed/aria/400/250',
  },
  {
    id: 'javier-male-es',
    name: 'Javier',
    description: 'A warm and friendly voice, ideal for conversational content.',
    tags: ['Male', 'Spanish', 'Conversational'],
    category: 'Featured',
    avatarUrl: 'https://picsum.photos/seed/javier/400/250',
  },
  {
    id: 'chloe-female-fr',
    name: 'Chloé',
    description: 'A calm and soothing voice, great for meditation and relaxation.',
    tags: ['Female', 'French', 'Calm'],
    category: 'Featured',
    avatarUrl: 'https://picsum.photos/seed/chloe/400/250',
  },
  {
    id: 'kenji-male-jp',
    name: 'Kenji',
    description: 'An energetic and expressive voice, suited for anime and gaming.',
    tags: ['Male', 'Japanese', 'Anime'],
    category: 'All',
    avatarUrl: 'https://picsum.photos/seed/kenji/400/250',
  },
  {
    id: 'isabella-female-uk',
    name: 'Isabella',
    description: 'A formal and deep voice, perfect for corporate and formal use.',
    tags: ['Female', 'English, UK', 'Formal'],
    category: 'All',
    avatarUrl: 'https://picsum.photos/seed/isabella/400/250',
  },
  {
    id: 'marco-male-it',
    name: 'Marco',
    description: 'A passionate and lively voice for expressive storytelling.',
    tags: ['Male', 'Italian', 'Storytelling'],
    category: 'All',
    avatarUrl: 'https://picsum.photos/seed/marco/400/250',
  },
  {
    id: 'lena-female-de',
    name: 'Lena',
    description: 'A direct and clear voice, great for instructional videos.',
    tags: ['Female', 'German', 'Instructional'],
    category: 'All',
    avatarUrl: 'https://picsum.photos/seed/lena/400/250',
  },
  {
    id: 'liam-male-en-au',
    name: 'Liam',
    description: 'A laid-back and friendly Australian voice.',
    tags: ['Male', 'English, AU', 'Friendly'],
    category: 'All',
    avatarUrl: 'https://picsum.photos/seed/liam/400/250',
  },
];

const VoiceFilters = ({
  search,
  setSearch,
  filters,
  setFilters,
  clearFilters,
}: any) => {
  const languages = useMemo(
    () => [...new Set(allVoices.map((v) => v.tags[1]))],
    []
  );
  const genders = useMemo(
    () => [...new Set(allVoices.map((v) => v.tags[0]))],
    []
  );
  const styles = useMemo(
    () => [...new Set(allVoices.map((v) => v.tags[2]).filter(Boolean))],
    []
  );

  return (
    <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 shadow-lg backdrop-blur-md sm:flex-row">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search voices by name, tag, or language..."
          className="h-12 rounded-xl pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-2 sm:flex-nowrap">
        <Select
          value={filters.gender}
          onValueChange={(value) => setFilters({ ...filters, gender: value === 'all' ? '' : value })}
        >
          <SelectTrigger className="h-12 flex-grow rounded-xl sm:w-auto">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genders</SelectItem>
            {genders.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.language}
          onValueChange={(value) => setFilters({ ...filters, language: value === 'all' ? '' : value })}
        >
          <SelectTrigger className="h-12 flex-grow rounded-xl sm:w-auto">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
             <SelectItem value="all">All Languages</SelectItem>
            {languages.map((l) => (
              <SelectItem key={l} value={l}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.style}
          onValueChange={(value) => setFilters({ ...filters, style: value === 'all' ? '' : value })}
        >
          <SelectTrigger className="h-12 flex-grow rounded-xl sm:w-auto">
            <SelectValue placeholder="Style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Styles</SelectItem>
            {styles.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 shrink-0 rounded-xl"
          onClick={clearFilters}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default function VoiceLibraryPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    gender: '',
    language: '',
    style: '',
  });

  const clearFilters = () => {
    setSearch('');
    setFilters({ gender: '', language: '', style: '' });
  };

  const filteredVoices = useMemo(() => {
    return allVoices.filter((voice) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        voice.name.toLowerCase().includes(searchLower) ||
        voice.tags.some((tag) => tag.toLowerCase().includes(searchLower));

      const matchesGender = !filters.gender || voice.tags[0] === filters.gender;
      const matchesLanguage = !filters.language || voice.tags[1] === filters.language;
      const matchesStyle = !filters.style || voice.tags[2] === filters.style;

      return matchesSearch && matchesGender && matchesLanguage && matchesStyle;
    });
  }, [search, filters]);

  const featuredVoices = useMemo(
    () => allVoices.filter((v) => v.category === 'Featured'),
    []
  );

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Voice Library</h1>
          <p className="mt-2 text-muted-foreground">
            Discover and sample from our extensive collection of premium AI voices.
          </p>
        </div>
        <Button asChild>
            <Link href="#">
                <PlusCircle className="mr-2" />
                Create Custom Voice
            </Link>
        </Button>
      </div>

      <VoiceFilters
        search={search}
        setSearch={setSearch}
        filters={filters}
        setFilters={setFilters}
        clearFilters={clearFilters}
      />

      <div>
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">
          Featured Voices
        </h2>
        <Carousel
          opts={{
            align: 'start',
            loop: false,
          }}
          className="-mx-4"
        >
          <CarouselContent>
            {featuredVoices.map((voice) => (
              <CarouselItem
                key={voice.id}
                className="pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <VoiceCard voice={voice} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden -left-4 lg:flex" />
          <CarouselNext className="hidden -right-4 lg:flex" />
        </Carousel>
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">All Voices</h2>
        {filteredVoices.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredVoices.map((voice) => (
              <VoiceCard key={voice.id} voice={voice} />
            ))}
          </div>
        ) : (
          <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed bg-black/10">
            <p className="font-semibold">No voices found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters.
            </p>
            <Button variant="link" onClick={clearFilters} className="mt-2">
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
