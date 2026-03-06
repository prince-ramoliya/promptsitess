import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ComponentGallery from '@/components/ComponentGallery';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ComponentGallery />
      <Footer />
    </div>
  );
};

export default Index;
