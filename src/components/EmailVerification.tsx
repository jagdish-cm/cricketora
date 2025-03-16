
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
import { ArrowRight, RefreshCw, Mail, Shield, LockKeyhole, CheckCircle2 } from 'lucide-react';

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
      navigate('/setup');
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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 cricket-pattern-bg">
      <PageTransition>
        <div className="flex items-center justify-center mb-6 animate-slide-down">
          <Shield className="h-10 w-10 text-primary mr-3" />
          <h1 className="text-3xl font-bold text-primary">CricketOra</h1>
        </div>
        
        <SectionTitle 
          title="Verify Your Email" 
          subtitle="Enter the verification code sent to your email"
          className="animate-fade-in"
        />
        
        <GlassCard className="p-8 w-full max-w-md mx-auto shadow-lg backdrop-blur-xl bg-white/90 border border-white/30 rounded-2xl animate-scale-in delay-100">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse-subtle"></div>
              <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center shadow-md relative z-10">
                <LockKeyhole className="h-6 w-6" />
              </div>
            </div>
          </div>
          
          <div className="mb-6 pt-6">
            <div className="flex items-center justify-center p-4 bg-primary/5 rounded-lg border border-primary/10 mb-3">
              <Mail className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
              <p className="text-sm font-medium text-gray-700 truncate">{email}</p>
            </div>
            
            <div className="flex items-center justify-center mt-2">
              <p className="text-xs text-center text-muted-foreground flex items-center">
                <span className="font-mono mr-2">Match ID:</span>
                <span className="font-mono font-medium bg-gray-100 px-2 py-1 rounded">{matchId}</span>
              </p>
            </div>
          </div>
          
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-4">
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
                className="text-center font-mono text-lg tracking-widest"
              />
            </div>
            
            <div className="flex justify-between pt-4">
              <BackButton
                onClick={() => navigate('/new-match')}
                disabled={isVerifying}
                className="hover:bg-gray-100 transition-colors duration-200"
              />
              <Button 
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white rounded-lg px-4 py-2 shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
                disabled={isVerifying || verificationCode.length !== 6}
              >
                {isVerifying ? (
                  <div className="flex items-center">
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center">
                    {verificationCode.length === 6 && (
                      <CheckCircle2 className="h-4 w-4 mr-2 animate-pulse-subtle" />
                    )}
                    <span>Verify & Continue</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </div>
                )}
              </Button>
            </div>
          </form>
          
          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-muted-foreground mb-3">
              Didn't receive a code?
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResendCode}
              disabled={!canResend || isVerifying}
              className="rounded-full"
            >
              {!canResend ? (
                <div className="flex items-center">
                  <span className="text-xs">Resend in </span>
                  <span className="font-mono ml-1 text-primary">{countdown}s</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                  <span>Resend Code</span>
                </div>
              )}
            </Button>
          </div>
        </GlassCard>
      </PageTransition>
    </div>
  );
};

export default EmailVerification;
