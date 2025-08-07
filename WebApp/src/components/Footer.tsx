import { Github, Linkedin, Twitter } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative glass border-t border-border/50">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded glow-primary"></div>
            <span className="text-lg font-bold text-primary">Detect-X</span>
            <span className="text-sm text-muted-foreground">• Space Detection Systems</span>
          </div>

          {/* Copyright Notice */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Detect-X Systems. NASA-Grade Technology.
            </p>
            <p className="text-xs text-muted-foreground/70">
              Advanced AI • Spacecraft Safety • Mission Critical
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            <a 
              href="#" 
              className="p-2 glass rounded-lg hover:glow-primary transition-all duration-300 hover:scale-110"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4 text-muted-foreground hover:text-primary" />
            </a>
            <a 
              href="#" 
              className="p-2 glass rounded-lg hover:glow-primary transition-all duration-300 hover:scale-110"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4 text-muted-foreground hover:text-primary" />
            </a>
            <a 
              href="#" 
              className="p-2 glass rounded-lg hover:glow-secondary transition-all duration-300 hover:scale-110"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4 text-muted-foreground hover:text-secondary" />
            </a>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-6 pt-4 border-t border-border/30 flex items-center justify-center space-x-6 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Systems Online</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span>AI Detection Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
            <span>AR Systems Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};