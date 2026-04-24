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
  FileLock, 
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
  { id: 'ccpa', title: '5. CCPA Rights', icon: FileLock },
  { id: 'cookies', title: '6. Cookies Policy', icon: ShieldCheck },
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
                  <span>Privacy Protection</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-tight">
                  Privacy Policy & <span className="text-primary">CCPA</span>
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
                    At QuantosAI, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our AI voice synthesis platform.
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
                    <li><strong>Payment Info:</strong> Transaction IDs and billing status (processed securely via Razorpay; we do not store credit card numbers).</li>
                    <li><strong>Content Data:</strong> The text you input for synthesis and the resulting audio files (stored to provide you with history).</li>
                  </ul>
                </Section>

                <Section id="usage" title="3. How We Use Data" icon={UserCheck}>
                  <p>
                    Your data is used primarily to facilitate the voice synthesis process and manage your subscription:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>To provide and maintain the QuantosAI service.</li>
                    <li>To notify you about changes to our service or your account balance.</li>
                    <li>To provide customer support and troubleshoot technical issues.</li>
                    <li>To detect and prevent fraudulent usage or violations of our Terms of Service.</li>
                  </ul>
                </Section>

                <Section id="security" title="4. Data Security" icon={Lock}>
                  <p>
                    The security of your data is a top priority. QuantosAI uses industry-standard encryption protocols (SSL/TLS) for all data in transit and at rest.
                  </p>
                  <p>
                    Access to your account and generated content is strictly restricted to you through Firebase Authentication. We regularly audit our systems to ensure compliance with modern security standards.
                  </p>
                </Section>

                <Section id="ccpa" title="5. CCPA Rights (California Residents)" icon={FileLock}>
                  <p>
                    If you are a resident of California, the CCPA provides you with specific rights regarding your personal information:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Right to Know:</strong> You can request a disclosure of the categories and specific pieces of personal data we have collected about you.</li>
                    <li><strong>Right to Delete:</strong> You can request the deletion of your personal information, subject to certain exceptions.</li>
                    <li><strong>Right to Opt-Out:</strong> QuantosAI does not "sell" your personal information to third parties in the traditional sense. You can opt-out of any data sharing used for marketing.</li>
                    <li><strong>Non-Discrimination:</strong> We will not discriminate against you for exercising any of your CCPA rights.</li>
                  </ul>
                </Section>

                <Section id="cookies" title="6. Cookies Policy" icon={ShieldCheck}>
                  <p>
                    We use cookies to keep you logged in and remember your studio preferences (like selected voices and stability settings).
                  </p>
                  <p>
                    You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some parts of our Service.
                  </p>
                </Section>
              </div>

              <div className="pt-12 border-t border-white/5 flex flex-col items-center lg:items-start gap-8">
                <div className="text-center lg:text-left">
                  <p className="text-muted-foreground text-sm mb-4">Have questions about your data? Our DPO is here to help.</p>
                  <Button asChild className="bg-primary hover:bg-primary/90 rounded-xl px-8 font-black shadow-lg shadow-primary/20 btn-glow">
                    <Link href="mailto:privacy@quantosai.com" className="text-white">Contact Privacy Team</Link>
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em]">
                  © {new Date().getFullYear()} QuantosAI Privacy Systems
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
                <Lock className="h-8 w-8 text-primary mb-4" />
                <h4 className="text-lg font-bold text-white mb-2">GDPR Compliance</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  While our focus here is CCPA, QuantosAI also adheres to strict GDPR standards for our users in the European Union.
                </p>
                <Button variant="link" asChild className="p-0 h-auto text-primary text-[10px] font-black uppercase tracking-widest mt-4">
                  <Link href="/terms">View Terms of Service →</Link>
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
