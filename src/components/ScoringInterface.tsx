
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatch } from '@/context/MatchContext';
import { 
  PageTransition, 
  GlassCard,
  Button,
} from '@/components/ui-components';
import { 
  User, 
  Users, 
  Menu,
  Award,
  RotateCw,
  Clock,
  Settings,
  Info
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from '@/lib/utils';

const ScoringInterface = () => {
  const navigate = useNavigate();
  const { match, isLoading } = useMatch();
  const [selectedRun, setSelectedRun] = useState<number | null>(null);
  
  // Navigation guard - redirect if no match in context
  useEffect(() => {
    if (!match) {
      navigate('/');
      toast({
        title: "No match information",
        description: "Please start a new match first",
        variant: "destructive",
      });
      return;
    }
    
    // Check if match is set up properly
    if (match.matchStatus === 'not_started' || match.innings.length === 0) {
      navigate('/setup-match');
      toast({
        title: "Match not set up",
        description: "Please complete match setup first",
      });
      return;
    }
  }, [match, navigate]);
  
  if (!match || match.innings.length === 0) return null;
  
  const currentInnings = match.innings[match.currentInnings];
  const battingTeam = currentInnings.battingTeamId === match.team1.id ? match.team1 : match.team2;
  const bowlingTeam = currentInnings.bowlingTeamId === match.team1.id ? match.team1 : match.team2;
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <ScoreHeader match={match} />
      
      <PageTransition className="flex-grow flex flex-col max-w-full">
        <div className="container max-w-4xl mx-auto px-4 py-6 flex-grow flex flex-col">
          {/* Main scoring content goes here */}
          <div className="mb-6">
            <ScoreSummary 
              match={match} 
              currentInnings={currentInnings} 
              battingTeam={battingTeam} 
            />
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex-grow flex flex-col space-y-6">
            <CurrentOverDisplay />
            
            <BatsmenInfo />
            
            <BowlerInfo />
            
            <ScoringButtons 
              selectedRun={selectedRun}
              setSelectedRun={setSelectedRun}
            />
          </div>
        </div>
      </PageTransition>
    </div>
  );
};

const ScoreHeader = ({ match }: { match: any }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-subtle backdrop-blur-lg bg-white/90 sticky top-0 z-10">
      <div className="container max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Award className="h-5 w-5 text-primary mr-2" />
            <span className="font-medium">CricketOra</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-md font-mono">
              {match.id}
            </div>
            
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="rounded-full h-8 w-8"
                  aria-label="Menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="space-y-6 py-6">
                  <h3 className="text-lg font-medium">Match Menu</h3>
                  
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        // TBD: Implement scorecard view
                      }}
                    >
                      <Info className="h-4 w-4 mr-2" />
                      Full Scorecard
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        // TBD: Implement settings
                      }}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Match Settings
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-destructive hover:text-destructive"
                      onClick={() => {
                        // TBD: Implement end match
                      }}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      End Match
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

const ScoreSummary = ({ 
  match, 
  currentInnings, 
  battingTeam 
}: { 
  match: any;
  currentInnings: any;
  battingTeam: any;
}) => {
  // Calculate overs
  const completedOvers = currentInnings.currentOver;
  const ballsInCurrentOver = currentInnings.currentBall;
  const oversDisplay = `${completedOvers}${ballsInCurrentOver > 0 ? '.' + ballsInCurrentOver : ''}`;
  
  return (
    <GlassCard className="overflow-hidden">
      <div className="bg-gradient-to-r from-primary/90 to-primary p-4 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{battingTeam.name}</h2>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-bold">{currentInnings.totalRuns}</span>
            <span>/</span>
            <span className="text-xl">{currentInnings.wickets}</span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-1 text-white/90 text-sm">
          <div className="flex items-center space-x-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{oversDisplay} overs</span>
          </div>
          <div>
            CRR: {currentInnings.totalRuns > 0 ? (currentInnings.totalRuns / (parseFloat(oversDisplay) || 1)).toFixed(2) : '0.00'}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

const CurrentOverDisplay = () => {
  // This would be populated with real data in a full implementation
  const currentOverBalls = [
    { runs: 1, isWide: false, isNoBall: false, isWicket: false },
    { runs: 4, isWide: false, isNoBall: false, isWicket: false },
    { runs: 0, isWide: false, isNoBall: false, isWicket: true },
    { runs: 0, isWide: true, isNoBall: false, isWicket: false },
  ];
  
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">Current Over</h3>
      <div className="flex space-x-2">
        {currentOverBalls.map((ball, index) => (
          <div 
            key={index}
            className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium border",
              ball.isWicket ? "bg-red-100 border-red-300 text-red-700" :
              ball.isWide || ball.isNoBall ? "bg-amber-100 border-amber-300 text-amber-700" :
              ball.runs === 4 || ball.runs === 6 ? "bg-green-100 border-green-300 text-green-700" :
              "bg-gray-100 border-gray-300 text-gray-700"
            )}
          >
            {ball.isWicket ? 'W' : 
             ball.isWide ? 'Wd' :
             ball.isNoBall ? 'Nb' :
             ball.runs}
          </div>
        ))}
        {/* Empty balls for the remainder of the over */}
        {Array(6 - currentOverBalls.length).fill(0).map((_, index) => (
          <div 
            key={`empty-${index}`}
            className="h-8 w-8 rounded-full flex items-center justify-center text-sm border border-gray-200 text-gray-300"
          >
            •
          </div>
        ))}
      </div>
    </div>
  );
};

