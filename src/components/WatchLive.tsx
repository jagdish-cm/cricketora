
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
import { Eye } from 'lucide-react';

const WatchLive = () => {
  const navigate = useNavigate();
  const { loadMatch, isLoading } = useMatch();
  const [matchId, setMatchId] = useState('');
  const [matchIdError, setMatchIdError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate match ID
    if (!matchId) {
      setMatchIdError('Match ID is required');
      return;
    }

    setMatchIdError('');

    try {
      // Load the match with the provided ID in viewer mode
      await loadMatch(matchId.toUpperCase());
      
      // Navigate to the view-only scoring interface
      navigate('/view-match');
    } catch (err: any) {
      // Error handling is done in the context
      console.error('Failed to load match for viewing', err);
    }
  };

  return (
    <PageTransition>
      <SectionTitle 
        title="Watch Live Match" 
        subtitle="Enter the match ID to follow the live score"
      />
      
      <GlassCard className="p-6 w-full max-w-md mx-auto">
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
          
          <div className="flex justify-between pt-2">
            <BackButton
              onClick={() => navigate('/')}
              disabled={isLoading}
            />
            <NextButton 
              type="submit"
              isLoading={isLoading}
              iconRight={<Eye className="h-4 w-4" />}
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
