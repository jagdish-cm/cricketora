import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatch } from '@/context/MatchContext';
import { 
  PageTransition, 
  SectionTitle, 
  GlassCard,
  FormInput,
  Button,
  NextButton, 
  BackButton,
} from '@/components/ui-components';
import { 
  CircleOff, 
  Award,
  Users,
  ChevronLeft,
  ChevronRight,
  Copy, 
  Check,
  Dice5,
  CopyCheck
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const MatchSetup = () => {
  const navigate = useNavigate();
  const { match, updateMatch, isLoading } = useMatch();
  const [currentStep, setCurrentStep] = useState('teams');
  const [matchCopied, setMatchCopied] = useState(false);
  
  useEffect(() => {
    if (!match) {
      navigate('/');
      toast({
        title: "No match information",
        description: "Please start a new match first",
        variant: "destructive",
      });
    }
  }, [match, navigate]);
  
  if (!match) return null;

  const copyMatchId = () => {
    navigator.clipboard.writeText(match.id);
    setMatchCopied(true);
    toast({
      title: "Match ID copied",
      description: "Share this ID with other viewers",
    });
    setTimeout(() => setMatchCopied(false), 2000);
  };

  return (
    <PageTransition>
      <SectionTitle 
        title="Match Setup" 
        subtitle="Configure the match details before starting"
      />
      
      <div className="flex justify-center items-center mb-4">
        <div className="flex items-center space-x-2 py-1 px-3 rounded-full bg-primary/10 text-primary text-sm">
          <Award className="h-4 w-4" />
          <span className="font-medium">Match ID:</span>
          <code className="font-mono">{match.id}</code>
          <button 
            onClick={copyMatchId} 
            className="ml-1 p-1 rounded-full hover:bg-primary/20 transition-colors"
            aria-label="Copy Match ID"
          >
            {matchCopied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
      
      <GlassCard className="p-6 w-full max-w-3xl mx-auto">
        <Tabs value={currentStep} onValueChange={setCurrentStep}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="teams" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="h-4 w-4 mr-2" /> Teams
            </TabsTrigger>
            <TabsTrigger value="toss" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Dice5 className="h-4 w-4 mr-2" /> Toss
            </TabsTrigger>
            <TabsTrigger value="rules" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <CopyCheck className="h-4 w-4 mr-2" /> Rules
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="teams" className="animate-fade-in">
            <TeamSetup match={match} updateMatch={updateMatch} onNext={() => setCurrentStep('toss')} />
          </TabsContent>
          
          <TabsContent value="toss" className="animate-fade-in">
            <TossSetup 
              match={match} 
              updateMatch={updateMatch} 
              onPrev={() => setCurrentStep('teams')} 
              onNext={() => setCurrentStep('rules')} 
            />
          </TabsContent>
          
          <TabsContent value="rules" className="animate-fade-in">
            <RulesSetup 
              match={match} 
              updateMatch={updateMatch}
              isLoading={isLoading}
              onPrev={() => setCurrentStep('toss')}
              onFinish={() => navigate('/scoring')}
            />
          </TabsContent>
        </Tabs>
      </GlassCard>
    </PageTransition>
  );
};

const TeamSetup = ({ 
  match, 
  updateMatch, 
  onNext 
}: {
  match: any;
  updateMatch: (data: any) => Promise<void>;
  onNext: () => void;
}) => {
  const [team1Name, setTeam1Name] = useState(match.team1.name);
  const [team2Name, setTeam2Name] = useState(match.team2.name);
  const [team1Error, setTeam1Error] = useState('');
  const [team2Error, setTeam2Error] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSaveTeams = async () => {
    let hasError = false;
    
    if (!team1Name.trim()) {
      setTeam1Error('Team 1 name is required');
      hasError = true;
    } else {
      setTeam1Error('');
    }
    
    if (!team2Name.trim()) {
      setTeam2Error('Team 2 name is required');
      hasError = true;
    } else {
      setTeam2Error('');
    }
    
    if (team1Name.trim() === team2Name.trim()) {
      setTeam1Error('Team names must be different');
      setTeam2Error('Team names must be different');
      hasError = true;
    }
    
    if (hasError) return;
    
    setIsSaving(true);
    
    try {
      await updateMatch({
        team1: {
          ...match.team1,
          name: team1Name.trim()
        },
        team2: {
          ...match.team2,
          name: team2Name.trim()
        }
      });
      
      toast({
        title: "Teams saved",
        description: "Team names have been updated",
      });
      
      onNext();
    } catch (err) {
      console.error('Failed to save team names', err);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Team 1</h3>
          <FormInput
            label="Team Name"
            id="team1Name"
            value={team1Name}
            onChange={(e) => setTeam1Name(e.target.value)}
            error={team1Error}
            placeholder="e.g. Super Kings"
            disabled={isSaving}
          />
          
          <div className="mt-2 opacity-60">
            <p className="text-xs text-muted-foreground">
              Player entry will be available in a future update.
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Team 2</h3>
          <FormInput
            label="Team Name"
            id="team2Name"
            value={team2Name}
            onChange={(e) => setTeam2Name(e.target.value)}
            error={team2Error}
            placeholder="e.g. Royal Challengers"
            disabled={isSaving}
          />
          
          <div className="mt-2 opacity-60">
            <p className="text-xs text-muted-foreground">
              Player entry will be available in a future update.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <Button
          type="button"
          onClick={handleSaveTeams}
          isLoading={isSaving}
          iconRight={<ChevronRight className="h-4 w-4" />}
        >
          Save Teams & Continue
        </Button>
      </div>
    </div>
  );
};

const TossSetup = ({ 
  match, 
  updateMatch,
  onPrev,
  onNext 
}: {
  match: any;
  updateMatch: (data: any) => Promise<void>;
  onPrev: () => void;
  onNext: () => void;
}) => {
  const [tossWonBy, setTossWonBy] = useState(match.tossWonBy || '');
  const [choseTo, setChoseTo] = useState<'bat' | 'bowl'>(match.choseTo || 'bat');
  const [tossError, setTossError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSaveToss = async () => {
    if (!tossWonBy) {
      setTossError('Please select which team won the toss');
      return;
    }
    
    setTossError('');
    setIsSaving(true);
    
    try {
      await updateMatch({
        tossWonBy,
        choseTo
      });
      
      toast({
        title: "Toss details saved",
        description: `${tossWonBy === match.team1.id ? match.team1.name : match.team2.name} won the toss and chose to ${choseTo} first`,
      });
      
      onNext();
    } catch (err) {
      console.error('Failed to save toss details', err);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Toss Result</h3>
        
        <div className="space-y-2">
          <Label>Which team won the toss?</Label>
          <div className="grid grid-cols-2 gap-4 pt-1">
            <Button
              type="button"
              variant={tossWonBy === match.team1.id ? "default" : "outline"}
              className={`h-auto py-3 justify-start ${tossWonBy === match.team1.id ? "" : "hover:border-primary/50"}`}
              onClick={() => setTossWonBy(match.team1.id)}
            >
              <span className="flex items-center">
                {match.team1.name}
              </span>
            </Button>
            
            <Button
              type="button"
              variant={tossWonBy === match.team2.id ? "default" : "outline"}
              className={`h-auto py-3 justify-start ${tossWonBy === match.team2.id ? "" : "hover:border-primary/50"}`}
              onClick={() => setTossWonBy(match.team2.id)}
            >
              <span className="flex items-center">
                {match.team2.name}
              </span>
            </Button>
          </div>
          {tossError && <p className="text-xs text-red-500 mt-1">{tossError}</p>}
        </div>
        
        <div className="space-y-2 mt-6">
          <Label>Chose to:</Label>
          <div className="grid grid-cols-2 gap-4 pt-1">
            <Button
              type="button"
              variant={choseTo === 'bat' ? "default" : "outline"}
              className={`h-auto py-3 justify-center ${choseTo === 'bat' ? "" : "hover:border-primary/50"}`}
              onClick={() => setChoseTo('bat')}
            >
              Bat
            </Button>
            
            <Button
              type="button"
              variant={choseTo === 'bowl' ? "default" : "outline"}
              className={`h-auto py-3 justify-center ${choseTo === 'bowl' ? "" : "hover:border-primary/50"}`}
              onClick={() => setChoseTo('bowl')}
            >
              Bowl
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <BackButton onClick={onPrev} />
        <Button
          type="button"
          onClick={handleSaveToss}
          isLoading={isSaving}
          iconRight={<ChevronRight className="h-4 w-4" />}
        >
          Save Toss & Continue
        </Button>
      </div>
    </div>
  );
};

const RulesSetup = ({ 
  match, 
  updateMatch,
  isLoading,
  onPrev,
  onFinish 
}: {
  match: any;
  updateMatch: (data: any) => Promise<void>;
  isLoading: boolean;
  onPrev: () => void;
  onFinish: () => void;
}) => {
  const [totalOvers, setTotalOvers] = useState(match.totalOvers.toString());
  const [isLbwValid, setIsLbwValid] = useState(match.scoringOptions.isLbwValid);
  const [byesValid, setByesValid] = useState(match.scoringOptions.byesValid);
  const [legByesValid, setLegByesValid] = useState(match.scoringOptions.legByesValid);
  const [oversError, setOversError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSaveRules = async () => {
    const overs = parseInt(totalOvers);
    
    if (isNaN(overs) || overs < 1 || overs > 50) {
      setOversError('Please enter a valid number of overs (1-50)');
      return;
    }
    
    setOversError('');
    setIsSaving(true);
    
    try {
      await updateMatch({
        totalOvers: overs,
        scoringOptions: {
          isLbwValid,
          byesValid,
          legByesValid
        },
        innings: [{
          battingTeamId: match.choseTo === 'bat' ? match.tossWonBy : 
                          (match.tossWonBy === match.team1.id ? match.team2.id : match.team1.id),
          bowlingTeamId: match.choseTo === 'bowl' ? match.tossWonBy : 
                         (match.tossWonBy === match.team1.id ? match.team2.id : match.team1.id),
          overs: [],
          currentOver: 0,
          currentBall: 0,
          totalRuns: 0,
          wickets: 0,
          extras: {
            wides: 0,
            noBalls: 0,
            byes: 0,
            legByes: 0,
            penalties: 0
          },
          batsmanStats: {},
          bowlerStats: {},
          currentBatsmen: ['', ''],
          onStrike: '',
          currentBowler: '',
          isCompleted: false
        }],
        currentInnings: 0,
        matchStatus: 'in_progress'
      });
      
      toast({
        title: "Match Setup Complete",
        description: "You're ready to start scoring!",
      });
      
      onFinish();
    } catch (err) {
      console.error('Failed to save match rules', err);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Match Settings</h3>
        
        <FormInput
          label="Total Overs per Innings"
          id="totalOvers"
          type="number"
          min={1}
          max={50}
          value={totalOvers}
          onChange={(e) => setTotalOvers(e.target.value)}
          error={oversError}
          disabled={isSaving}
        />
        
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="isLbwValid" className="flex-1">
              LBW dismissals allowed
            </Label>
            <Switch
              id="isLbwValid"
              checked={isLbwValid}
              onCheckedChange={setIsLbwValid}
              disabled={isSaving}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="byesValid" className="flex-1">
              Byes allowed
            </Label>
            <Switch
              id="byesValid"
              checked={byesValid}
              onCheckedChange={setByesValid}
              disabled={isSaving}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="legByesValid" className="flex-1">
              Leg byes allowed
            </Label>
            <Switch
              id="legByesValid"
              checked={legByesValid}
              onCheckedChange={setLegByesValid}
              disabled={isSaving}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <BackButton onClick={onPrev} disabled={isSaving} />
        <Button
          type="button"
          onClick={handleSaveRules}
          isLoading={isSaving || isLoading}
        >
          Start Match
        </Button>
      </div>
    </div>
  );
};

export default MatchSetup;
