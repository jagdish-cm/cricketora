
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
          {/* Cricket Balls */}
          {[...Array(6)].map((_, index) => (
            <div 
              key={`ball-${index}`}
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
          
          {/* Cricket Stumps */}
          <div className="absolute bottom-0 left-[10%] w-20 h-40 opacity-20 hidden sm:block">
            <div className="absolute left-0 bottom-0 w-2 h-40 bg-primary rounded-t-md"></div>
            <div className="absolute left-9 bottom-0 w-2 h-40 bg-primary rounded-t-md"></div>
            <div className="absolute left-18 bottom-0 w-2 h-40 bg-primary rounded-t-md"></div>
            <div className="absolute left-0 top-0 w-20 h-2 bg-primary rounded-md"></div>
          </div>
          
          {/* Cricket Bat */}
          <div className="absolute bottom-10 right-[15%] opacity-20 transform rotate-45 hidden sm:block">
            <div className="w-6 h-40 bg-amber-800 rounded-b-md"></div>
            <div className="w-16 h-20 bg-amber-700 rounded-t-md -translate-x-5"></div>
          </div>
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
            
            {/* Watch Live Matches Button - MOVED HERE */}
            <Button 
              onClick={() => navigate('/watch-live')}
              variant="secondary"
              size={isMobile ? "default" : "lg"}
              className="bg-white border border-primary/20 hover:border-primary/40 hover:bg-gray-50 rounded-full px-4 sm:px-6 py-2 h-auto shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up delay-400 group text-sm sm:text-base"
            >
              <Eye className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 flex-shrink-0 text-primary group-hover:scale-110 transition-transform" />
              <span className="whitespace-nowrap">Watch Live</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-12 sm:py-16 px-4 sm:px-6 bg-white relative overflow-hidden">
        {/* Background pattern for features section */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute -left-16 -top-16 w-64 h-64 rounded-full border-8 border-primary/20"></div>
          <div className="absolute right-10 top-20 w-12 h-12 rounded-full bg-primary/10"></div>
          <div className="absolute left-1/4 bottom-10 w-20 h-20 rounded-full border-4 border-primary/10"></div>
          <div className="absolute right-1/4 bottom-20 w-32 h-32 rounded-full border-4 border-dashed border-primary/10"></div>
        </div>
      
        <div className="max-w-6xl mx-auto relative z-10">
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
      <div className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-cricket relative overflow-hidden">
        {/* Animated cricket dots */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, index) => (
            <div 
              key={`cta-dot-${index}`}
              className="absolute rounded-full bg-primary/5 animate-pulse-subtle"
              style={{
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 3 + 2}s`
              }}
            ></div>
          ))}
        </div>
      
        <div className="max-w-3xl mx-auto text-center relative z-10">
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
