import fireExtinguisherImage from '@/assets/fire-extinguisher.png';
import { Target, TrendingUp, Shield, Zap } from 'lucide-react';

export const Mission = () => {
  const modelMetrics = [
    { label: 'mAP@0.5', value: '0.98', status: 'success', icon: Target },
    { label: 'Precision', value: '0.94', status: 'success', icon: TrendingUp },
    { label: 'Recall', value: '0.92', status: 'success', icon: TrendingUp },
    { label: 'F1-Score', value: '0.93', status: 'success', icon: TrendingUp },
    { label: 'Test Images', value: '400+', status: 'info', icon: Shield },
  ];

  return (
    <section id="mission-section" className="py-20 px-6 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Fire Extinguisher Image */}
          <div className="flex justify-center">
            <div className="relative group">
              {/* Glowing circular frame */}
              <div className="absolute inset-0 w-80 h-80 rounded-full glow-primary opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              <div className="absolute inset-2 w-76 h-76 rounded-full border-2 border-primary/30 group-hover:border-primary/60 transition-colors duration-500"></div>
              
              {/* Image container with 3D hover effect */}
              <div className="relative w-80 h-80 rounded-full overflow-hidden hover-tilt glass">
                <img 
                  src={fireExtinguisherImage} 
                  alt="Space Fire Extinguisher" 
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
              </div>
              
              {/* Floating particles */}
              <div className="absolute top-10 left-10 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <div className="absolute bottom-20 right-8 w-1 h-1 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-1/2 left-0 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>

          {/* Right: Mission Description */}
          <div className="space-y-8">
            {/* Section Header */}
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-glow">
                Our{' '}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Mission
                </span>
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Detect-X is designed to revolutionize spacecraft safety and maintenance by providing astronauts with instant visual detection of onboard equipment and anomalies. With state-of-the-art AI models and seamless AR/VR integration, our mission is to reduce critical response time, increase operational safety, and ensure mission success even in high-stress conditions.
              </p>
              
              <p className="text-foreground">
                Built for NASA standards, designed for the future of space exploration.
              </p>
            </div>

            {/* Mission Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="text-center glass p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary">99.9%</div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </div>
              <div className="text-center glass p-4 rounded-lg">
                <div className="text-2xl font-bold text-secondary">Real-time</div>
                <div className="text-xs text-muted-foreground">Processing</div>
              </div>
              <div className="text-center glass p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary">AR Ready</div>
                <div className="text-xs text-muted-foreground">Integration</div>
              </div>
            </div>
          </div>
        </div>

        {/* Model Metrics Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-glow mb-4">
              Model{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Performance
              </span>
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI model demonstrates exceptional accuracy and reliability in detecting spacecraft equipment and anomalies.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {modelMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.label}
                  className="glass p-6 rounded-lg border border-primary/20 hover:glow-primary transition-all duration-300 text-center"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{metric.label}</div>
                      <div className="text-2xl font-bold text-primary">{metric.value}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};