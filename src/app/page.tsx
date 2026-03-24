import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/sections/hero';
import ComparisonSlider from '@/components/sections/comparison-slider';
import VoiceSamplesSection from '@/components/sections/voice-samples';
import FeaturesSection from '@/components/sections/features';
import CodeIntegrationSection from '@/components/sections/code-integration';
import PricingSection from '@/components/sections/pricing';
import FinalCTASection from '@/components/sections/final-cta';

export default function Home() {
  return (
    <div className="dark min-h-screen bg-[#0B0B0F]">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ComparisonSlider />
        <VoiceSamplesSection />
        <CodeIntegrationSection />
        <FeaturesSection />
        <PricingSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
}