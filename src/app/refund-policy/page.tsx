'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import Footer from '@/components/layout/footer';
import {
  ChevronLeft,
  Zap,
  RotateCcw,
  CreditCard,
  Clock,
  AlertTriangle,
  List,
  CheckCircle2,
  XCircle
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
  { id: 'cancellation', title: '1. Cancellation Policy', icon: XCircle },
  { id: 'refunds', title: '2. Refund Eligibility', icon: RotateCcw },
  { id: 'credits', title: '3. Character Credits', icon: Zap },
  { id: 'subscriptions', title: '4. Subscription Cycles', icon: Clock },
  { id: 'disputes', title: '5. Payment Disputes', icon: CreditCard },
  { id: 'contact', title: '6. Billing Support', icon: AlertTriangle },
];

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white selection:bg-primary/30">
      {/* Background Neural Glows */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-600/5 blur-[120px] rounded-full" />
      </div>

      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo className="h-7 transition-transform group-hover:scale-105" />
          </Link>
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-white">
            <Link href="/terms">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Terms
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
                  <CreditCard className="h-3.5 w-3.5 fill-current" />
                  <span>Billing Transparency</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-tight">
                  Refund <span className="text-primary">& Cancellation</span>
                </h1>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Effective: March 2024
                  </div>
                </div>
              </header>

              <div className="prose prose-invert max-w-none space-y-16">
                <Section id="cancellation" title="1. Cancellation Policy" icon={XCircle}>
                  <p>
                    You can cancel your QuantosAI subscription at any time through your Dashboard settings.
                  </p>
                  <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl">
                    <p className="font-bold text-white mb-2">Subscription Cancellations:</p>
                    <p className="text-sm leading-relaxed">
                      Subscriptions are managed through auto-pay for Credit and Debit card users. To prevent future charges, simply disable auto-pay from your Account → Subscription settings page. Your plan will remain active until the end of the current billing period at no additional cost.
                    </p>
                  </div>
                  <p className="mt-4">
                    Upon cancellation, you will retain access to your plan features and character balance until the end of the period you have paid for. No further charges will be applied.
                  </p>
                </Section>

                <Section id="refunds" title="2. Refund Eligibility" icon={RotateCcw}>
                  <p>
                    Due to the digital nature of our services and the immediate availability of synthesis resources, we generally do not offer refunds once a plan has been used.
                  </p>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-1" />
                      <p className="text-sm">Refunds may be granted if requested within 24 hours of purchase, provided that less than 1,000 characters have been synthesized.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-1" />
                      <p className="text-sm">Refunds will not be granted for accounts that have violated our Terms of Service (e.g., unauthorized cloning).</p>
                    </div>
                  </div>
                </Section>

                <Section id="credits" title="3. Character Credits" icon={Zap}>
                  <p>
                    Character credits from monthly or yearly plans do not roll over and are reset at the start of each new billing cycle.
                  </p>
                  <p>
                    <strong>Top-up Packs:</strong> Credits purchased via one-time top-ups never expire and are non-refundable once the transaction is complete, as they provide instant character volume.
                  </p>
                </Section>

                <Section id="subscriptions" title="4. Subscription Cycles" icon={Clock}>
                  <p>
                    Our service is billed on a recurring basis (monthly or yearly). It is the user's responsibility to manage their subscription and cancel before the renewal date if they no longer wish to use the service.
                  </p>
                  <p>
                    We provide renewal notifications via email 3 days prior to yearly renewals. Monthly renewals are processed automatically without prior notice.
                  </p>
                </Section>

                <Section id="disputes" title="5. Payment Disputes" icon={CreditCard}>
                  <p>
                    If you believe there has been an error in billing, please contact us immediately. We aim to resolve all billing inquiries within 48 hours.
                  </p>
                  <p className="text-sm italic">
                    Initiating a chargeback without contacting our support team first may lead to permanent suspension of your account and loss of all generated audio data.
                  </p>
                </Section>

                <Section id="contact" title="6. Billing Support" icon={AlertTriangle}>
                  <p>
                    For all refund requests or billing questions, please reach out to our dedicated billing team:
                  </p>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <p className="font-bold text-white mb-2">Email: billing@quantosai.com</p>
                    <p className="text-sm">Please include your account email and transaction ID.</p>
                  </div>
                </Section>
              </div>

              <div className="pt-12 border-t border-white/5 flex flex-col items-center lg:items-start gap-8">
                <div className="text-center lg:text-left">
                  <p className="text-muted-foreground text-sm mb-4">Need to discuss your plan?</p>
                  <Button asChild className="bg-primary hover:bg-primary/90 rounded-xl px-8 font-black shadow-lg shadow-primary/20 btn-glow">
                    <Link href="mailto:billing@quantosai.com" className="text-white">Contact Billing Support</Link>
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em]">
                  © {new Date().getFullYear()} QuantosAI Billing Systems
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
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">Policy Content</h3>
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
                <RotateCcw className="h-8 w-8 text-primary mb-4" />
                <h4 className="text-lg font-bold text-white mb-2">Secure Payments</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  All transactions are handled through Razorpay with 256-bit SSL encryption. We never store your card details.
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