'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Coins,
  Cookie,
  UserPlus,
  Rocket
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
  { id: 'invitation-mechanics', title: '2. Invitation Mechanics', icon: UserCheck },
  { id: 'reward-structure', title: '3. Reward Structure', icon: Coins },
  { id: 'verification-fraud', title: '4. Verification & Anti-Fraud', icon: ShieldCheck },
  { id: 'usage-policy', title: '5. Credit Usage Policy', icon: Rocket },
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
                  <span>Affiliate Studio Policy v2.0</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-tight">
                  Refer & Earn <br /><span className="text-primary">Detailed Terms</span>
                </h1>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-primary" />
                    Last Updated: March 2024
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    Instant Crediting
                  </div>
                </div>
              </header>

              <div className="prose prose-invert max-w-none space-y-20">
                <Section id="program-basics" title="1. Program Basics" icon={Gift}>
                  <p>
                    The QuantisAI Refer & Earn program (the "Program") is designed to reward our active creators for expanding the community. By participating, you become an authorized affiliate of the platform, eligible to earn character credits through verified user acquisition.
                  </p>
                  <p>
                    <strong>Eligibility:</strong> Participation is currently restricted to users with an active paid subscription (Starter, Creator, or Pro). Free-tier users can generate a referral code but will only unlock the reward distribution mechanism upon their first subscription activation.
                  </p>
                </Section>

                <Section id="invitation-mechanics" title="2. Invitation Mechanics" icon={UserCheck}>
                  <p>
                    Each affiliate is assigned a unique, fixed referral code (e.g., <code>ref=ABC12345</code>). This code is used to generate your <strong>Invitation Link</strong>.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                      <Cookie className="h-6 w-6 text-primary mb-3" />
                      <h4 className="text-white font-bold mb-2">Tracking Cookie</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        When a visitor clicks your link, a 30-day attribution cookie is stored. If they sign up within this window, the account is permanently linked to your UID.
                      </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                      <UserPlus className="h-6 w-6 text-primary mb-3" />
                      <h4 className="text-white font-bold mb-2">Attribution</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Attribution is based on a "Last Click" model. The most recent referral link clicked by the user before registration will receive the credit.
                      </p>
                    </div>
                  </div>
                </Section>

                <Section id="reward-structure" title="3. Reward Structure" icon={Coins}>
                  <p>
                    We provide a fixed reward for every high-quality referral that contributes to the growth of the QuantisAI ecosystem.
                  </p>
                  <div className="bg-primary/10 border-2 border-primary/20 p-8 rounded-[2.5rem] text-center my-8">
                    <h3 className="text-4xl font-black text-white mb-2">5,000 Characters</h3>
                    <p className="text-primary font-bold uppercase tracking-[0.2em] text-sm">Per Verified Purchase</p>
                  </div>
                  <ul className="space-y-4 text-lg">
                    <li className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2.5 shrink-0" />
                      <span><strong>The Trigger:</strong> Rewards are only issued when your referred friend completes their <strong>first successful purchase</strong> of any paid plan.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2.5 shrink-0" />
                      <span><strong>Instant Crediting:</strong> Credits are added to your balance automatically the second the payment is verified by our gateway.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2.5 shrink-0" />
                      <span><strong>Permanent Balance:</strong> Unlike monthly plan credits, Referral Rewards are added to your permanent character pool. They <strong>never expire</strong> and carry over indefinitely.</span>
                    </li>
                  </ul>
                </Section>

                <Section id="verification-fraud" title="4. Verification & Anti-Fraud" icon={ShieldCheck}>
                  <p>
                    To maintain a fair ecosystem, every referral is subjected to our automated <strong>Integrity Engine</strong>.
                  </p>
                  <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-6">
                    <div className="space-y-2">
                      <h4 className="text-white font-bold">What counts as a "Verified Referral"?</h4>
                      <p className="text-sm text-muted-foreground">A new user with a unique IP address, unique payment method, and no prior QuantisAI accounts who successfully activates a paid plan.</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-red-400 font-bold flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Prohibited Conduct
                      </h4>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                        <li><strong>Self-Referral:</strong> Creating secondary accounts to refer yourself.</li>
                        <li><strong>Incentivized Traffic:</strong> Offering cash or "bounties" to users for clicking your link.</li>
                        <li><strong>Link Spamming:</strong> Posting links on coupon sites, deal aggregators, or through automated bot comments.</li>
                      </ul>
                    </div>
                  </div>
                </Section>

                <Section id="usage-policy" title="5. Credit Usage Policy" icon={Rocket}>
                  <p>
                    QuantisAI prioritizes the consumption of credits in a specific order to maximize user benefit:
                  </p>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-sm font-bold text-white">Consumption Priority 1</span>
                      <Badge variant="outline" className="text-[10px]">Monthly Plan Credits</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">Consumption Priority 2</span>
                      <Badge variant="secondary" className="text-[10px] bg-primary/20 text-primary">Permanent Referral Credits</Badge>
                    </div>
                  </div>
                  <p className="text-sm italic">
                    Note: Referral credits are only used after your current monthly plan allowance has been fully exhausted for the cycle.
                  </p>
                </Section>
              </div>

              <div className="pt-12 border-t border-white/5 space-y-8">
                <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 space-y-2">
                    <h3 className="text-white font-bold text-xl">Ready to grow your studio?</h3>
                    <p className="text-sm text-muted-foreground">
                      Head over to your affiliate dashboard to copy your link and start inviting your network today.
                    </p>
                  </div>
                  <Button asChild className="rounded-2xl h-14 px-8 bg-primary font-black btn-glow">
                    <Link href="/dashboard/referrals">Open Affiliate Studio</Link>
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em] text-center">
                  © {new Date().getFullYear()} QuantisAI Billing & Affiliate Systems
                </p>
              </div>
            </motion.div>
          </div>

          {/* Sidebar TOC */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-md">
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

              <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/10">
                <ShieldCheck className="h-8 w-8 text-primary mb-4" />
                <h4 className="text-lg font-bold text-white mb-2">Safe & Fair</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We verify every purchase to ensure that our creators are rewarded for bringing real value to the platform.
                </p>
                <Button variant="link" asChild className="p-0 h-auto text-primary text-[10px] font-black uppercase tracking-widest mt-4">
                  <Link href="mailto:support@quantisai.org">Contact Affiliate Support →</Link>
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
