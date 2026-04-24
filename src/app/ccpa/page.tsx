'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import Footer from '@/components/layout/footer';
import { 
  ChevronLeft, 
  FileLock, 
  Clock, 
  Lock, 
  List,
  UserCheck,
  Search,
  Trash2,
  Scale,
  Hand
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
  { id: 'introduction', title: '1. Introduction', icon: Scale },
  { id: 'right-to-know', title: '2. Right to Know', icon: Search },
  { id: 'right-to-delete', title: '3. Right to Delete', icon: Trash2 },
  { id: 'opt-out', title: '4. Right to Opt-Out', icon: Hand },
  { id: 'non-discrimination', title: '5. Non-Discrimination', icon: UserCheck },
];

export default function CCPAPage() {
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
            <Link href="/privacy">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Privacy
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
                  <FileLock className="h-3.5 w-3.5 fill-current" />
                  <span>California Consumer Privacy Act</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-tight">
                  CCPA <span className="text-primary">Notice</span>
                </h1>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Last Updated: March 2024
                  </div>
                  <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-primary" />
                    State Compliance
                  </div>
                </div>
              </header>

              <div className="prose prose-invert max-w-none space-y-16">
                <Section id="introduction" title="1. Introduction" icon={Scale}>
                  <p>
                    This CCPA Notice for California Residents supplements the information contained in our Privacy Policy and applies solely to all visitors, users, and others who reside in the State of California.
                  </p>
                  <p>
                    The California Consumer Privacy Act of 2018 (CCPA) provides California residents with specific rights regarding their personal information. This section describes those rights and explains how to exercise them.
                  </p>
                </Section>

                <Section id="right-to-know" title="2. Right to Know" icon={Search}>
                  <p>
                    You have the right to request that QuantosAI disclose certain information to you about our collection and use of your personal information over the past 12 months:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>The categories of personal information we collected about you.</li>
                    <li>The categories of sources for the personal information we collected about you.</li>
                    <li>Our business or commercial purpose for collecting that personal information.</li>
                    <li>The specific pieces of personal information we collected about you.</li>
                  </ul>
                </Section>

                <Section id="right-to-delete" title="3. Right to Delete" icon={Trash2}>
                  <p>
                    You have the right to request that QuantosAI delete any of your personal information that we collected from you and retained, subject to certain exceptions.
                  </p>
                  <p>
                    Once we receive and confirm your verifiable consumer request, we will delete (and direct our service providers to delete) your personal information from our records, unless an exception applies (such as completing a transaction or complying with legal obligations).
                  </p>
                </Section>

                <Section id="opt-out" title="4. Right to Opt-Out" icon={Hand}>
                  <p>
                    QuantosAI does not "sell" personal information in the traditional sense. However, like many online services, we may use cookies or advertising IDs to provide you with personalized experiences.
                  </p>
                  <p>
                    You have the right to opt-out of the "sale" or "sharing" of your personal information for cross-context behavioral advertising. You can exercise this right through your browser settings or by contacting our support team.
                  </p>
                </Section>

                <Section id="non-discrimination" title="5. Non-Discrimination" icon={UserCheck}>
                  <p>
                    We will not discriminate against you for exercising any of your CCPA rights. Unless permitted by the CCPA, we will not:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Deny you goods or services.</li>
                    <li>Charge you different prices or rates for goods or services.</li>
                    <li>Provide you a different level or quality of goods or services.</li>
                  </ul>
                </Section>
              </div>

              <div className="pt-12 border-t border-white/5 space-y-8">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                  <h3 className="text-white font-bold mb-2">Contact Us</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    California residents may exercise their privacy rights or ask questions about our CCPA compliance by emailing us at <a href="mailto:support@quantisai.com" className="text-primary hover:underline font-bold">support@quantisai.com</a>.
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em]">
                  © {new Date().getFullYear()} QuantosAI Legal Systems
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
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">Notice Sections</h3>
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
                <h4 className="text-lg font-bold text-white mb-2">Privacy Policy</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  For information on how we handle data for non-California residents, please see our general policy.
                </p>
                <Button variant="link" asChild className="p-0 h-auto text-primary text-[10px] font-black uppercase tracking-widest mt-4">
                  <Link href="/privacy">Read Privacy Policy →</Link>
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
