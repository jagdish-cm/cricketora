
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
import { Mail } from 'lucide-react';

const NewMatch = () => {
  const navigate = useNavigate();
  const { createMatch, isLoading } = useMatch();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    if (!email) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError('');

    try {
      // Create a new match with the scorer's email
      const matchId = await createMatch({ scorerEmail: email });
      
      // In a real app, you would send an OTP to the user's email here
      // For demo purposes, we'll simulate this with a delay
      
      toast({
        title: "Verification Email Sent",
        description: "Please check your inbox for a verification code",
      });
      
      // Navigate to verification screen with the email and match ID
      navigate(`/verify-email?email=${encodeURIComponent(email)}&matchId=${matchId}`);
    } catch (err) {
      // Error handling is done in the context
      console.error('Failed to start new match', err);
    }
  };

  return (
    <PageTransition>
      <SectionTitle 
        title="Start a New Match" 
        subtitle="Enter your email to receive a verification code"
      />
      
      <GlassCard className="p-6 w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Email Address"
            type="email"
            id="email"
            placeholder="yourname@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
            iconLeft={<Mail className="h-4 w-4" />}
            required
            disabled={isLoading}
            className="transition-all duration-300"
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
            We'll send a verification code to this email address.
          </p>
        </form>
      </GlassCard>
    </PageTransition>
  );
};

export default NewMatch;
