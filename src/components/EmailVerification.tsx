
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMatch } from '@/context/MatchContext';
import { 
  PageTransition, 
  SectionTitle, 
  GlassCard,
  Button,
  FormInput,
  BackButton,
} from '@/components/ui-components';
import { toast } from '@/hooks/use-toast';
import { ArrowRight, RefreshCw, Mail } from 'lucide-react';

const EmailVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loadMatch } = useMatch();
  
  const [email, setEmail] = useState('');
  const [matchId, setMatchId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  // Parse query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    const matchIdParam = params.get('matchId');
    
    if (emailParam) setEmail(emailParam);
    if (matchIdParam) setMatchId(matchIdParam);
  }, [location]);
  
  // Countdown timer for resending verification code
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);
  
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode) {
      setCodeError('Verification code is required');
      return;
    }
    
    if (verificationCode.length !== 6) {
      setCodeError('Verification code must be 6 digits');
      return;
    }
    
    setCodeError('');
    setIsVerifying(true);
    
    try {
      // In a real app, you would verify the code with your backend
      // For demo purposes, we'll accept any 6-digit code
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For this demo, we'll just consider the code valid
      // In a real app, you would check the code validity with the server
      
      // Load the match now that we're verified
      await loadMatch(matchId);
      
      toast({
        title: "Email Verified Successfully",
        description: "You're now ready to set up your match",
      });
      
      // Navigate to match setup
      navigate('/setup-match');
    } catch (err: any) {
      console.error('Verification failed', err);
      setCodeError(err.message || 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleResendCode = async () => {
    setCanResend(false);
    setCountdown(60);
    
    try {
      // In a real app, you would call your API to resend the verification code
      // For demo purposes, we'll just simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Verification Code Resent",
        description: "Please check your inbox for the new code",
      });
    } catch (err) {
      console.error('Failed to resend verification code', err);
      toast({
        title: "Failed to resend code",
        description: "Please try again later",
        variant: "destructive",
      });
      setCanResend(true);
    }
  };
  
  return (
    <PageTransition>
      <SectionTitle 
        title="Verify Your Email" 
        subtitle="Enter the verification code sent to your email"
      />
      
      <GlassCard className="p-6 w-full max-w-md mx-auto">
        <div className="mb-4">
          <div className="flex items-center justify-center space-x-2 p-3 bg-primary/5 rounded-lg">
            <Mail className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium">{email}</p>
          </div>
          
          <div className="flex items-center justify-center mt-2">
            <p className="text-xs text-center text-muted-foreground">
              Match ID: <span className="font-mono font-medium">{matchId}</span>
            </p>
          </div>
        </div>
        
        <form onSubmit={handleVerify} className="space-y-4">
          <FormInput
            label="Verification Code"
            type="text"
            id="verificationCode"
            placeholder="Enter 6-digit code"
            value={verificationCode}
            onChange={(e) => {
              // Only allow digits
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 6) {
                setVerificationCode(value);
              }
            }}
            error={codeError}
            maxLength={6}
            pattern="[0-9]*"
            inputMode="numeric"
            autoComplete="one-time-code"
            disabled={isVerifying}
            className="text-center font-mono text-lg"
          />
          
          <div className="flex justify-between pt-2">
            <BackButton
              onClick={() => navigate('/new-match')}
              disabled={isVerifying}
            />
            <Button 
              type="submit"
              isLoading={isVerifying}
              iconRight={<ArrowRight className="h-4 w-4" />}
            >
              Verify & Continue
            </Button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Didn't receive a code?
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResendCode}
            disabled={!canResend || isVerifying}
            iconLeft={<RefreshCw className="h-3.5 w-3.5" />}
            className="text-xs"
          >
            {canResend ? 'Resend Code' : `Resend in ${countdown}s`}
          </Button>
        </div>
      </GlassCard>
    </PageTransition>
  );
};

export default EmailVerification;
