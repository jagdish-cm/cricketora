import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, ChevronRight, PlayCircle, Clock, Eye } from 'lucide-react';
import { PageContainer, GlassCard, Button } from '@/components/ui-components';

const Index = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <div className="flex flex-col items-center animate-fade-in">
        <div className="mb-6 flex items-center">
          <Award className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">
            CricketOra
          </h1>
        </div>
        
        <p className="text-center text-muted-foreground max-w-md mb-8 animate-slide-up delay-100">
          A beautifully designed cricket scoring application that makes scorekeeping simple and elegant.
        </p>
        
        <div className="w-full max-w-md space-y-4">
          <GlassCard 
            className="p-5 relative overflow-hidden group animate-slide-up delay-200 border-primary/10 hover:border-primary/30"
            onClick={() => navigate('/new-match')}
            hoverEffect={true}
          >
            <div className="absolute top-0 right-0 bottom-0 w-1/3 bg-gradient-to-l from-primary/5 to-transparent group-hover:from-primary/10 transition-all duration-300" />
            <div className="relative z-10 flex items-center">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary mr-4">
                <PlayCircle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-medium">Start New Match</h2>
                <p className="text-sm text-muted-foreground">Create a new match and start scoring</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
            </div>
          </GlassCard>
          
          <GlassCard 
            className="p-5 relative overflow-hidden group animate-slide-up delay-300 border-primary/10 hover:border-primary/30"
            onClick={() => navigate('/resume-match')}
            hoverEffect={true}
          >
            <div className="absolute top-0 right-0 bottom-0 w-1/3 bg-gradient-to-l from-primary/5 to-transparent group-hover:from-primary/10 transition-all duration-300" />
            <div className="relative z-10 flex items-center">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary mr-4">
                <Clock className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-medium">Resume Match</h2>
                <p className="text-sm text-muted-foreground">Continue scoring an existing match</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
            </div>
          </GlassCard>
          
          <GlassCard 
            className="p-5 relative overflow-hidden group animate-slide-up delay-400 border-primary/10 hover:border-primary/30"
            onClick={() => navigate('/watch-live')}
            hoverEffect={true}
          >
            <div className="absolute top-0 right-0 bottom-0 w-1/3 bg-gradient-to-l from-primary/5 to-transparent group-hover:from-primary/10 transition-all duration-300" />
            <div className="relative z-10 flex items-center">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary mr-4">
                <Eye className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-medium">Watch Live Match</h2>
                <p className="text-sm text-muted-foreground">View live scoring of ongoing matches</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
            </div>
          </GlassCard>
        </div>
        
        <div className="mt-12 text-center animate-fade-in delay-500">
          <p className="text-xs text-muted-foreground mb-2">
            Designed with precision and attention to detail
          </p>
          <p className="text-xs text-muted-foreground">
            © 2023 CricketOra. All rights reserved.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}

export default Index;
