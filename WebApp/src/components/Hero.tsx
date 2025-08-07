import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Hero = () => {
  const navigate = useNavigate();

  const handleStartDetection = () => {
    navigate('/object-detection');
  };

  const handleExplore = () => {
    const missionSection = document.getElementById('mission-section');
    if (missionSection) {
      missionSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Spline 3D Background */}
      <div className="absolute inset-0 w-full h-full">
        <iframe 
          src='https://my.spline.design/worldplanet-zTZA91FkVoGQh7w4v9jFEJCv/' 
          className="w-full h-full border-0"
          title="3D Planet Background"
        />
      </div>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="space-y-8 animate-fade-in-up">
          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold text-glow">
              Welcome To{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Detect-X
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animate-delay-200">
              AI-powered Spacecraft Object Detection & AR Guidance
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animate-delay-400">
            <Button 
              variant="neon" 
              size="lg" 
              className="group text-lg px-8 py-4"
              onClick={handleStartDetection}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Detection
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="glass" 
              size="lg" 
              className="text-lg px-8 py-4 border-secondary hover:glow-purple"
              onClick={handleExplore}
            >
              Explore
            </Button>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground animate-fade-in-up animate-delay-400">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span>System Online • AI Detection Ready</span>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};