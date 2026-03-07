import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ComponentGallery from '@/components/ComponentGallery';
import HowItWorksSection from '@/components/HowItWorksSection';
import SuggestionSection from '@/components/SuggestionSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background smooth-scroll">
      <Navbar />
      <HeroSection />
      <ComponentGallery />
      <HowItWorksSection />
      <SuggestionSection />
      <Footer />
    </div>
  );
};

export default Index;
