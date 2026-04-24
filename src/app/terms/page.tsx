'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import Footer from '@/components/layout/footer';
import { ChevronLeft, Scale, ShieldCheck, Zap, ScrollText, Clock, AlertTriangle, List } from 'lucide-react';

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
  { id: 'acceptance', title: '1. Acceptance of Terms', icon: ScrollText },
  { id: 'registration', title: '2. Account Registration', icon: ShieldCheck },
  { id: 'payments', title: '3. Payments & Credits', icon: Zap },
  { id: 'ip', title: '4. Intellectual Property', icon: Scale },
  { id: 'prohibited', title: '5. Prohibited Content', icon: AlertTriangle },
  { id: 'termination', title: '6. Termination', icon: AlertTriangle },
];

export default function TermsPage() {
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
                  <Scale className="h-3.5 w-3.5 fill-current" />
                  <span>Legal Documentation</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-tight">
                  Terms of <span className="text-primary">Service</span>
                </h1>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Last Updated: March 2024
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Version 2.1
                  </div>
                </div>
              </header>

              <div className="prose prose-invert max-w-none space-y-16">
                <Section id="acceptance" title="1. Acceptance of Terms" icon={ScrollText}>
                  <p>
                    By accessing or using the QuantosAI platform (the "Service"), you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use the Service. QuantosAI provides an AI-powered voice synthesis platform designed for batch generation and professional vocal output.
                  </p>
                </Section>

                <Section id="registration" title="2. Account Registration" icon={ShieldCheck}>
                  <p>
                    To access certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>You are responsible for safeguarding your password.</li>
                    <li>You agree to notify us immediately of any unauthorized use of your account.</li>
                    <li>Accounts are for individual or authorized organizational use only.</li>
                  </ul>
                </Section>

                <Section id="payments" title="3. Payments, Credits & Subscriptions" icon={Zap}>
                  <p>
                    QuantosAI operates on a character-based credit system. Credits are consumed based on the length of input text synthesized into audio.
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Subscriptions:</strong> Monthly and Yearly plans (Starter, Creator, Pro) are billed in advance. All fees are non-refundable except where required by law.</li>
                    <li><strong>Character Limits:</strong> Your monthly character quota resets at the start of each billing cycle. Unused plan characters do not roll over.</li>
                    <li><strong>Top-up Credits:</strong> Credits purchased via one-time top-ups do not expire and will be used only after your monthly plan balance is exhausted.</li>
                  </ul>
                </Section>

                <Section id="ip" title="4. Intellectual Property & Ownership" icon={Scale}>
                  <p>
                    QuantosAI grants you a non-exclusive, worldwide, royalty-free license to use the audio content generated by the Service, subject to your plan type:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Free Plan:</strong> Generated audio may include a watermark. Commercial use is prohibited under the Free tier.</li>
                    <li><strong>Paid Plans:</strong> You own the copyright to the specific audio outputs generated. You are granted full commercial rights for use in videos, podcasts, games, and other media.</li>
                    <li><strong>Voice Models:</strong> QuantosAI retains ownership of the underlying neural models and voice architecture used to generate the audio.</li>
                  </ul>
                </Section>

                <Section id="prohibited" title="5. Prohibited Content & Ethics" icon={AlertTriangle}>
                  <p>
                    You may not use the Service to generate audio content that is:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Illegal, harmful, threatening, or promotes hate speech.</li>
                    <li>Designed to deceive or defraud (e.g., non-consensual deepfakes of private individuals).</li>
                    <li>Infringing on any third-party intellectual property or privacy rights.</li>
                  </ul>
                  <p className="bg-primary/5 border border-primary/20 p-4 rounded-xl text-sm italic">
                    Note: Voice cloning features require you to have explicit permission from the speaker. Cloning a voice without consent is a direct violation of these terms.
                  </p>
                </Section>

                <Section id="termination" title="6. Termination" icon={AlertTriangle}>
                  <p>
                    We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
                  </p>
                </Section>
              </div>

              <div className="pt-12 border-t border-white/5 space-y-8">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                  <h3 className="text-white font-bold mb-2">Contact Us</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    If you have any questions about these Terms of Service, please contact us at <a href="mailto:support@quantisai.com" className="text-primary hover:underline font-bold">support@quantisai.com</a>.
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em]">
                  © {new Date().getFullYear()} QuantosAI Synthesis Systems
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
                <h4 className="text-lg font-bold text-white mb-2">Your Privacy Matters</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We are committed to protecting your data and intellectual property. Read our full policy to see how we handle your generated audio.
                </p>
                <Button variant="link" asChild className="p-0 h-auto text-primary text-[10px] font-black uppercase tracking-widest mt-4">
                  <Link href="/privacy">View Privacy Policy →</Link>
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
