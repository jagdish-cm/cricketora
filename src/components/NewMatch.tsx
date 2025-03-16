
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
import { Mail, ShieldAlert, Shield } from 'lucide-react';

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
      const matchId = await createMatch({ scorerEmail: email });
      
      navigate(`/verify-email?email=${encodeURIComponent(email)}&matchId=${matchId}`);
    } catch (err) {
      console.error('Failed to start new match', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 cricket-pattern-bg">
      <PageTransition>
        <div className="flex items-center justify-center mb-6 animate-slide-down">
          <Shield className="h-10 w-10 text-primary mr-3" />
          <h1 className="text-3xl font-bold text-primary">CricketOra</h1>
        </div>

        <SectionTitle 
          title="Start a New Match" 
          subtitle="Enter your email to receive a verification code"
          className="animate-fade-in"
        />
        
        <GlassCard className="p-8 w-full max-w-md mx-auto shadow-lg backdrop-blur-xl bg-white/90 border border-white/30 rounded-2xl animate-scale-in delay-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse-subtle"></div>
                <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center shadow-md relative z-10">
                  <Mail className="h-6 w-6" />
                </div>
              </div>
            </div>
            
            <div className="pt-6">
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
                className="transition-all duration-300 cricket-input"
              />
            </div>
            
            <div className="flex justify-between pt-4">
              <BackButton
                onClick={() => navigate('/')}
                disabled={isLoading}
                className="hover:bg-gray-100 transition-colors duration-200"
              />
              <NextButton 
                type="submit"
                isLoading={isLoading}
                className="bg-primary hover:bg-primary/90 transition-colors duration-200 shadow-md hover:shadow-lg"
              />
            </div>
            
            <div className="pt-6 border-t border-gray-100">
              <div className="flex items-start">
                <ShieldAlert className="h-5 w-5 text-primary/80 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  We'll send a verification code to this email address. This helps us prevent unauthorized access and ensures the security of your match data.
                </p>
              </div>
            </div>
          </form>
        </GlassCard>
      </PageTransition>
    </div>
  );
};

export default NewMatch;
