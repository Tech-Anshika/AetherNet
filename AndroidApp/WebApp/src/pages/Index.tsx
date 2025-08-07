import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { Mission } from '@/components/Mission';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <Mission />
      <Footer />
    </div>
  );
};

export default Index;
