import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/sections/hero';
import FeaturesSection from '@/components/sections/features';
import ApiShowcaseSection from '@/components/sections/api-showcase';
import PricingSection from '@/components/sections/pricing';

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <ApiShowcaseSection />
        <PricingSection />
      </main>
      <Footer />
    </>
  );
}