const BatsmenInfo = () => {
  // This would be populated with real data in a full implementation
  const batsmen = [
    { name: "K. Williamson", runs: 24, balls: 18, fours: 3, sixes: 0, strikeRate: 133.33, onStrike: true },
    { name: "D. Warner", runs: 36, balls: 22, fours: 4, sixes: 2, strikeRate: 163.64, onStrike: false }
  ];
  
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">Batsmen</h3>
      <div className="grid grid-cols-1 gap-2">
        {batsmen.map((batsman, index) => (
          <div 
            key={index}
            className={cn(
              "p-3 rounded-lg border flex items-center",
              batsman.onStrike ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
            )}
          >
            <div className="flex-1">
              <div className="flex items-center">
                <span className="font-medium">{batsman.name}</span>
                {batsman.onStrike && (
                  <span className="ml-2 text-xs bg-primary text-white px-1.5 py-0.5 rounded">
                    *
                  </span>
                )}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {batsman.fours} fours, {batsman.sixes} sixes
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">{batsman.runs}</div>
              <div className="text-xs text-muted-foreground">
                {batsman.balls} balls ({batsman.strikeRate.toFixed(2)})
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BowlerInfo = () => {
  // This would be populated with real data in a full implementation
  const bowler = {
    name: "J. Bumrah",
    overs: 2.4,
    maidens: 0,
    runs: 18,
    wickets: 1,
    economy: 6.75
  };
  
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">Bowler</h3>
      <div className="p-3 rounded-lg border bg-gray-50 border-gray-200">
        <div className="flex justify-between items-center">
          <span className="font-medium">{bowler.name}</span>
          <span className="text-sm text-muted-foreground">
            Econ: {bowler.economy.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm">
            {bowler.overs} overs, {bowler.maidens} maiden
          </span>
          <span className="font-semibold">
            {bowler.wickets}/{bowler.runs}
          </span>
        </div>
      </div>
    </div>
  );
};

const ScoringButtons = ({ 
  selectedRun,
  setSelectedRun
}: {
  selectedRun: number | null;
  setSelectedRun: (run: number | null) => void;
}) => {
  const runOptions = [0, 1, 2, 3, 4, 6];
  
  const handleRunSelect = (run: number) => {
    setSelectedRun(run);
    
    // In a full implementation, this would update the match state
    toast({
      title: `${run} run${run !== 1 ? 's' : ''}`,
      description: "Scored in this ball",
    });
    
    // Reset after a short delay
    setTimeout(() => setSelectedRun(null), 300);
  };
  
  const handleExtraButtonClick = (extraType: string) => {
    // In a full implementation, this would show a modal or directly update the match state
    toast({
      title: extraType,
      description: "Extra recorded",
    });
  };
  
  return (
    <div className="space-y-4 mb-6">
      <h3 className="text-sm font-medium text-muted-foreground">Scoring</h3>
      
      <div className="grid grid-cols-3 gap-3">
        {runOptions.map((run) => (
          <Button
            key={run}
            variant={selectedRun === run ? "default" : "outline"}
            className={cn(
              "h-16 text-xl font-medium transition-all",
              run === 4 && "bg-green-100 border-green-300 text-green-700 hover:bg-green-200",
              run === 6 && "bg-emerald-100 border-emerald-300 text-emerald-700 hover:bg-emerald-200"
            )}
            onClick={() => handleRunSelect(run)}
          >
            {run}
          </Button>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
          onClick={() => handleExtraButtonClick('Wide')}
        >
          Wide
        </Button>
        <Button
          variant="outline"
          className="bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
          onClick={() => handleExtraButtonClick('No Ball')}
        >
          No Ball
        </Button>
        <Button
          variant="outline"
          className="bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
          onClick={() => handleExtraButtonClick('Bye')}
        >
          Bye
        </Button>
        <Button
          variant="outline"
          className="bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
          onClick={() => handleExtraButtonClick('Leg Bye')}
        >
          Leg Bye
        </Button>
      </div>
      
      <Button
        variant="outline"
        className="w-full bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
        onClick={() => handleExtraButtonClick('Wicket')}
      >
        Wicket
      </Button>
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className="text-muted-foreground"
          onClick={() => {
            // In a full implementation, this would show the over edit interface
            toast({
              title: "Edit Mode",
              description: "This feature is coming soon",
            });
          }}
        >
          Edit Last Over
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-primary"
          onClick={() => {
            // In a full implementation, this would switch strike
            toast({
              title: "Switch Strike",
              description: "Batsmen positions swapped",
            });
          }}
        >
          Switch Strike
        </Button>
      </div>
    </div>
  );
};

export default ScoringInterface;
