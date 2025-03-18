
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
        className: "bg-green-100 border-green-300 text-green-800"
      });
      
      // Navigate to the view-only scoring interface
      navigate(`/watch/${formattedMatchId}`);
    } catch (err: any) {
      console.error('Failed to load match for viewing', err);
      toast({
        title: "Error",
        description: err.message || 'Match not found or cannot be accessed',
        variant: "destructive",
        className: "bg-red-100 border-red-300 text-red-800"
      });
    }
  };

  return (
    <PageTransition>
      <SectionTitle 
        title="Watch Live Match" 
        subtitle="Enter the match ID to follow the live score"
      />
      
      <GlassCard className="p-4 sm:p-6 w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
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
            className="uppercase text-center font-mono tracking-wider"
          />
          
          <div className="flex justify-between pt-2 gap-2">
            <BackButton
              onClick={() => navigate('/')}
              disabled={isLoading}
              size={isMobile ? "sm" : "default"}
              className="text-xs sm:text-sm px-2 sm:px-4 flex items-center"
            />
            <NextButton 
              type="submit"
              isLoading={isLoading}
              iconRight={<Eye className="h-3 w-3 sm:h-4 sm:w-4" />}
              size={isMobile ? "sm" : "default"}
              className="text-xs sm:text-sm px-2 sm:px-4 flex items-center"
            >
              Watch Live
            </NextButton>
          </div>
          
          <p className="text-xs text-muted-foreground text-center mt-4">
            Enter the match ID shared by the match scorer to view the live score.
          </p>
        </form>
      </GlassCard>
    </PageTransition>
  );
};

export default WatchLive;
