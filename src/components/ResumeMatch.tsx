
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
import { Key } from 'lucide-react';

const ResumeMatch = () => {
  const navigate = useNavigate();
  const { loadMatch, isLoading } = useMatch();
  const [matchId, setMatchId] = useState('');
  const [password, setPassword] = useState('');
  const [matchIdError, setMatchIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate match ID
    if (!matchId) {
      setMatchIdError('Match ID is required');
      return;
    }

    // Validate password
    if (!password) {
      setPasswordError('Scoring password is required');
      return;
    }

    setMatchIdError('');
    setPasswordError('');

    try {
      // Load the match with the provided ID and password
      await loadMatch(matchId.toUpperCase(), password);
      
      // Navigate to the scoring interface
      navigate('/scoring');
    } catch (err: any) {
      // Error handling is done in the context
      console.error('Failed to resume match', err);
    }
  };

  return (
    <PageTransition>
      <SectionTitle 
        title="Resume a Match" 
        subtitle="Enter your match ID and scoring password"
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
          
          <FormInput
            label="Scoring Password"
            type="password"
            id="password"
            placeholder="Enter scoring password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
            required
            disabled={isLoading}
            icon={<Key className="h-4 w-4 text-muted-foreground" />}
          />
          
          <div className="flex justify-between pt-2">
            <BackButton
              onClick={() => navigate('/')}
              disabled={isLoading}
            />
            <NextButton 
              type="submit"
              isLoading={isLoading}
            />
          </div>
          
          <p className="text-xs text-muted-foreground text-center mt-4">
            The match ID and password were provided when you created the match or via email.
          </p>
        </form>
      </GlassCard>
    </PageTransition>
  );
};

export default ResumeMatch;
