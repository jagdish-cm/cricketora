import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatch, BallEvent, Player } from '@/context/MatchContext';
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
  Info,
  Edit,
  PlayCircle,
  FastForward
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from '@/lib/utils';
import SelectBatsmanModal from './SelectBatsmanModal';
import SelectBowlerModal from './SelectBowlerModal';
import DismissalModal, { DismissalType } from './DismissalModal';
import RunsInputModal, { RunsInfo } from './RunsInputModal';
import ExtrasModal, { ExtrasInfo, ExtraType } from './ExtrasModal';
import ScoreConfirmationModal, { ScoreDetails } from './ScoreConfirmationModal';
import { useDisclosure } from '@/hooks/use-disclosure';
import { useInningsInit } from '@/hooks/use-innings-init';

const ScoringInterface = () => {
  const navigate = useNavigate();
  const { match, isLoading, saveMatchEvent, updateMatch } = useMatch();
  const [selectedRun, setSelectedRun] = useState<number | null>(null);
  const [pendingBallEvent, setPendingBallEvent] = useState<Partial<BallEvent> | null>(null);
  const [pendingScoreDetails, setPendingScoreDetails] = useState<ScoreDetails | null>(null);
  const [noStrikeRotation, setNoStrikeRotation] = useState<boolean>(false);
  
  const {
    needsInitialization,
    strikerModal,
    nonStrikerModal,
    bowlerModal,
    handleSelectStriker,
    handleSelectNonStriker,
    handleSelectBowler,
    needsStriker,
    needsNonStriker,
    needsBowler,
  } = useInningsInit();
  
  const {
    isOpen: isRunsModalOpen,
    onOpen: openRunsModal,
    onClose: closeRunsModal
  } = useDisclosure();

  const {
    isOpen: isExtrasModalOpen,
    onOpen: openExtrasModal,
    onClose: closeExtrasModal
  } = useDisclosure();

  const {
    isOpen: isDismissalModalOpen,
    onOpen: openDismissalModal,
    onClose: closeDismissalModal
  } = useDisclosure();

  const {
    isOpen: isSelectBatsmanModalOpen,
    onOpen: openSelectBatsmanModal,
    onClose: closeSelectBatsmanModal
  } = useDisclosure();

  const {
    isOpen: isSelectBowlerModalOpen,
    onOpen: openSelectBowlerModal,
    onClose: closeSelectBowlerModal
  } = useDisclosure();
  
  const {
    isOpen: isScoreConfirmationOpen,
    onOpen: openScoreConfirmation,
    onClose: closeScoreConfirmation
  } = useDisclosure();
  
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

  const handleRunSelect = (run: number) => {
    setSelectedRun(run);
    
    if ([0, 1, 2, 3, 4, 6].includes(run)) {
      const ballEvent: Partial<BallEvent> = {
        runs: run,
        batsmanId: currentInnings.onStrike,
        bowlerId: currentInnings.currentBowler,
        isWicket: false,
      };
      
      setPendingBallEvent(ballEvent);
      
      const willRotateStrike = run % 2 === 1 || 
        (currentInnings.currentBall === 5 && !ballEvent.isWide && !ballEvent.isNoBall);
      
      setPendingScoreDetails({
        runs: run,
        batsmanName: getBatsmanName(currentInnings.onStrike),
        bowlerName: getBowlerName(currentInnings.currentBowler),
        rotateStrike: willRotateStrike,
      });
      
      openScoreConfirmation();
      
      setTimeout(() => setSelectedRun(null), 300);
    } else {
      openRunsModal();
    }
  };

  const handleRunsSubmit = (runsInfo: RunsInfo) => {
    const ballEvent: Partial<BallEvent> = {
      runs: runsInfo.runs,
      batsmanId: currentInnings.onStrike,
      bowlerId: currentInnings.currentBowler,
      isWicket: false,
    };
    
    setPendingBallEvent(ballEvent);
    setNoStrikeRotation(!runsInfo.isStrikeRotated);
    
    setPendingScoreDetails({
      runs: runsInfo.runs,
      batsmanName: getBatsmanName(currentInnings.onStrike),
      bowlerName: getBowlerName(currentInnings.currentBowler),
      rotateStrike: runsInfo.isStrikeRotated,
    });
    
    openScoreConfirmation();
  };

  const handleExtrasSubmit = (extrasInfo: ExtrasInfo) => {
    const ballEvent: Partial<BallEvent> = {
      runs: extrasInfo.runs,
      batsmanId: currentInnings.onStrike,
      bowlerId: currentInnings.currentBowler,
      isWicket: extrasInfo.isWicket || false,
    };

    switch(extrasInfo.extraType) {
      case 'wide':
        ballEvent.isWide = true;
        break;
      case 'noBall':
        ballEvent.isNoBall = true;
        break;
      case 'bye':
        ballEvent.isBye = true;
        break;
      case 'legBye':
        ballEvent.isLegBye = true;
        break;
    }

    setPendingBallEvent(ballEvent);
    setNoStrikeRotation(!extrasInfo.rotateStrike);
    
    setPendingScoreDetails({
      runs: extrasInfo.runs,
      isWide: ballEvent.isWide,
      isNoBall: ballEvent.isNoBall,
      isBye: ballEvent.isBye,
      isLegBye: ballEvent.isLegBye,
      isWicket: extrasInfo.isWicket,
      batsmanName: getBatsmanName(currentInnings.onStrike),
      bowlerName: getBowlerName(currentInnings.currentBowler),
      rotateStrike: extrasInfo.rotateStrike,
    });
    
    openScoreConfirmation();
  };

  const handleDismissalSubmit = (dismissalInfo: {
    batsmanId: string;
    dismissalType: DismissalType;
    fielderIds?: string[];
  }) => {
    const ballEvent: Partial<BallEvent> = {
      runs: 0,
      batsmanId: currentInnings.onStrike,
      bowlerId: currentInnings.currentBowler,
      isWicket: true,
      dismissalType: dismissalInfo.dismissalType,
      dismissedPlayerId: dismissalInfo.batsmanId,
      fielderIds: dismissalInfo.fielderIds,
    };

    setPendingBallEvent(ballEvent);
    
    setPendingScoreDetails({
      runs: 0,
      isWicket: true,
      dismissalType: dismissalInfo.dismissalType,
      batsmanName: getBatsmanName(dismissalInfo.batsmanId),
      bowlerName: getBowlerName(currentInnings.currentBowler),
      rotateStrike: false,
    });
    
    openScoreConfirmation();
  };

  const handleSwitchStrike = async () => {
    if (!match) return;

    try {
      const updatedMatch = JSON.parse(JSON.stringify(match));
      const currentInningsIndex = updatedMatch.currentInnings;
      const innings = updatedMatch.innings[currentInningsIndex];
      
      const currentStrike = innings.onStrike;
      const otherBatsman = innings.currentBatsmen.find(id => id !== currentStrike);
      
      if (otherBatsman) {
        innings.onStrike = otherBatsman;
        
        await updateMatch(updatedMatch);
        
        toast({
          title: "Strike Rotated",
          description: "Batsmen positions switched",
        });
      }
    } catch (err) {
      console.error("Error switching strike:", err);
      toast({
        title: "Error",
        description: "Failed to switch strike",
        variant: "destructive",
      });
    }
  };

  const handleSelectBatsman = async (playerId: string) => {
    if (!match) return;

    try {
      const updatedMatch = JSON.parse(JSON.stringify(match));
      const currentInningsIndex = updatedMatch.currentInnings;
      const innings = updatedMatch.innings[currentInningsIndex];
      
      if (!innings.currentBatsmen[0]) {
        innings.currentBatsmen[0] = playerId;
        innings.onStrike = playerId;
      } 
      else if (!innings.currentBatsmen[1]) {
        innings.currentBatsmen[1] = playerId;
      } 
      else {
        const outBatsmanIndex = innings.currentBatsmen.findIndex(id => 
          innings.batsmanStats[id]?.isOut || !id);
        
        if (outBatsmanIndex !== -1) {
          innings.currentBatsmen[outBatsmanIndex] = playerId;
          
          if (innings.onStrike === innings.currentBatsmen[outBatsmanIndex] || 
              !innings.onStrike) {
            innings.onStrike = playerId;
          }
        }
      }
      
      if (!innings.batsmanStats[playerId]) {
        innings.batsmanStats[playerId] = {
          playerId,
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          isOut: false
        };
      }
      
      await updateMatch(updatedMatch);
      
      toast({
        title: "Batsman Selected",
        description: getBatsmanName(playerId) + " is now batting",
      });
    } catch (err) {
      console.error("Error selecting batsman:", err);
      toast({
        title: "Error",
        description: "Failed to select batsman",
        variant: "destructive",
      });
    }
  };

  const handleSelectBowler = async (playerId: string) => {
    if (!match) return;

    try {
      const updatedMatch = JSON.parse(JSON.stringify(match));
      const currentInningsIndex = updatedMatch.currentInnings;
      const innings = updatedMatch.innings[currentInningsIndex];
      
      innings.currentBowler = playerId;
      
      if (!innings.bowlerStats[playerId]) {
        innings.bowlerStats[playerId] = {
          playerId,
          overs: 0,
          balls: 0,
          maidens: 0,
          runs: 0,
          wickets: 0
        };
      }
      
      await updateMatch(updatedMatch);
      
      toast({
        title: "Bowler Selected",
        description: getBowlerName(playerId) + " is now bowling",
      });
    } catch (err) {
      console.error("Error selecting bowler:", err);
      toast({
        title: "Error",
        description: "Failed to select bowler",
        variant: "destructive",
      });
    }
  };

  const confirmScoreSubmission = async () => {
    if (!pendingBallEvent) return;
    
    await processScoreUpdate(pendingBallEvent, noStrikeRotation);
    closeScoreConfirmation();
    
    setPendingBallEvent(null);
    setPendingScoreDetails(null);
    setNoStrikeRotation(false);
  };

  const processScoreUpdate = async (ballEvent: Partial<BallEvent>, noStrikeRotation = false) => {
    if (!match) return;

    try {
      const event: BallEvent = {
        ...ballEvent,
        ballNumber: (currentInnings.currentBall + 1) % 6,
        overNumber: currentInnings.currentOver + (currentInnings.currentBall === 5 ? 1 : 0),
        batsmanId: currentInnings.onStrike,
        bowlerId: currentInnings.currentBowler,
        runs: ballEvent.runs || 0,
        isWide: ballEvent.isWide || false,
        isNoBall: ballEvent.isNoBall || false,
        isBye: ballEvent.isBye || false,
        isLegBye: ballEvent.isLegBye || false,
        isWicket: ballEvent.isWicket || false,
        dismissalType: ballEvent.dismissalType,
        dismissedPlayerId: ballEvent.dismissedPlayerId,
        fielderIds: ballEvent.fielderIds,
        timestamp: Date.now()
      };

      await saveMatchEvent(event);

      if (!event.isWide && !event.isNoBall && 
          currentInnings.currentBall === 5) {
        openSelectBowlerModal();
      }

      if (event.isWicket && event.dismissedPlayerId) {
        openSelectBatsmanModal();
      }

      if (!noStrikeRotation && 
          (event.runs % 2 === 1 || 
           (currentInnings.currentBall === 5 && !event.isWide && !event.isNoBall))) {
        await handleSwitchStrike();
      }

    } catch (err) {
      console.error("Error processing score update:", err);
      toast({
        title: "Error",
        description: "Failed to update score",
        variant: "destructive",
      });
    }
  };

  const getBatsmanName = (id: string): string => {
    const player = battingTeam.players.find(p => p.id === id);
    return player ? player.name : "Unknown Batsman";
  };

  const getBowlerName = (id: string): string => {
    const player = bowlingTeam.players.find(p => p.id === id);
    return player ? player.name : "Unknown Bowler";
  };

  const getAvailableBatsmen = (): Player[] => {
    if (!match) return [];
    
    const currentBatsmen = new Set(currentInnings.currentBatsmen);
    return battingTeam.players.filter(player => 
      !currentBatsmen.has(player.id) && 
      !currentInnings.batsmanStats[player.id]?.isOut
    );
  };

  const getAvailableBowlers = (): Player[] => {
    if (!match) return [];
    return bowlingTeam.players;
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <ScoreHeader match={match} />
      
      <PageTransition className="flex-grow flex flex-col max-w-full">
        <div className="container max-w-4xl mx-auto px-4 py-6 flex-grow flex flex-col">
          <div className="mb-6">
            <ScoreSummary 
              match={match} 
              currentInnings={currentInnings} 
              battingTeam={battingTeam} 
            />
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex-grow flex flex-col space-y-6">
            <CurrentOverDisplay 
              currentInnings={currentInnings}
            />
            
            <BatsmenInfo 
              currentInnings={currentInnings}
              battingTeam={battingTeam}
            />
            
            <BowlerInfo 
              currentInnings={currentInnings}
              bowlingTeam={bowlingTeam}
            />
            
            <ScoringButtons 
              selectedRun={selectedRun}
              onRunSelect={handleRunSelect}
              onExtrasClick={openExtrasModal}
              onWicketClick={openDismissalModal}
              onCustomRunsClick={openRunsModal}
              onSwitchStrikeClick={handleSwitchStrike}
              disabled={needsInitialization}
            />
          </div>
        </div>
      </PageTransition>

      <RunsInputModal 
        open={isRunsModalOpen} 
        onClose={closeRunsModal}
        onSubmit={handleRunsSubmit}
      />
      
      <ExtrasModal 
        open={isExtrasModalOpen} 
        onClose={closeExtrasModal}
        onSubmit={handleExtrasSubmit}
        byesEnabled={match.scoringOptions.byesValid}
        legByesEnabled={match.scoringOptions.legByesValid}
      />
      
      <DismissalModal 
        open={isDismissalModalOpen}
        onClose={closeDismissalModal}
        batsmen={[
          currentInnings.currentBatsmen[0] ? 
            battingTeam.players.find(p => p.id === currentInnings.currentBatsmen[0]) || null : null,
          currentInnings.currentBatsmen[1] ? 
            battingTeam.players.find(p => p.id === currentInnings.currentBatsmen[1]) || null : null
        ]}
        fielders={bowlingTeam.players}
        bowler={bowlingTeam.players.find(p => p.id === currentInnings.currentBowler) || null}
        isLbwEnabled={match.scoringOptions.isLbwValid}
        onDismiss={handleDismissalSubmit}
      />
      
      <SelectBatsmanModal 
        open={isSelectBatsmanModalOpen}
        onClose={closeSelectBatsmanModal}
        availablePlayers={getAvailableBatsmen()}
        onSelect={handleSelectBatsman}
      />
      
      <SelectBowlerModal 
        open={isSelectBowlerModalOpen}
        onClose={closeSelectBowlerModal}
        availablePlayers={getAvailableBowlers()}
        currentBowler={currentInnings.currentBowler}
        onSelect={handleSelectBowler}
      />
      
      <ScoreConfirmationModal
        open={isScoreConfirmationOpen}
        onClose={closeScoreConfirmation}
        onConfirm={confirmScoreSubmission}
        scoreDetails={pendingScoreDetails || {runs: 0}}
      />
      
      <SelectBatsmanModal 
        open={strikerModal.isOpen}
        onClose={strikerModal.onClose}
        availablePlayers={battingTeam.players}
        onSelect={handleSelectStriker}
        title="Select Opening Batsman"
        description="Choose a batsman to face the first ball"
        selectForPosition="striker"
      />
      
      <SelectBatsmanModal 
        open={nonStrikerModal.isOpen}
        onClose={nonStrikerModal.onClose}
        availablePlayers={battingTeam.players.filter(
          p => p.id !== currentInnings.currentBatsmen[0]
        )}
        onSelect={handleSelectNonStriker}
        title="Select Non-Striker"
        description="Choose a batsman for the non-striker's end"
        selectForPosition="non-striker"
      />
      
      <SelectBowlerModal 
        open={bowlerModal.isOpen}
        onClose={bowlerModal.onClose}
        availablePlayers={bowlingTeam.players}
        onSelect={handleSelectBowler}
      />
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

const CurrentOverDisplay = ({ currentInnings }: { currentInnings: any }) => {
  const getCurrentOverBalls = () => {
    if (!currentInnings.overs || currentInnings.overs.length === 0) {
      return [];
    }
    
    const currentOverIndex = currentInnings.currentBall === 0 && currentInnings.currentOver > 0
      ? currentInnings.currentOver - 1
      : currentInnings.currentOver;
    
    return currentInnings.overs[currentOverIndex]?.balls || [];
  };
  
  const currentOverBalls = getCurrentOverBalls();
  
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">Current Over</h3>
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {currentOverBalls.map((ball: any, index: number) => (
          <div 
            key={index}
            className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium border flex-shrink-0",
              ball.isWicket ? "bg-red-100 border-red-300 text-red-700" :
              ball.isWide || ball.isNoBall ? "bg-amber-100 border-amber-300 text-amber-700" :
              ball.isBye || ball.isLegBye ? "bg-indigo-100 border-indigo-300 text-indigo-700" :
              ball.runs === 4 || ball.runs === 6 ? "bg-green-100 border-green-300 text-green-700" :
              "bg-gray-100 border-gray-300 text-gray-700"
            )}
          >
            {ball.isWicket ? 'W' : 
             ball.isWide ? 'Wd' :
             ball.isNoBall ? 'Nb' :
             ball.isBye ? 'B' :
             ball.isLegBye ? 'Lb' :
             ball.runs}
          </div>
        ))}
        {Array(6 - currentOverBalls.length).fill(0).map((_, index) => (
          <div 
            key={`empty-${index}`}
            className="h-8 w-8 rounded-full flex items-center justify-center text-sm border border-gray-200 text-gray-300 flex-shrink-0"
          >
            •
          </div>
        ))}
      </div>
    </div>
  );
};

