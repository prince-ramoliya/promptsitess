import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import ComponentGallery from '@/components/ComponentGallery';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth" style={{ scrollBehavior: 'smooth' }}>
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <ComponentGallery />
      <Footer />
    </div>
  );
};

export default Index;
