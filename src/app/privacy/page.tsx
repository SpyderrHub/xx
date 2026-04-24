'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import Footer from '@/components/layout/footer';
import { 
  ChevronLeft, 
  ShieldCheck, 
  Lock, 
  Eye, 
  Clock, 
  UserCheck, 
  List,
  Database
} from 'lucide-react';

const Section = ({ id, title, icon: Icon, children }: { id: string; title: string; icon: any; children: React.ReactNode }) => (
  <section id={id} className="space-y-4 scroll-mt-24">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
    </div>
    <div className="text-muted-foreground leading-relaxed space-y-4 text-lg ml-1">
      {children}
    </div>
  </section>
);

const tocItems = [
  { id: 'introduction', title: '1. Introduction', icon: Eye },
  { id: 'collection', title: '2. Information We Collect', icon: Database },
  { id: 'usage', title: '3. How We Use Data', icon: UserCheck },
  { id: 'security', title: '4. Data Security', icon: Lock },
  { id: 'cookies', title: '5. Cookies Policy', icon: ShieldCheck },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white selection:bg-primary/30">
      {/* Background Neural Glows */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo className="h-7 transition-transform group-hover:scale-105" />
          </Link>
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-white">
            <Link href="/dashboard">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Studio
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16 lg:py-24 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-16"
            >
              <header className="space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                  <ShieldCheck className="h-3.5 w-3.5 fill-current" />
                  <span>Privacy Shield</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-tight">
                  Privacy <span className="text-primary">Policy</span>
                </h1>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Last Updated: March 2024
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    Secure & Verified
                  </div>
                </div>
              </header>

              <div className="prose prose-invert max-w-none space-y-16">
                <Section id="introduction" title="1. Introduction" icon={Eye}>
                  <p>
                    At QuantisAI, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our AI voice synthesis platform.
                  </p>
                  <p>
                    By using our services, you consent to the data practices described in this policy. We designed our platform to ensure that your generated audio content remains your property and your personal details are encrypted.
                  </p>
                </Section>

                <Section id="collection" title="2. Information We Collect" icon={Database}>
                  <p>
                    We collect information that helps us provide a better experience and maintain the security of our platform:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Account Data:</strong> Email address, name, and profile settings when you register.</li>
                    <li><strong>Usage Data:</strong> Number of characters synthesized, voice IDs used, and generation timestamps.</li>
                    <li><strong>Payment Info:</strong> Transaction IDs and billing status (processed securely via Razorpay).</li>
                    <li><strong>Content Data:</strong> The text you input for synthesis and the resulting audio files.</li>
                  </ul>
                </Section>

                <Section id="usage" title="3. How We Use Data" icon={UserCheck}>
                  <p>
                    Your data is used primarily to facilitate the voice synthesis process and manage your subscription:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>To provide and maintain the QuantisAI service.</li>
                    <li>To notify you about changes to our service or your account balance.</li>
                    <li>To provide customer support and troubleshoot technical issues.</li>
                    <li>To detect and prevent fraudulent usage.</li>
                  </ul>
                </Section>

                <Section id="security" title="4. Data Security" icon={Lock}>
                  <p>
                    The security of your data is a top priority. QuantisAI uses industry-standard encryption protocols (SSL/TLS) for all data in transit and at rest.
                  </p>
                  <p>
                    Access to your account and generated content is strictly restricted to you through Firebase Authentication. We regularly audit our systems to ensure compliance with modern security standards.
                  </p>
                </Section>

                <Section id="cookies" title="5. Cookies Policy" icon={ShieldCheck}>
                  <p>
                    We use cookies to keep you logged in and remember your studio preferences (like selected voices and stability settings).
                  </p>
                  <p>
                    You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some parts of our Service.
                  </p>
                </Section>
              </div>

              <div className="pt-12 border-t border-white/5 space-y-8">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                  <h3 className="text-white font-bold mb-2">Contact Us</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    If you have any questions about this Privacy Policy, please contact our privacy team at <a href="mailto:support@quantisai.com" className="text-primary hover:underline font-bold">support@quantisai.com</a>.
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em]">
                  © {new Date().getFullYear()} QuantisAI Privacy Systems
                </p>
              </div>
            </motion.div>
          </div>

          {/* Sidebar TOC */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-6">
                  <List className="h-5 w-5 text-primary" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">Table of Contents</h3>
                </div>
                <nav className="space-y-1">
                  {tocItems.map((item) => (
                    <Link
                      key={item.id}
                      href={`#${item.id}`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-white hover:bg-white/5 transition-all group"
                    >
                      <item.icon className="h-4 w-4 shrink-0 group-hover:text-primary transition-colors" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="p-8 rounded-[2rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/10">
                <ShieldCheck className="h-8 w-8 text-primary mb-4" />
                <h4 className="text-lg font-bold text-white mb-2">CCPA Compliance</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  California residents have additional rights regarding their personal data under the CCPA.
                </p>
                <Button variant="link" asChild className="p-0 h-auto text-primary text-[10px] font-black uppercase tracking-widest mt-4">
                  <Link href="/ccpa">View CCPA Notice →</Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
