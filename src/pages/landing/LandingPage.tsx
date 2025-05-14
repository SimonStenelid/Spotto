import { useNavigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { MapPreview } from './components/MapPreview';
import { PricingSection } from './components/PricingSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleMapClick = () => {
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-white scroll-smooth">
      <Navigation onMapClick={handleMapClick} />
      <main>
        <HeroSection />
        <FeaturesSection />
        <MapPreview />
        <PricingSection id="pricing" />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
} 