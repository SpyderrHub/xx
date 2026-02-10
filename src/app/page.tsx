
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/sections/hero';
import FeaturesSection from '@/components/sections/features';
import ApiShowcaseSection from '@/components/sections/api-showcase';
import PricingSection from '@/components/sections/pricing';
import LanguagesSection from '@/components/sections/languages';
import PlatformsSection from '@/components/sections/platforms';
import VoiceQualitySection from '@/components/sections/voice-quality';
import SocialProofSection from '@/components/sections/social-proof';
import FinalCTASection from '@/components/sections/final-cta';

export default function Home() {
  return (
    <div className="dark">
      <Header />
      <main className="flex-1 overflow-x-hidden">
        <HeroSection />
        <SocialProofSection />
        <VoiceQualitySection />
        <PlatformsSection />
        <FeaturesSection />
        <LanguagesSection />
        <ApiShowcaseSection />
        <PricingSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
}
