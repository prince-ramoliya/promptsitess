import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ComponentGallery from '@/components/ComponentGallery';
import HowItWorksSection from '@/components/HowItWorksSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background smooth-scroll">
      <Navbar />
      <HeroSection />
      <ComponentGallery />
      <HowItWorksSection />
      <Footer />
    </div>
  );
};

export default Index;