const BatsmenInfo = ({ 
  currentInnings,
  battingTeam
}: { 
  currentInnings: any;
  battingTeam: any;
}) => {
  const getBatsmen = () => {
    const result = [];
    
    for (const batsmanId of currentInnings.currentBatsmen) {
      if (batsmanId) {
        const player = battingTeam.players.find((p: any) => p.id === batsmanId);
        const stats = currentInnings.batsmanStats[batsmanId] || {
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0
        };
        
        if (player) {
          result.push({
            name: player.name,
            runs: stats.runs,
            balls: stats.balls,
            fours: stats.fours,
            sixes: stats.sixes,
            strikeRate: stats.balls > 0 ? (stats.runs / stats.balls) * 100 : 0,
            onStrike: batsmanId === currentInnings.onStrike
          });
        }
      }
    }
    
    while (result.length < 2) {
      result.push({
        name: "Batsman to come",
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        strikeRate: 0,
        onStrike: false
      });
    }
    
    return result;
  };
  
  const batsmen = getBatsmen();
  
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

const BowlerInfo = ({ 
  currentInnings,
  bowlingTeam
}: { 
  currentInnings: any;
  bowlingTeam: any;
}) => {
  const getBowler = () => {
    const bowlerId = currentInnings.currentBowler;
    
    if (!bowlerId) {
      return {
        name: "No bowler selected",
        overs: 0,
        maidens: 0,
        runs: 0,
        wickets: 0,
        economy: 0
      };
    }
    
    const player = bowlingTeam.players.find((p: any) => p.id === bowlerId);
    const stats = currentInnings.bowlerStats[bowlerId] || {
      overs: 0,
      balls: 0,
      maidens: 0,
      runs: 0,
      wickets: 0
    };
    
    const completedOvers = Math.floor(stats.balls / 6);
    const remainingBalls = stats.balls % 6;
    const oversDisplay = remainingBalls > 0 
      ? `${completedOvers}.${remainingBalls}` 
      : completedOvers;
    
    return {
      name: player ? player.name : "Unknown Bowler",
      overs: oversDisplay,
      maidens: stats.maidens,
      runs: stats.runs,
      wickets: stats.wickets,
      economy: stats.balls > 0 
        ? (stats.runs / (stats.balls / 6 || 1)).toFixed(2) 
        : "0.00"
    };
  };
  
  const bowler = getBowler();
  
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">Bowler</h3>
      <div className="p-3 rounded-lg border bg-gray-50 border-gray-200">
        <div className="flex justify-between items-center">
          <span className="font-medium">{bowler.name}</span>
          <span className="text-sm text-muted-foreground">
            Econ: {bowler.economy}
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
  onRunSelect,
  onExtrasClick,
  onWicketClick,
  onCustomRunsClick,
  onSwitchStrikeClick,
  disabled = false
}: {
  selectedRun: number | null;
  onRunSelect: (run: number) => void;
  onExtrasClick: () => void;
  onWicketClick: () => void;
  onCustomRunsClick: () => void;
  onSwitchStrikeClick: () => void;
  disabled?: boolean;
}) => {
  const runOptions = [0, 1, 2, 3, 4, 6];
  
  return (
    <div className="space-y-4 mb-6 relative">
      <h3 className="text-sm font-medium text-muted-foreground">Scoring</h3>
      
      {disabled && (
        <div className="absolute inset-0 bg-gray-100/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
          <div className="text-center p-4">
            <h3 className="text-lg font-medium mb-2">Innings Setup Required</h3>
            <p className="text-muted-foreground">Please select batsmen and bowler to start the innings</p>
          </div>
        </div>
      )}
      
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
            onClick={() => onRunSelect(run)}
            disabled={disabled}
          >
            {run}
          </Button>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
          onClick={onExtrasClick}
          disabled={disabled}
        >
          Extras
        </Button>
        <Button
          variant="outline"
          className="h-auto py-2.5"
          onClick={onCustomRunsClick}
          disabled={disabled}
        >
          Custom Runs
        </Button>
      </div>
      
      <Button
        variant="outline"
        className="w-full bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
        onClick={onWicketClick}
        disabled={disabled}
      >
        Wicket
      </Button>
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className="text-muted-foreground"
          onClick={() => {
            toast({
              title: "Edit Mode",
              description: "This feature is coming soon",
            });
          }}
          disabled={disabled}
        >
          Edit Last Ball
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-primary"
          onClick={onSwitchStrikeClick}
          disabled={disabled}
        >
          Switch Strike
        </Button>
      </div>
    </div>
  );
};

export default ScoringInterface;

