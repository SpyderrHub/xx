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
import { Search, X, PlusCircle, Filter, Loader2 } from 'lucide-react';
import VoiceCard from '@/components/voices/voice-card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';

const FilterControls = ({ filters, setFilters, clearFilters, availableOptions, inSheet = false }: any) => {
  const containerClasses = inSheet ? 'flex flex-col gap-4' : 'hidden lg:flex flex-wrap gap-2 sm:flex-nowrap';

  return (
    <div className={containerClasses}>
      <Select
        value={filters.gender || 'all'}
        onValueChange={(value) => setFilters({ ...filters, gender: value === 'all' ? '' : value })}
      >
        <SelectTrigger className="h-12 flex-grow rounded-xl sm:w-auto bg-card border-border">
          <SelectValue placeholder="Gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Genders</SelectItem>
          {availableOptions.genders.map((g: string) => (
            <SelectItem key={g} value={g}>{g}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.language || 'all'}
        onValueChange={(value) => setFilters({ ...filters, language: value === 'all' ? '' : value })}
      >
        <SelectTrigger className="h-12 flex-grow rounded-xl sm:w-auto bg-card border-border">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Languages</SelectItem>
          {availableOptions.languages.map((l: string) => (
            <SelectItem key={l} value={l}>{l}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.style || 'all'}
        onValueChange={(value) => setFilters({ ...filters, style: value === 'all' ? '' : value })}
      >
        <SelectTrigger className="h-12 flex-grow rounded-xl sm:w-auto bg-card border-border">
          <SelectValue placeholder="Style" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Styles</SelectItem>
          {availableOptions.styles.map((s: string) => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
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

const LibraryHeader = ({ search, setSearch, filters, setFilters, clearFilters, availableOptions }: any) => {
  return (
    <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border bg-card/50 p-4 shadow-lg backdrop-blur-md sm:flex-row sm:items-center">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search voices by name or description..."
          className="h-12 rounded-xl pl-10 bg-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <FilterControls filters={filters} setFilters={setFilters} clearFilters={clearFilters} availableOptions={availableOptions} />
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full h-12 rounded-xl">
              <Filter className="mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Refine your voice search.</SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <FilterControls 
                filters={filters} 
                setFilters={setFilters} 
                clearFilters={clearFilters} 
                availableOptions={availableOptions} 
                inSheet={true} 
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default function VoiceLibraryPage() {
  const { firestore } = useFirebase();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    gender: '',
    language: '',
    style: '',
  });

  const voicesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // Show all uploaded voice profiles in the library
    return query(collection(firestore, 'voices'));
  }, [firestore]);

  const { data: voices, isLoading } = useCollection(voicesQuery);

  const clearFilters = () => {
    setSearch('');
    setFilters({ gender: '', language: '', style: '' });
  };

  const availableOptions = useMemo(() => {
    if (!voices) return { genders: [], languages: [], styles: [] };
    return {
      genders: Array.from(new Set(voices.map(v => v.gender).filter(Boolean))),
      languages: Array.from(new Set(voices.map(v => v.language).filter(Boolean))),
      styles: Array.from(new Set(voices.map(v => v.style).filter(Boolean))),
    };
  }, [voices]);

  const filteredVoices = useMemo(() => {
    if (!voices) return [];
    return voices.filter((voice) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        voice.voiceName.toLowerCase().includes(searchLower) ||
        voice.description?.toLowerCase().includes(searchLower) ||
        voice.style?.toLowerCase().includes(searchLower);

      const matchesGender = !filters.gender || voice.gender === filters.gender;
      const matchesLanguage = !filters.language || voice.language === filters.language;
      const matchesStyle = !filters.style || voice.style === filters.style;

      return matchesSearch && matchesGender && matchesLanguage && matchesStyle;
    });
  }, [voices, search, filters]);

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
          <Link href="/author">
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
        availableOptions={availableOptions}
      />

      <div>
        <h2 className="mb-6 text-2xl font-semibold tracking-tight">All Voices</h2>
        
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredVoices.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredVoices.map((voice) => (
              <VoiceCard key={voice.id} voice={voice} />
            ))}
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/50">
            <p className="text-xl font-semibold">No voices found</p>
            <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search or filters.</p>
            <Button variant="link" onClick={clearFilters} className="mt-4">
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}