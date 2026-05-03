'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import Footer from '@/components/layout/footer';
import { 
  ChevronLeft, 
  Gift, 
  ShieldCheck, 
  Zap, 
  UserCheck, 
  Scale, 
  List,
  AlertTriangle,
  History,
  Coins
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
  { id: 'program-basics', title: '1. Program Basics', icon: Gift },
  { id: 'how-it-works', title: '2. Invitation Mechanics', icon: UserCheck },
  { id: 'rewards', title: '3. Reward Structure', icon: Coins },
  { id: 'eligibility', title: '4. Verification Rules', icon: ShieldCheck },
  { id: 'prohibited', title: '5. Prohibited Conduct', icon: AlertTriangle },
];

export default function AffiliateTermsPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white selection:bg-primary/30">
      {/* Background Neural Glows */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>

      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo className="h-7 transition-transform group-hover:scale-105" />
          </Link>
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-white">
            <Link href="/dashboard/referrals">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Referrals
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
                  <Gift className="h-3.5 w-3.5 fill-current" />
                  <span>Affiliate Studio Policy</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-tight">
                  Refer & Earn <span className="text-primary">Program</span>
                </h1>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-primary" />
                    Last Updated: March 2024
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    Instant Rewards
                  </div>
                </div>
              </header>

              <div className="prose prose-invert max-w-none space-y-16">
                <Section id="program-basics" title="1. Program Basics" icon={Gift}>
                  <p>
                    The QuantisAI Refer & Earn program is designed to reward our active community members for spreading the word about our studio-quality AI synthesis. By participating, you help build a network of creators while earning characters to fuel your own projects.
                  </p>
                  <p>
                    Participation in the program is currently limited to users with an <strong>active paid subscription</strong> (Starter, Creator, or Pro). Free-tier users can track successful invites but will only receive rewards upon upgrading their own account.
                  </p>
                </Section>

                <Section id="how-it-works" title="2. Invitation Mechanics" icon={UserCheck}>
                  <p>
                    Each eligible user is provided with a <strong>Unique Invitation Link</strong> containing a fixed referral code (e.g., <code>ref=ABC12345</code>). When a new visitor clicks this link, a secure cookie is placed in their browser for 30 days to attribute their activity to you.
                  </p>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <p className="font-bold text-white mb-2">The Attribution Process:</p>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      <li>The invitee must sign up while the referral session is active.</li>
                      <li>Our system automatically pairs the new account with your UID (Unique Identifier).</li>
                      <li>You can track the status of these invites in real-time via your <strong>Affiliate Dashboard</strong>.</li>
                    </ul>
                  </div>
                </Section>

                <Section id="rewards" title="3. Reward Structure" icon={Coins}>
                  <p>
                    We believe in rewarding high-quality referrals that contribute to the platform's growth. Our current reward is:
                  </p>
                  <div className="bg-primary/10 border-2 border-primary/20 p-8 rounded-3xl text-center">
                    <h3 className="text-3xl font-black text-white mb-2">5,000 Characters</h3>
                    <p className="text-primary font-bold uppercase tracking-widest text-sm">Per Verified Referral</p>
                  </div>
                  <p className="mt-6">
                    <strong>When is the reward given?</strong> Rewards are credited to your account <strong>immediately</strong> after your referred friend completes their first successful purchase of any paid plan (Starter, Creator, or Pro).
                  </p>
                  <p>
                    Unlike standard monthly credits, Referral Rewards are added to your <strong>Permanent Balance</strong>. They do not expire at the end of the billing cycle and are only consumed after your monthly plan allowance is exhausted.
                  </p>
                </Section>

                <Section id="eligibility" title="4. Verification Rules" icon={ShieldCheck}>
                  <p>
                    To ensure a fair environment for all users, every referral goes through an automated verification process:
                  </p>
                  <ul className="list-disc pl-6 space-y-3">
                    <li><strong>New Users Only:</strong> The referred user must be a new person who has never had a QuantisAI account previously.</li>
                    <li><strong>First Purchase:</strong> Rewards are only triggered on the invitee's first purchase. Subsequent renewals or plan upgrades do not trigger additional rewards.</li>
                    <li><strong>IP Verification:</strong> Our multi-account detection system verifies that the referrer and the invitee are distinct individuals using unique IP addresses and payment methods.</li>
                  </ul>
                </Section>

                <Section id="prohibited" title="5. Prohibited Conduct" icon={AlertTriangle}>
                  <p>
                    QuantisAI maintains a zero-tolerance policy for program abuse. Prohibited actions include, but are not limited to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li><strong>Self-Referral:</strong> Creating multiple accounts to refer yourself for credits.</li>
                    <li><strong>Spamming:</strong> Posting your link on coupon sites, review aggregators, or through unsolicited emails.</li>
                    <li><strong>Misrepresentation:</strong> Making false claims about QuantisAI features or pricing to lure sign-ups.</li>
                  </ul>
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-xs text-red-400 font-bold uppercase tracking-wider">
                    Violation of these terms will result in immediate forfeiture of all referral credits and permanent suspension of your QuantisAI account.
                  </div>
                </Section>
              </div>

              <div className="pt-12 border-t border-white/5 space-y-8">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                  <h3 className="text-white font-bold mb-2">Questions?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    If you believe a referral wasn't tracked correctly or have questions about your balance, contact our affiliate team at <a href="mailto:affiliates@quantisai.com" className="text-primary hover:underline font-bold">affiliates@quantisai.com</a>.
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em]">
                  © {new Date().getFullYear()} QuantisAI Affiliate Systems
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
                <Zap className="h-8 w-8 text-primary mb-4" />
                <h4 className="text-lg font-bold text-white mb-2">Growth Leaderboard</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Join the top 1% of referrers to unlock exclusive beta access and priority voice cloning features.
                </p>
                <Button variant="link" asChild className="p-0 h-auto text-primary text-[10px] font-black uppercase tracking-widest mt-4">
                  <Link href="/dashboard/referrals">View Leaderboard →</Link>
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
