
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, ChevronRight, PlayCircle, Clock, Eye, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white opacity-80"></div>
        
        {/* Animated Cricket Balls Background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, index) => (
            <div 
              key={index}
              className="absolute rounded-full bg-primary/10 animate-float"
              style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 4 + 4}s`
              }}
            ></div>
          ))}
        </div>
        
        <div className="relative z-10 text-center max-w-3xl px-4 animate-fade-in">
          <div className="mb-6 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 blur-2xl bg-primary/20 rounded-full animate-pulse-subtle"></div>
              <Award className="h-10 w-10 md:h-12 md:w-12 text-primary relative" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-primary ml-3">
              CricketOra
            </h1>
          </div>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mt-4 mb-6 sm:mb-8 max-w-xl mx-auto leading-relaxed animate-slide-up delay-100">
            A beautifully designed cricket scoring application with real-time updates, elegant statistics, and a seamless user experience.
          </p>
          
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
            <Button 
              onClick={() => navigate('/new-match')}
              size={isMobile ? "default" : "lg"}
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-4 sm:px-6 py-2 h-auto shadow-md hover:shadow-lg transition-all duration-300 animate-slide-up delay-200 group text-sm sm:text-base"
            >
              <PlayCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 flex-shrink-0 group-hover:scale-110 transition-transform" />
              <span className="whitespace-nowrap">Start New Match</span>
            </Button>
            
            <Button 
              onClick={() => navigate('/resume-match')}
              variant="outline"
              size={isMobile ? "default" : "lg"}
              className="bg-white hover:bg-gray-50 rounded-full px-4 sm:px-6 py-2 h-auto shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up delay-300 group text-sm sm:text-base"
            >
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 flex-shrink-0 text-primary group-hover:scale-110 transition-transform" />
              <span className="whitespace-nowrap">Resume Match</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-12 sm:py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-800">
            Premium Cricket Scoring Experience
          </h2>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="rounded-xl p-4 sm:p-6 bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4 text-primary z-10 relative flex-shrink-0">
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800 z-10 relative">{feature.title}</h3>
                <p className="text-muted-foreground text-sm z-10 relative">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-cricket">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-primary">Ready to score your next match?</h2>
          <p className="text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base">
            Experience the best cricket scoring platform with real-time updates and beautiful statistics.
          </p>
          <Button 
            onClick={() => navigate('/new-match')}
            size={isMobile ? "default" : "lg"}
            className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 h-10 sm:h-12 shadow-md hover:shadow-lg transition-all duration-300 group text-sm sm:text-base"
          >
            <span className="whitespace-nowrap">Get Started</span>
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 ml-1 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
      
      {/* Watch Live Section */}
      <div className="py-12 sm:py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
            <div className="md:w-1/2">
              <div className="cricket-glow rounded-xl overflow-hidden shadow-lg">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 p-6 sm:p-8 flex items-center justify-center">
                  <div className="text-center">
                    <Eye className="h-12 w-12 mb-3 sm:mb-4 text-primary/50 mx-auto animate-pulse-subtle flex-shrink-0" />
                    <h3 className="text-lg sm:text-xl font-semibold text-primary">Live Matches</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-gray-800">Watch Matches Live</h2>
              <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
                Share the match ID with friends and family so they can watch the match progress in real-time.
                Get ball-by-ball updates and live scoring.
              </p>
              <Button 
                onClick={() => navigate('/watch-live')}
                className="group text-sm"
              >
                <Eye className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="whitespace-nowrap">Watch Live Matches</span>
                <ChevronRight className="h-4 w-4 ml-1 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <div className="flex items-center mb-3 sm:mb-4">
            <Award className="h-5 w-5 sm:h-6 sm:w-6 text-primary mr-1.5 sm:mr-2 flex-shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold text-primary">CricketOra</h2>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Designed with precision and attention to detail<br />
            © 2023 CricketOra. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    title: 'Real-time Scoring',
    description: 'Score matches ball by ball with intuitive controls. Track runs, wickets, extras and more.',
    icon: <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />,
  },
  {
    title: 'Live Sharing',
    description: 'Share match ID with viewers for real-time updates. Perfect for friends and family.',
    icon: <Eye className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />,
  },
  {
    title: 'Detailed Statistics',
    description: 'View comprehensive match statistics including batting and bowling performances.',
    icon: <Award className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />,
  },
];

export default Index;
