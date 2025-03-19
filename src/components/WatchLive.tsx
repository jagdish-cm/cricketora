
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatch } from '@/context/MatchContext';
import { 
  PageTransition, 
  SectionTitle, 
  GlassCard,
  FormInput,
  NextButton, 
  BackButton,
} from '@/components/ui-components';
import { toast } from '@/hooks/use-toast';
import { Eye } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const WatchLive = () => {
  const navigate = useNavigate();
  const { loadMatch, isLoading } = useMatch();
  const [matchId, setMatchId] = useState('');
  const [matchIdError, setMatchIdError] = useState('');
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!matchId) {
      setMatchIdError('Match ID is required');
      return;
    }

    // Ensure match ID is in correct format (6 characters, alphanumeric)
    const formattedMatchId = matchId.trim().toUpperCase();
    if (!/^[A-Z0-9]{6}$/.test(formattedMatchId)) {
      setMatchIdError('Invalid match ID format. Should be 6 characters.');
      return;
    }

    setMatchIdError('');

    try {
      // Load the match with the provided ID in viewer mode
      await loadMatch(formattedMatchId);
      
      // Show success toast
      toast({
        title: "Match found",
        description: "Loading match data...",
        variant: "default", 
        className: "toast-info"
      });
      
      // Navigate to the view-only scoring interface
      navigate(`/watch/${formattedMatchId}`);
    } catch (err: any) {
      console.error('Failed to load match for viewing', err);
      toast({
        title: "Error",
        description: err.message || 'Match not found or cannot be accessed',
        variant: "destructive",
        className: "toast-error"
      });
    }
  };

  return (
    <PageTransition>
      <div className="relative min-h-[70vh] w-full overflow-hidden">
        {/* Cricket-themed background elements */}
        <div className="absolute inset-0 overflow-hidden gradient-blue-red">
          {/* Decorative Cricket Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full border-4 border-dashed border-blue-500/10 animate-spin-slow"></div>
          <div className="absolute top-1/4 right-10 w-16 h-16 rounded-full bg-red-500/5 animate-pulse-subtle"></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 rounded-full border-4 border-red-500/10 animate-float" style={{ animationDelay: '1s' }}></div>
          
          {/* Cricket ball (stylized) */}
          <div className="absolute -bottom-10 right-10 opacity-10">
            <div className="relative h-40 w-40">
              <div className="absolute inset-0 rounded-full cricket-ball-gradient"></div>
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white/30 transform -translate-x-1/2 rotate-[25deg]"></div>
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white/30 transform -translate-x-1/2 -rotate-[25deg]"></div>
            </div>
          </div>
        </div>
      
        <div className="relative z-10">
          <SectionTitle 
            title="Watch Live Match" 
            subtitle="Enter the match ID to follow the live score"
            className="text-blue-900"
          />
          
          <GlassCard className="p-4 sm:p-6 w-full max-w-md mx-auto backdrop-blur-sm bg-white/90 shadow-lg border border-blue-100">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-red-500/20 rounded-lg blur-md opacity-70 group-hover:opacity-100 transition duration-1000"></div>
                <FormInput
                  label="Match ID"
                  type="text"
                  id="matchId"
                  placeholder="e.g. ABC123"
                  value={matchId}
                  onChange={(e) => setMatchId(e.target.value.toUpperCase())}
                  error={matchIdError}
                  required
                  disabled={isLoading}
                  maxLength={6}
                  className="uppercase text-center font-mono tracking-wider relative bg-white/90"
                />
              </div>
              
              <div className="flex justify-between pt-2 gap-2">
                <BackButton
                  onClick={() => navigate('/')}
                  disabled={isLoading}
                  size={isMobile ? "sm" : "default"}
                  className="text-xs sm:text-sm px-2 sm:px-4 flex items-center"
                  variant="blue-outline"
                />
                <NextButton 
                  type="submit"
                  isLoading={isLoading}
                  iconRight={<Eye className="h-3 w-3 sm:h-4 sm:w-4 ml-1.5" />}
                  size={isMobile ? "sm" : "default"}
                  className="text-xs sm:text-sm px-2 sm:px-4 flex items-center"
                  variant="gradient-blue"
                >
                  Watch Live
                </NextButton>
              </div>
              
              <div className="relative mt-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Information</span>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground text-center mt-4">
                Enter the match ID shared by the match scorer to view the live score.
              </p>
            </form>
          </GlassCard>
        </div>
      </div>
    </PageTransition>
  );
};

export default WatchLive;
