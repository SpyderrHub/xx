
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
import { Search, X, PlusCircle, Filter } from 'lucide-react';
import VoiceCard from '@/components/voices/voice-card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';


const allVoices = [
  {
    id: 'aria-female-en-us',
    name: 'Aria',
    description: 'A clear and professional voice, perfect for narration and corporate content.',
    tags: ['Female', 'English, US', 'Narration'],
    category: 'Featured',
    creator: 'VoxAI',
    avatarUrl: 'https://picsum.photos/seed/aria/400/250',
    isPremium: true,
    rating: 4.8,
  },
  {
    id: 'javier-male-es',
    name: 'Javier',
    description: 'A warm and friendly voice, ideal for conversational content and podcasts.',
    tags: ['Male', 'Spanish', 'Conversational'],
    category: 'Featured',
    creator: 'Community',
    avatarUrl: 'https://picsum.photos/seed/javier/400/250',
    isPremium: false,
    rating: 4.6,
  },
  {
    id: 'chloe-female-fr',
    name: 'Chloé',
    description: 'A calm and soothing voice, great for meditation, relaxation, and audiobooks.',
    tags: ['Female', 'French', 'Calm'],
    category: 'Featured',
    creator: 'VoxAI',
    avatarUrl: 'https://picsum.photos/seed/chloe/400/250',
    isPremium: true,
    rating: 4.9,
  },
  {
    id: 'kenji-male-jp',
    name: 'Kenji',
    description: 'An energetic and expressive voice, suited for anime, gaming, and dynamic ads.',
    tags: ['Male', 'Japanese', 'Anime'],
    category: 'All',
    creator: 'Community',
    avatarUrl: 'https://picsum.photos/seed/kenji/400/250',
    isPremium: false,
    rating: 4.5,
  },
  {
    id: 'isabella-female-uk',
    name: 'Isabella',
    description: 'A formal and deep voice, perfect for documentaries and formal presentations.',
    tags: ['Female', 'English, UK', 'Formal'],
    category: 'All',
    creator: 'VoxAI',
    avatarUrl: 'https://picsum.photos/seed/isabella/400/250',
    isPremium: true,
    rating: 4.7,
  },
  {
    id: 'marco-male-it',
    name: 'Marco',
    description: 'A passionate and lively voice for expressive storytelling and commercials.',
    tags: ['Male', 'Italian', 'Storytelling'],
    category: 'All',
    creator: 'Community',
    avatarUrl: 'https://picsum.photos/seed/marco/400/250',
    isPremium: false,
    rating: 4.4,
  },
  {
    id: 'lena-female-de',
    name: 'Lena',
    description: 'A direct and clear voice, great for instructional videos and e-learning.',
    tags: ['Female', 'German', 'Instructional'],
    category: 'All',
    creator: 'VoxAI',
    avatarUrl: 'https://picsum.photos/seed/lena/400/250',
    isPremium: false,
    rating: 4.5,
  },
  {
    id: 'liam-male-en-au',
    name: 'Liam',
    description: 'A laid-back and friendly Australian voice for casual and relatable content.',
    tags: ['Male', 'English, AU', 'Friendly'],
    category: 'All',
    creator: 'Community',
    avatarUrl: 'https://picsum.photos/seed/liam/400/250',
    isPremium: false,
    rating: 4.3,
  },
];

const FilterControls = ({ filters, setFilters, clearFilters, inSheet = false }: any) => {
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

  const containerClasses = inSheet ? 'flex flex-col gap-4' : 'hidden lg:flex flex-wrap gap-2 sm:flex-nowrap';

  return (
    <div className={containerClasses}>
        <Select
          value={filters.gender}
          onValueChange={(value) => setFilters({ ...filters, gender: value === 'all' ? '' : value })}
        >
          <SelectTrigger className="h-12 flex-grow rounded-xl sm:w-auto bg-card border-border">
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
          <SelectTrigger className="h-12 flex-grow rounded-xl sm:w-auto bg-card border-border">
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
          <SelectTrigger className="h-12 flex-grow rounded-xl sm:w-auto bg-card border-border">
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
  );
};


const LibraryHeader = ({ search, setSearch, filters, setFilters, clearFilters }: any) => {
  return (
    <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border bg-card/50 p-4 shadow-lg backdrop-blur-md sm:flex-row sm:items-center">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search voices by name, tag, or language..."
          className="h-12 rounded-xl pl-10 bg-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <FilterControls filters={filters} setFilters={setFilters} clearFilters={clearFilters} />
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full h-12 rounded-xl">
              <Filter className="mr-2"/>
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Refine your voice search.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <FilterControls filters={filters} setFilters={setFilters} clearFilters={clearFilters} inSheet={true} />
            </div>
          </SheetContent>
        </Sheet>
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
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Voice Library</h1>
          <p className="mt-2 text-muted-foreground">
            Discover and sample from our extensive collection of premium AI voices.
          </p>
        </div>
        <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:from-purple-700 hover:to-indigo-700">
            <Link href="#">
                <PlusCircle className="mr-2" />
                Create Custom Voice
            </Link>
        </Button>
      </div>

      <LibraryHeader
        search={search}
        setSearch={setSearch}
        filters={filters}
        setFilters={setFilters}
        clearFilters={clearFilters}
      />

      <div>
        <h2 className="mb-6 text-2xl font-semibold tracking-tight">
          All Voices
        </h2>
        {filteredVoices.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredVoices.map((voice) => (
              <VoiceCard key={voice.id} voice={voice} />
            ))}
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/50">
            <p className="text-xl font-semibold">No voices found</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your search or filters.
            </p>
            <Button variant="link" onClick={clearFilters} className="mt-4">
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
