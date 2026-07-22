'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/sections/hero';
import VoiceDesignerDemo from '@/components/sections/voice-designer-demo';
import FeaturesSection from '@/components/sections/features';
import ExamplePrompts from '@/components/sections/example-prompts';
import LanguagesSection from '@/components/sections/languages';
import HowItWorks from '@/components/sections/how-it-works';
import PricingSection from '@/components/sections/pricing';
import FaqSection from '@/components/sections/faq';
import FinalCTASection from '@/components/sections/final-cta';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  // Defer rendering of complex interactive components until after hydration
  // to prevent client-side exceptions during the initial load on mobile.
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="dark min-h-screen bg-[#0B0B0F] scroll-smooth selection:bg-primary/30">
      <Header />
      <main className="flex-1">
        <HeroSection />
        {mounted && (
          <>
            <VoiceDesignerDemo />
            <ExamplePrompts />
            <HowItWorks />
            <FeaturesSection />
            <LanguagesSection />
            <PricingSection />
            <FaqSection />
            <FinalCTASection />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
