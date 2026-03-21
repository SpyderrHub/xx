
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  FileText, 
  Edit2, 
  Trash2, 
  X, 
  Save, 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Type,
  Link as LinkIcon,
  Image as ImageIcon,
  RotateCcw,
  RotateCw,
  ChevronDown,
  Loader2,
  Trash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function ManageDocsPage() {
  const { firestore } = useFirebase();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingDoc, setEditingDoc] = useState<any>(null);
  
  // Editor State
  const [docTitle, setTitle] = useState('');
  const [docSlug, setSlug] = useState('');
  const [docOrder, setOrder] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);

  // Fetch docs
  const docsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'documentation'), orderBy('order', 'asc'));
  }, [firestore]);

  const { data: documents, isLoading } = useCollection(docsQuery);

  const handleOpenEditor = (docToEdit: any = null) => {
    if (docToEdit) {
      setEditingDoc(docToEdit);
      setTitle(docToEdit.title);
      setSlug(docToEdit.slug);
      setOrder(docToEdit.order || 0);
      setTimeout(() => {
        if (editorRef.current) editorRef.current.innerHTML = docToEdit.content || '';
      }, 100);
    } else {
      setEditingDoc(null);
      setTitle('');
      setSlug('');
      setOrder(documents?.length || 0);
      setTimeout(() => {
        if (editorRef.current) editorRef.current.innerHTML = '';
      }, 100);
    }
    setIsEditorOpen(true);
  };

  const handleSave = async () => {
    if (!docTitle || !docSlug || !editorRef.current || !firestore) {
      toast({ title: "Error", description: "Title and Slug are required.", variant: "destructive" });
      return;
    }

    const docId = editingDoc?.id || crypto.randomUUID();
    const docData = {
      title: docTitle,
      slug: docSlug.toLowerCase().replace(/ /g, '-'),
      content: editorRef.current.innerHTML,
      order: Number(docOrder),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(firestore, 'documentation', docId), docData);
      toast({ title: "Success", description: "Document saved successfully!" });
      setIsEditorOpen(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!firestore || !confirm("Are you sure you want to delete this page?")) return;
    try {
      await deleteDoc(doc(firestore, 'documentation', id));
      toast({ title: "Deleted", description: "Document removed." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  // Editor Commands
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) editorRef.current.focus();
  };

  const insertLink = () => {
    const url = prompt("Enter the URL:");
    if (url) execCommand('createLink', url);
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) execCommand('insertImage', url);
  };

  const filteredDocs = documents?.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.slug.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documentation Pages</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage the public-facing knowledge base.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search pages..." 
            className="pl-9 bg-white/5 border-white/10 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <motion.div key={doc.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="bg-card/40 border-white/5 hover:border-primary/20 transition-all group overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenEditor(doc)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(doc.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg leading-tight mb-1">{doc.title}</h3>
                  <p className="text-xs text-muted-foreground font-mono">/{doc.slug}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest font-black text-white/20">Order: {doc.order}</span>
                    <span className="text-[10px] text-muted-foreground italic">Updated {new Date(doc.updatedAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.02]">
          <FileText className="h-12 w-12 text-muted-foreground/20 mb-4" />
          <p className="text-muted-foreground font-medium">No documentation pages found.</p>
          <Button variant="link" className="mt-2 text-primary" onClick={() => handleOpenEditor()}>Create your first page</Button>
        </div>
      )}

      {/* Floating Action Button */}
      <Button 
        size="icon" 
        className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-2xl shadow-primary/40 bg-primary hover:scale-110 active:scale-95 transition-all z-50 group"
        onClick={() => handleOpenEditor()}
      >
        <Plus className="h-8 w-8 group-hover:rotate-90 transition-transform" />
      </Button>

      {/* Rich Text Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-background/95 backdrop-blur-2xl border-white/10">
          <DialogHeader className="p-6 border-b border-white/5">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {editingDoc ? 'Edit Page' : 'New Knowledge Base Page'}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Meta Inputs */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-white/5 bg-white/[0.02]">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Page Title</label>
                <Input 
                  placeholder="e.g. Getting Started" 
                  value={docTitle} 
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-white/5 border-white/10 rounded-lg h-11"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">URL Slug</label>
                <Input 
                  placeholder="e.g. getting-started" 
                  value={docSlug} 
                  onChange={(e) => setSlug(e.target.value)}
                  className="bg-white/5 border-white/10 rounded-lg h-11 font-mono text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Sort Order</label>
                <Input 
                  type="number" 
                  value={docOrder} 
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="bg-white/5 border-white/10 rounded-lg h-11"
                />
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/5 bg-background sticky top-0 z-10 overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-1 pr-2 border-r border-white/5 mr-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" title="Undo" onClick={() => execCommand('undo')}><RotateCcw className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" title="Redo" onClick={() => execCommand('redo')}><RotateCw className="h-4 w-4" /></Button>
              </div>

              <div className="flex items-center gap-1 pr-2 border-r border-white/5 mr-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-xs gap-1">
                      Typography <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-black/90 backdrop-blur-xl border-white/10">
                    <DropdownMenuItem onClick={() => execCommand('formatBlock', 'H1')} className="text-xl font-bold">Heading 1</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => execCommand('formatBlock', 'H2')} className="text-lg font-bold">Heading 2</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => execCommand('formatBlock', 'H3')} className="font-bold">Heading 3</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => execCommand('formatBlock', 'P')}>Paragraph</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-1 pr-2 border-r border-white/5 mr-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand('bold')}><Bold className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand('italic')}><Italic className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand('underline')}><Underline className="h-4 w-4" /></Button>
                <input 
                  type="color" 
                  onChange={(e) => execCommand('foreColor', e.target.value)} 
                  className="w-6 h-6 rounded cursor-pointer bg-transparent border-none" 
                  title="Text Color"
                />
              </div>

              <div className="flex items-center gap-1 pr-2 border-r border-white/5 mr-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand('justifyLeft')}><AlignLeft className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand('justifyCenter')}><AlignCenter className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand('justifyRight')}><AlignRight className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand('justifyFull')}><AlignJustify className="h-4 w-4" /></Button>
              </div>

              <div className="flex items-center gap-1 pr-2 border-r border-white/5 mr-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand('insertUnorderedList')}><List className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand('insertOrderedList')}><ListOrdered className="h-4 w-4" /></Button>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={insertLink} title="Insert Link"><LinkIcon className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={insertImage} title="Insert Image"><ImageIcon className="h-4 w-4" /></Button>
              </div>
            </div>

            {/* Editor Surface */}
            <div className="flex-1 overflow-y-auto p-8 prose prose-invert max-w-none focus:outline-none">
              <div 
                ref={editorRef}
                contentEditable
                className="min-h-full outline-none leading-relaxed text-lg"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>
          </div>

          <DialogFooter className="p-6 border-t border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Auto-saving draft...</span>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" className="rounded-lg" onClick={() => setIsEditorOpen(false)}>Cancel</Button>
              <Button className="rounded-lg bg-primary hover:bg-primary/90 px-8 font-bold" onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" /> Save Page
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
