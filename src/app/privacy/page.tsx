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
  </section>Section id=" contact" title="13. Contact Us" icon={Mail}>
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
