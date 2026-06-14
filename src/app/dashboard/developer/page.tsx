
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Key, 
  RefreshCw, 
  Copy, 
  Check, 
  Terminal, 
  History, 
  Activity,
  ShieldAlert,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useFirebase, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, collection, query, orderBy, limit } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

/**
 * Generates a high-entropy 24 character random string for API keys.
 */
function generateApiKey(length: number = 24) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function DeveloperPage() {
  const { user, firestore } = useFirebase();
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch current user data (including API key)
  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData, isLoading: isUserLoading } = useDoc(userDocRef);

  // Fetch API activity logs from subcollection
  const logsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'users', user.uid, 'api_logs'),
      orderBy('timestamp', 'desc'),
      limit(20)
    );
  }, [user, firestore]);

  const { data: logs, isLoading: isLogsLoading } = useCollection(logsQuery);

  const handleGenerateToken = async () => {
    if (!user || !firestore) return;
    
    setIsGenerating(true);
    // Use a standard prefix 'qa_' followed by 24 random characters
    const newToken = `qa_${generateApiKey(24)}`; 

    try {
      await updateDoc(doc(firestore, 'users', user.uid), {
        apiKey: newToken,
        apiKeyCreatedAt: new Date().toISOString()
      });
      toast({ title: "New API Key Generated", description: "Your previous key has been revoked." });
    } catch (error: any) {
      toast({ title: "Generation Error", description: error.message, variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!userData?.apiKey) return;
    navigator.clipboard.writeText(userData.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Key copied to clipboard" });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-32">
      <header className="px-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          <Terminal className="h-3.5 w-3.5" />
          <span>Developer Tools</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white">API Access</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Manage your production credentials and monitor programmatic usage across QuantisAI Labs neural engines.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Token Management Section */}
        <div className="lg:col-span-12">
          <Card className="bg-white/[0.02] border-white/5 rounded-[2.5rem] overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 p-8">
              <Key className="h-8 w-8 text-white/5" />
            </div>
            <CardHeader className="p-10 pb-0">
              <CardTitle className="text-2xl font-black text-white">Neural Engine Token</CardTitle>
              <CardDescription className="text-base text-muted-foreground mt-2">
                This secret token grants full access to your character balance via our REST API. Never share this key.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Input 
                    value={userData?.apiKey || "No active token found"} 
                    readOnly 
                    className="h-16 bg-black/20 border-white/10 rounded-2xl px-6 font-mono text-lg text-primary tracking-wider focus:ring-0"
                  />
                  {userData?.apiKey && (
                    <Button 
                      variant="ghost" 
                      onClick={handleCopy}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-xl hover:bg-white/10"
                    >
                      {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5 text-muted-foreground" />}
                    </Button>
                  )}
                </div>
                <Button 
                  onClick={handleGenerateToken}
                  disabled={isGenerating}
                  className="h-16 px-8 rounded-2xl bg-white text-black font-black hover:bg-white/90 transition-all shrink-0"
                >
                  {isGenerating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <RefreshCw className="mr-2 h-5 w-5" />}
                  {userData?.apiKey ? "Revoke & Regenerate" : "Generate Production Key"}
                </Button>
              </div>

              <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex gap-4">
                <ShieldAlert className="h-6 w-6 text-amber-500 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">Security Advisory</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Rolling your key will immediately invalidate the current token. Ensure you update your environment variables in production to prevent service interruption.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Logs Table */}
        <div className="lg:col-span-12 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-white">Recent API Activity</h2>
            </div>
            <Button variant="link" className="text-xs font-black uppercase tracking-widest text-primary p-0 h-auto" asChild>
              <a href="https://docs.quantisai.org" target="_blank" rel="noopener noreferrer">
                Developer Docs <ExternalLink className="ml-1.5 h-3 w-3" />
              </a>
            </Button>
          </div>

          <Card className="bg-white/[0.02] border-white/5 rounded-[2rem] overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-white/[0.02]">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-8 h-12">Timestamp</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12">Method</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12">Resource</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12">Status</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12 text-right px-8">Latency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLogsLoading ? (
                    [...Array(3)].map((_, i) => (
                      <TableRow key={i} className="border-white/5">
                        <TableCell className="px-8 py-5"><div className="h-4 w-32 bg-white/5 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-4 w-12 bg-white/5 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-4 w-40 bg-white/5 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-6 w-16 bg-white/5 rounded-full animate-pulse" /></TableCell>
                        <TableCell className="px-8 py-5"><div className="h-4 w-16 bg-white/5 rounded animate-pulse ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : logs && logs.length > 0 ? (
                    logs.map((log) => (
                      <TableRow key={log.id} className="border-white/5 hover:bg-white/[0.03] transition-colors group">
                        <TableCell className="px-8 py-5 text-xs text-white/70 font-medium">
                          {format(new Date(log.timestamp), 'MMM dd, HH:mm:ss')}
                        </TableCell>
                        <TableCell>
                          <span className="text-[10px] font-black font-mono text-muted-foreground uppercase">{log.method}</span>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs text-primary/80 font-mono">{log.endpoint}</code>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "text-[9px] uppercase font-black px-2 py-0.5 border-none",
                            log.status < 400 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                          )}>
                            {log.status} {log.status < 400 ? "OK" : "Error"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right px-8">
                          <span className="text-xs font-mono text-muted-foreground">{log.latency}ms</span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center gap-3 opacity-30">
                          <div className="h-16 w-16 rounded-3xl bg-white/5 flex items-center justify-center">
                            <Activity className="h-8 w-8 text-white/50" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-white">Waiting for API traffic...</p>
                            <p className="text-xs text-muted-foreground">Requests authenticated with your token will appear here.</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
