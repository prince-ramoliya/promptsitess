import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeatureGridSection from '@/components/FeatureGridSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import FAQSection from '@/components/FAQSection';
import SuggestionSection from '@/components/SuggestionSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background smooth-scroll">
      <Navbar />
      <HeroSection />
      <FeatureGridSection />
      <HowItWorksSection />
      <FAQSection />
      <SuggestionSection />
      <Footer />
    </div>
  );
};

export default Index;
