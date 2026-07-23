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
  Database,
  Share2,
  Scale,
  Mail,
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
  { id: 'introduction', title: '1. Introduction', icon: List },
  { id: 'collection', title: '2. Information We Collect', icon: Database },
  { id: 'usage', title: '3. How We Use Your Information', icon: Eye },
  { id: 'sharing', title: '4. Data Sharing', icon: Share2 },
  { id: 'security', title: '5. Data Security', icon: Lock },
  { id: 'rights', title: '6. Your Rights', icon: UserCheck },
  { id: 'contact', title: '7. Contact Us', icon: Mail },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white selection:bg-primary/30">
      {/* Background Neural Glows */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full" />
      </div>

      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo className="h-7 transition-transform group-hover:scale-105" />
          </Link>
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-white">
            <Link href="/">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Home
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
                  <span>Privacy Architecture</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-tight">
                  Privacy <span className="text-primary">Policy</span>
                </h1>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Last Updated: July 22, 2026
                  </div>
                  <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-primary" />
                    Legal Compliance
                  </div>
                </div>
              </header>

              <div className="prose prose-invert max-w-none space-y-16">
                <Section id="introduction" title="1. Introduction" icon={List}>
                  <p>
                    Welcome to QuantisAI Labs. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our AI-powered voice synthesis platform.
                  </p>
                  <p>
                    By using our service, you agree to the collection and use of information in accordance with this policy.
                  </p>
                </Section>

                <Section id="collection" title="2. Information We Collect" icon={Database}>
                  <p>
                    We collect information that you provide directly to us when you register for an account, use our studio tools, or communicate with us.
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Account Information:</strong> Name, email address, and profile preferences.</li>
                    <li><strong>Synthesis Data:</strong> Text scripts you input and audio samples you provide for analysis.</li>
                    <li><strong>Payment Information:</strong> Handled by secure third-party processors. We do not store financial credentials.</li>
                  </ul>
                </Section>

                <Section id="usage" title="3. How We Use Your Information" icon={Eye}>
                  <p>We use the information we collect to provide and improve our services, including:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Generating high-quality AI voices and audio files.</li>
                    <li>Processing subscriptions and managing account standing.</li>
                    <li>Communicating critical service updates and support responses.</li>
                  </ul>
                </Section>

                <Section id="sharing" title="4. Data Sharing" icon={Share2}>
                  <p>
                    We do not sell your personal information. Data is shared only with necessary service providers for infrastructure and payment processing.
                  </p>
                </Section>

                <Section id="security" title="5. Data Security" icon={Lock}>
                  <p>
                    We implement industry-standard encryption and security protocols to protect your data. However, no digital transmission is 100% secure.
                  </p>
                </Section>

                <Section id="rights" title="6. Your Rights" icon={UserCheck}>
                  <p>
                    You have the right to access, correct, or request deletion of your personal data. Most preferences can be managed directly in your Dashboard.
                  </p>
                </Section>

                <Section id="contact" title="7. Contact Us" icon={Mail}>
                  <p>
                    For any questions regarding this policy, contact our legal team at <a href="mailto:support@quantisai.org" className="text-primary hover:underline">support@quantisai.org</a>.
                  </p>
                </Section>
              </div>

              <div className="pt-12 border-t border-white/5">
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em]">
                  © {new Date().getFullYear()} QuantisAI Labs Legal Systems
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
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">Sections</h3>
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
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
