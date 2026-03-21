
'use client';

import { use } from 'react';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { Loader2, Calendar, Clock, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { firestore } = useFirebase();

  const docQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'documentation'), where('slug', '==', slug), limit(1));
  }, [firestore, slug]);

  const { data: results, isLoading } = useCollection(docQuery);
  const docData = results?.[0];

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
      </div>
    );
  }

  if (!docData) {
    return (
      <div className="space-y-6 py-20 text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground">This documentation page doesn't exist.</p>
        <Link href="/docs" className="text-primary hover:underline">Return to Overview</Link>
      </div>
    );
  }

  return (
    <motion.article 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="space-y-10"
    >
      <header className="space-y-6">
        <Link href="/docs" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-primary hover:gap-2 transition-all">
          <ChevronLeft className="h-3 w-3" /> Back to Docs
        </Link>
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">{docData.title}</h1>
        <div className="flex items-center gap-6 text-xs text-muted-foreground font-medium">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" />
            Updated {new Date(docData.updatedAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            {Math.ceil((docData.content?.length || 0) / 1000)} min read
          </div>
        </div>
      </header>

      <div 
        className="prose prose-invert prose-p:text-muted-foreground prose-p:leading-relaxed prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-3xl prose-img:border prose-img:border-white/10 max-w-none prose-lg"
        dangerouslySetInnerHTML={{ __html: docData.content }}
      />

      <div className="pt-16 border-t border-white/5 flex justify-between items-center text-sm">
        <p className="text-muted-foreground">Found an issue with this page?</p>
        <Link href="mailto:support@saanchi.ai" className="text-primary font-bold hover:underline">Contact Support</Link>
      </div>
    </motion.article>
  );
}
