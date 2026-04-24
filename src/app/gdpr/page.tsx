'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import Footer from '@/components/layout/footer';
import { 
  ChevronLeft, 
  ShieldCheck, 
  Database, 
  Lock, 
  UserCheck, 
  Globe,
  Scale,
  List,
  Fingerprint
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
  { id: 'overview', title: '1. GDPR Overview', icon: Scale },
  { id: 'rights', title: '2. Your Rights', icon: UserCheck },
  { id: 'collection', title: '3. Data Processing', icon: Database },
  { id: 'security', title: '4. Security Measures', icon: Lock },
  { id: 'transfers', title: '5. Data Transfers', icon: Globe },
];

export default function GDPRPage() {
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
                  <ShieldCheck className="h-3.5 w-3.5 fill-current" />
                  <span>EU Compliance Notice</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-tight">
                  GDPR <span className="text-primary">Policy</span>
                </h1>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    General Data Protection Regulation
                  </div>
                </div>
              </header>

              <div className="prose prose-invert max-w-none space-y-16">
                <Section id="overview" title="1. GDPR Overview" icon={Scale}>
                  <p>
                    QuantosAI is committed to protecting the privacy and security of our users' personal data. This GDPR Policy explains how we comply with the General Data Protection Regulation (GDPR) for our users in the European Economic Area (EEA).
                  </p>
                  <p>
                    We act as the "Data Controller" for your account information and the "Data Processor" for the content you upload for voice synthesis.
                  </p>
                </Section>

                <Section id="rights" title="2. Your Individual Rights" icon={UserCheck}>
                  <p>Under GDPR, you have the following rights regarding your personal data:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Right of Access:</strong> Request a copy of the data we hold about you.</li>
                    <li><strong>Right to Rectification:</strong> Correct any inaccurate or incomplete data.</li>
                    <li><strong>Right to Erasure (Right to be Forgotten):</strong> Request deletion of your data under certain conditions.</li>
                    <li><strong>Right to Data Portability:</strong> Transfer your data to another service provider in a machine-readable format.</li>
                    <li><strong>Right to Object:</strong> Object to specific processing activities, such as direct marketing.</li>
                  </ul>
                </Section>

                <Section id="collection" title="3. Lawful Basis for Processing" icon={Database}>
                  <p>We process your data under the following legal bases:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Contractual Necessity:</strong> To provide the voice synthesis services you've subscribed to.</li>
                    <li><strong>Consent:</strong> When you explicitly agree to processing (e.g., marketing emails).</li>
                    <li><strong>Legitimate Interests:</strong> To improve our neural models and ensure platform security.</li>
                  </ul>
                </Section>

                <Section id="security" title="4. Security Measures" icon={Lock}>
                  <p>
                    We implement technical and organizational measures to ensure a level of security appropriate to the risk, including encryption of data at rest (AES-256) and in transit (TLS 1.3).
                  </p>
                  <p>
                    Access to personal data is restricted to authorized personnel who need the information to perform their job functions.
                  </p>
                </Section>

                <Section id="transfers" title="5. International Data Transfers" icon={Globe}>
                  <p>
                    Your information may be transferred to and maintained on computers located outside of your state or country where data protection laws may differ.
                  </p>
                  <p>
                    For transfers out of the EEA, we use Standard Contractual Clauses (SCCs) approved by the European Commission to ensure your data remains protected.
                  </p>
                </Section>
              </div>

              <div className="pt-12 border-t border-white/5 space-y-8">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                  <h3 className="text-white font-bold mb-2">Contact Us</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    If you have any questions regarding our GDPR compliance or your personal data, please reach out to our Data Protection Officer at <a href="mailto:support@quantisai.com" className="text-primary hover:underline font-bold">support@quantisai.com</a>.
                  </p>
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
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">Policy Sections</h3>
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
                <h4 className="text-lg font-bold text-white mb-2">EU Representation</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We maintain a representative in the EU to handle local privacy inquiries and regulatory compliance.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
