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
  CreditCard,
  Share2,
  Megaphone,
  Trash2,
  Scale,
  Baby,
  Globe,
  Cookie,
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
  { id: 'collection', title: '1. Information We Collect', icon: Database },
  { id: 'usage', title: '2. How We Use Your Information', icon: UserCheck },
  { id: 'payment', title: '3. Payment Information', icon: CreditCard },
  { id: 'third-party', title: '4. Third-Party Services', icon: Share2 },
  { id: 'advertising', title: '5. Advertising', icon: Megaphone },
  { id: 'retention', title: '6. Data Retention', icon: Clock },
  { id: 'security', title: '7. Data Security', icon: Lock },
  { id: 'deletion', title: '8. Account Deletion', icon: Trash2 },
  { id: 'rights', title: '9. Your Privacy Rights', icon: Scale },
  { id: 'children', title: '10. Children’s Privacy', icon: Baby },
  { id: 'transfers', title: '11. International Data Transfers', icon: Globe },
  { id: 'cookies', title: '12. Cookies and Similar Technologies', icon: Cookie },
  { id: 'contact', title: '13. Contact Us', icon: Mail },
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
                    Last Updated: July 22, 2026
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    Secure & Verified
                  </div>
                </div>
                <p className="text-muted-foreground text-base max-w-2xl mx-auto lg:mx-0">
                  QuantisAI Labs (&quot;QuantisAI Labs&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy and handling your personal information responsibly. This Privacy Policy explains what information we collect, how we use it, how we protect it, and the choices available to you when you use the QuantisAI Labs website, Android application, and related services. By accessing or using QuantisAI Labs, you agree to the collection and use of information in accordance with this Privacy Policy.
                </p>
              </header>

              <div className="prose prose-invert max-w-none space-y-16">
                <Section id="collection" title="1. Information We Collect" icon={Database}>
                  <p>To provide our AI-powered voice services, we collect the following information.</p>
                  <p className="font-bold text-white">Account Information</p>
                  <p>When you create an account, we collect:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Firebase User ID (UID)</li>
                    <li>Profile information</li>
                    <li>Account preferences</li>
                  </ul>
                  <p className="font-bold text-white">Subscription Information</p>
                  <p>To manage your subscription and credits, we collect:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Active subscription plan</li>
                    <li>Subscription status</li>
                    <li>Credits balance</li>
                    <li>Purchase history</li>
                    <li>Billing status</li>
                  </ul>
                  <p>
                    We do not collect or store your debit card, credit card, UPI, or other payment credentials. Payments are securely processed by our payment providers.
                  </p>
                  <p className="font-bold text-white">AI Service Data</p>
                  <p>Depending on the feature you use, we may process:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Text-to-Speech (TTS):</strong> Text entered for speech generation, selected voice, generation settings, generated audio.</li>
                    <li><strong>Speech-to-Text (STT):</strong> Audio files uploaded by you, speech transcription results.</li>
                    <li><strong>Voice Design:</strong> Voice customization settings, voice generation parameters, saved voice configurations.</li>
                  </ul>
                  <p className="font-bold text-white">Usage Information</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Characters processed</li>
                    <li>Voice IDs used</li>
                    <li>Number of generations</li>
                    <li>Request timestamps</li>
                    <li>Credits consumed</li>
                    <li>Feature usage statistics</li>
                  </ul>
                  <p className="font-bold text-white">Device &amp; Technical Information</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>IP address</li>
                  </ul>
                  <p className="font-bold text-white">Analytics Information</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>App usage statistics</li>
                    <li>Session information</li>
                    <li>Feature usage</li>
                    <li>Performance metrics</li>
                    <li>Anonymous diagnostic information</li>
                  </ul>
                </Section>

                <Section id="usage" title="2. How We Use Your Information" icon={UserCheck}>
                  <p>We use collected information to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide AI voice generation services</li>
                    <li>Process Speech-to-Text requests</li>
                    <li>Generate Text-to-Speech audio</li>
                    <li>Provide Voice Design features</li>
                    <li>Maintain your account</li>
                    <li>Manage subscriptions and credits</li>
                    <li>Authenticate users</li>
                    <li>Improve application performance</li>
                    <li>Detect fraud and abuse</li>
                    <li>Prevent unauthorized access</li>
                    <li>Monitor service reliability</li>
                    <li>Respond to customer support requests</li>
                    <li>Analyze usage trends</li>
                    <li>Fix bugs and technical issues</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </Section>

                <Section id="payment" title="3. Payment Information" icon={CreditCard}>
                  <p>Payments are securely processed by our payment providers.</p>
                  <p>For purchases made through our website, payments are processed by Razorpay.</p>
                  <p>For purchases made through the Android application distributed through Google Play, payments are processed using Google Play Billing.</p>
                  <p>
                    We do not store your payment card details, banking information, or UPI credentials. We receive only information necessary to confirm and manage your purchase, such as transaction status, subscription status, and transaction identifiers.
                  </p>
                </Section>

                <Section id="third-party" title="4. Third-Party Services" icon={Share2}>
                  <p>To operate our services, we use trusted third-party providers, including:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Firebase Authentication</li>
                    <li>Cloud Firestore</li>
                    <li>Cloudflare R2 Storage</li>
                    <li>Firebase Analytics</li>
                    <li>Firebase Crashlytics</li>
                    <li>Google AdMob</li>
                    <li>Razorpay (Website payments)</li>
                    <li>Google Play Billing (Android purchases)</li>
                  </ul>
                  <p>These providers may process information as necessary to provide their respective services under their own privacy policies.</p>
                </Section>

                <Section id="advertising" title="5. Advertising" icon={Megaphone}>
                  <p>The Android application display advertisements using Google AdMob.</p>
                  <p>AdMob may collect certain device information and advertising identifiers in accordance with Google&apos;s privacy policies to serve and measure advertisements.</p>
                </Section>

                <Section id="retention" title="6. Data Retention" icon={Clock}>
                  <p>We retain information only for as long as necessary to provide our services. Specifically:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>User accounts are retained until the user requests deletion.</li>
                    <li>Generated audio files are automatically deleted approximately 24 hours after generation.</li>
                    <li>Uploaded audio files used for Speech-to-Text are automatically deleted after processing unless temporary retention is required for service operation.</li>
                    <li>Text inputs used for AI generation are processed to provide the requested service and are not retained longer than necessary for service operation.</li>
                    <li>Speech transcription history may be stored in your account until you delete it.</li>
                    <li>Subscription and transaction records may be retained as required for legal, accounting, or operational purposes.</li>
                  </ul>
                </Section>

                <Section id="security" title="7. Data Security" icon={Lock}>
                  <p>
                    We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Secure HTTPS communication</li>
                    <li>Encryption where appropriate</li>
                    <li>Secure authentication through Firebase Authentication</li>
                    <li>Restricted administrative access</li>
                    <li>Regular monitoring for security issues</li>
                  </ul>
                  <p>While we strive to protect your information, no method of transmission or electronic storage can be guaranteed to be completely secure.</p>
                </Section>

                <Section id="deletion" title="8. Account Deletion" icon={Trash2}>
                  <p>You may request deletion of your QuantisAI Labs account at any time. When your account is deleted:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Your account information will be removed.</li>
                    <li>Authentication credentials will be deleted.</li>
                    <li>Associated personal information will be deleted unless retention is required by applicable law.</li>
                    <li>Generated content and user data associated with your account will be removed according to our data retention practices.</li>
                  </ul>
                  <p>Some information may be retained where required for legal obligations, fraud prevention, dispute resolution, or legitimate business purposes.</p>
                </Section>

                <Section id="rights" title="9. Your Privacy Rights" icon={Scale}>
                  <p>Depending on your location and applicable laws, you may have the right to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access your personal information.</li>
                    <li>Correct inaccurate information.</li>
                    <li>Delete your personal information.</li>
                    <li>Request a copy of your personal information.</li>
                    <li>Withdraw consent where applicable.</li>
                    <li>Object to certain processing activities.</li>
                  </ul>
                  <p>To exercise these rights, please contact us using the information provided below.</p>
                </Section>

                <Section id="children" title="10. Children's Privacy" icon={Baby}>
                  <p>
                  QuantisAI Labs is not intended for use by individuals under 18 years of age. We do not knowingly collect personal information from anyone under 18. If a parent or guardian becomes aware that their child has provided personal information to us without consent, please contact us at <a href="mailto:support@quantisai.org" className="text-primary hover:underline font-bold">support@quantisai.org</a>, and we will delete such information within 30 days of verification.
                  </p>
                </Section>

                <Section id="transfers" title="11. International Data Transfers" icon={Globe}>
                  <p>Your information may be processed and stored on servers located in different countries where our service providers operate.</p>
                  <p>
                    By using QuantisAI Labs, you understand that your information may be transferred to and processed in jurisdictions outside your country of residence, subject to appropriate safeguards where required by applicable law.
                  </p>
                </Section>

                <Section id="cookies" title="12. Cookies and Similar Technologies" icon={Cookie}>
                  <p>Our website may use cookies and similar technologies to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Keep you signed in</li>
                    <li>Remember your preferences</li>
                    <li>Improve website functionality</li>
                    <li>Analyze website performance</li>
                    <li>Enhance user experience</li>
                  </ul>
                  <p>The Android application may use local storage or similar technologies necessary for application functionality and performance.</p>
                  <p>You can control cookies through your browser settings. Disabling certain cookies may affect the functionality of the website.</p>
                </Section>

                <Section id="contact" title="13. Contact Us" icon={Mail}>
                  <p>
                    If you have any questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact us:
                  </p>
                  <p>
                    <strong className="text-white">QuantisAI Labs</strong>
                    <br />
                    Email: <a href="mailto:support@quantisai.org" className="text-primary hover:underline font-bold">support@quantisai.org</a>
                    <br />
                    Website: <a href="https://www.quantisai.org" className="text-primary hover:underline font-bold">https://www.quantisai.org</a>
                  </p>
                  <p>We will make reasonable efforts to respond to your request in a timely manner.</p>
                </Section>
              </div>

              <div className="pt-12 border-t border-white/5 space-y-8">
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
                  <Link href="#rights">View Your Rights →</Link>
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
