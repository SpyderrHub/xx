import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/sections/hero';
import VoiceDesignerDemo from '@/components/sections/voice-designer-demo';
import VoiceSamplesSection from '@/components/sections/voice-samples';
import FeaturesSection from '@/components/sections/features';
import ExamplePrompts from '@/components/sections/example-prompts';
import LanguagesSection from '@/components/sections/languages';
import HowItWorks from '@/components/sections/how-it-works';
import VoiceQualitySection from '@/components/sections/voice-quality';
import CodeIntegrationSection from '@/components/sections/code-integration';
import Testimonials from '@/components/sections/testimonials';
import PricingSection from '@/components/sections/pricing';
import FaqSection from '@/components/sections/faq';
import FinalCTASection from '@/components/sections/final-cta';

export default function Home() {
  return (
    <div className="dark min-h-screen bg-[#0B0B0F] scroll-smooth selection:bg-primary/30">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <VoiceSamplesSection />
        <VoiceDesignerDemo />
        <ExamplePrompts />
        <HowItWorks />
        <VoiceQualitySection />
        <FeaturesSection />
        <LanguagesSection />
        <CodeIntegrationSection />
        <Testimonials />
        <PricingSection />
        <FaqSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
}
