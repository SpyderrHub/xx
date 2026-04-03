
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SNIPPETS = {
  javascript: `const res = await fetch('https://api.quantisai.com/v1/tts', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: "Synthesizing batch audio at scale.",
    voice_id: "ryder-us-male",
    format: "mp3"
  })
});

const audioBlob = await res.blob();`,
  python: `import requests

url = "https://api.quantisai.com/v1/tts"
payload = {
    "text": "Synthesizing batch audio at scale.",
    "voice_id": "ryder-us-male",
    "format": "mp3"
}
headers = {"Authorization": "Bearer YOUR_API_KEY"}

response = requests.post(url, json=payload, headers=headers)
with open("output.mp3", "wb") as f:
    f.write(response.content)`,
  curl: `curl -X POST https://api.quantisai.com/v1/tts \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Synthesizing batch audio at scale.",
    "voice_id": "ryder-us-male"
  }'`
};

export default function CodeIntegrationSection() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('javascript');

  const handleCopy = () => {
    navigator.clipboard.writeText(SNIPPETS[activeTab as keyof typeof SNIPPETS]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24">
      <div className="container mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Terminal className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl leading-tight">
              Built For <br />
              <span className="text-primary">Batch Automation.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Don't manually click "Generate" 1,000 times. Our API is built for high-throughput batch processing with ~2s latency globally.
            </p>
            <ul className="space-y-4">
              {['RESTful Architecture', 'Pay-as-you-go Billing', 'Infinite Parallelism'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm font-bold text-white/80">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <Button variant="link" className="text-primary font-black uppercase tracking-widest p-0">
              View API Documentation →
            </Button>
          </div>

          <div className="glass-card rounded-[2rem] overflow-hidden border-white/5 bg-black/40">
            <div className="bg-white/5 p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/50" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                <div className="h-3 w-3 rounded-full bg-green-500/50" />
              </div>
              <div className="text-[10px] text-muted-foreground font-mono">endpoint: /v1/tts</div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-6 pt-4 flex items-center justify-between">
                <TabsList className="bg-white/5 border-none p-1 h-auto rounded-xl">
                  <TabsTrigger value="javascript" className="text-[10px] uppercase font-bold rounded-lg px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white">JavaScript</TabsTrigger>
                  <TabsTrigger value="python" className="text-[10px] uppercase font-bold rounded-lg px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white">Python</TabsTrigger>
                  <TabsTrigger value="curl" className="text-[10px] uppercase font-bold rounded-lg px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white">cURL</TabsTrigger>
                </TabsList>
                <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8 hover:bg-white/5 text-muted-foreground">
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="relative"
                  >
                    <pre className="font-mono text-sm leading-relaxed text-blue-400 overflow-x-auto scrollbar-hide">
                      <code>{SNIPPETS[activeTab as keyof typeof SNIPPETS]}</code>
                    </pre>
                  </motion.div>
                </AnimatePresence>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
}
