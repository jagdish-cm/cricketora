import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatch, BallEvent, Player } from '@/context/MatchContext';
import { 
  PageTransition,
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
  FastForward,
  History,
  ArrowLeft,
  BookOpen,
  Share2
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
import EditBallModal from './EditBallModal';
import OverHistoryModal from './OverHistoryModal';
import { useDisclosure } from '@/hooks/use-disclosure';
import { useInningsInit } from '@/hooks/use-innings-init';

const ScoringInterface = () => {
  const navigate = useNavigate();
  const { match, isLoading, saveMatchEvent, updateMatch } = useMatch();
  const [selectedRun, setSelectedRun] = useState<number | null>(null);
  const [pendingBallEvent, setPendingBallEvent] = useState<Partial<BallEvent> | null>(null);
  const [pendingScoreDetails, setPendingScoreDetails] = useState<ScoreDetails | null>(null);
  const [noStrikeRotation, setNoStrikeRotation] = useState<boolean>(false);
  const [selectedBallToEdit, setSelectedBallToEdit] = useState<{overIndex: number, ballIndex: number} | null>(null);
  
  const {
    needsInitialization,
    strikerModal,
    nonStrikerModal,
    bowlerModal,
    handleSelectStriker,
    handleSelectNonStriker,
    handleSelectBowler: initHandleSelectBowler,
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

  const {
    isOpen: isEditBallModalOpen,
    onOpen: openEditBallModal,
    onClose: closeEditBallModal
  } = useDisclosure();

  const {
    isOpen: isOverHistoryModalOpen,
    onOpen: openOverHistoryModal,
    onClose: closeOverHistoryModal
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
      navigate('/setup');
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

  const handleSelectBatsman = async (playerId: string, playerName?: string) => {
    if (!match) return;

    try {
      const updatedMatch = JSON.parse(JSON.stringify(match));
      const currentInningsIndex = updatedMatch.currentInnings;
      const innings = updatedMatch.innings[currentInningsIndex];
      
      if (playerId === 'new_player' && playerName) {
        const newPlayer: Player = {
          id: `${battingTeam.id}_player_${battingTeam.players.length + 1}`,
          name: playerName,
          team: battingTeam.id === 'team1' ? 'team1' : 'team2'
        };
        
        updatedMatch[battingTeam.id === 'team1' ? 'team1' : 'team2'].players.push(newPlayer);
        playerId = newPlayer.id;
      }
      
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

  const handleSelectBowler = async (playerId: string, playerName?: string) => {
    if (needsInitialization && needsBowler) {
      initHandleSelectBowler(playerId);
    } else {
      if (!match) return;

      try {
        const updatedMatch = JSON.parse(JSON.stringify(match));
        const currentInningsIndex = updatedMatch.currentInnings;
        const innings = updatedMatch.innings[currentInningsIndex];
        
        if (playerId === 'new_player' && playerName) {
          const newPlayer: Player = {
            id: `${bowlingTeam.id}_player_${bowlingTeam.players.length + 1}`,
            name: playerName,
            team: bowlingTeam.id === 'team1' ? 'team1' : 'team2'
          };
          
          updatedMatch[bowlingTeam.id === 'team1' ? 'team1' : 'team2'].players.push(newPlayer);
          playerId = newPlayer.id;
        }
        
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

  const handleEditBall = (overIndex: number, ballIndex: number) => {
    setSelectedBallToEdit({ overIndex, ballIndex });
    openEditBallModal();
    closeOverHistoryModal();
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

  const completedOvers = currentInnings.currentOver;
  const ballsInCurrentOver = currentInnings.currentBall;
  const oversDisplay = `${completedOvers}${ballsInCurrentOver > 0 ? '.' + ballsInCurrentOver : ''}`;
  const currentRunRate = currentInnings.totalRuns > 0 ? 
    (currentInnings.totalRuns / (parseFloat(oversDisplay) || 1)).toFixed(2) : '0.00';
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Cricbuzz-style header */}
      <header className="bg-green-600 text-white sticky top-0 z-30">
        <div className="container px-2 py-2 mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2 text-white hover:bg-green-700"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-bold">Match Center</h1>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-green-700 rounded-full h-8 w-8"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-green-700 rounded-full h-8 w-8"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="space-y-4 py-4">
                    <h3 className="text-lg font-medium">Match Menu</h3>
                    
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={openOverHistoryModal}
                      >
                        <History className="h-4 w-4 mr-2" />
                        Ball by Ball
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Scorecard
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Match Settings
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-red-600 hover:text-red-700"
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

      {/* Match Info Bar */}
      <div className="bg-white border-b py-2 px-3 shadow-sm">
        <div className="flex justify-between items-center text-sm">
          <div className="font-medium">{match.team1.name} vs {match.team2.name}</div>
          <div className="text-green-700 text-xs bg-green-50 px-2 py-0.5 rounded font-mono">
            {match.id}
          </div>
        </div>
      </div>
      
      <PageTransition className="flex-grow flex flex-col max-w-full">
        <div className="container mx-auto px-2 py-2 flex-grow flex flex-col">
          {/* Score Summary - Cricbuzz Style */}
          <div className="bg-white rounded-md shadow-sm border mb-2 overflow-hidden">
            <div className="bg-green-600 text-white px-3 py-3">
              <div className="flex justify-between items-baseline">
                <h2 className="text-base font-semibold">{battingTeam.name}</h2>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">{currentInnings.totalRuns}</span>
                  <span className="mx-0.5">/</span>
                  <span>{currentInnings.wickets}</span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-1 text-green-100 text-xs">
                <div className="flex items-center">
                  <span>{oversDisplay} overs</span>
                </div>
                <div>
                  CRR: {currentRunRate}
                </div>
              </div>
            </div>
          </div>
          
          {/* Current Over Display - Compact */}
          <CurrentOverDisplay 
            currentInnings={currentInnings}
            onHistoryClick={openOverHistoryModal}
          />
          
          {/* Players Info Section */}
          <div className="grid gap-2 mb-2">
            <BatsmenInfo 
              currentInnings={currentInnings}
              battingTeam={battingTeam}
            />
            
            <BowlerInfo 
              currentInnings={currentInnings}
              bowlingTeam={bowlingTeam}
            />
          </div>
          
          {/* Scoring Pad */}
          <div className="pt-1">
            <ScoringButtons 
              selectedRun={selectedRun}
              onRunSelect={handleRunSelect}
              onExtrasClick={openExtrasModal}
              onWicketClick={openDismissalModal}
              onCustomRunsClick={openRunsModal}
              onSwitchStrikeClick={handleSwitchStrike}
              onOverHistoryClick={openOverHistoryModal}
              disabled={needsInitialization}
            />
          </div>
        </div>
      </PageTransition>

      {/* Modals */}
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
        allowAddPlayer={true}
      />
      
      <SelectBowlerModal 
        open={isSelectBowlerModalOpen}
        onClose={closeSelectBowlerModal}
        availablePlayers={getAvailableBowlers()}
        currentBowler={currentInnings.currentBowler}
        onSelect={handleSelectBowler}
        allowAddPlayer={true}
      />
      
      <ScoreConfirmationModal
        open={isScoreConfirmationOpen}
        onClose={closeScoreConfirmation}
        onConfirm={confirmScoreSubmission}
        scoreDetails={pendingScoreDetails || {runs: 0}}
        allowRotateStrikeToggle={true}
        rotateStrike={!noStrikeRotation}
        onRotateStrikeChange={(value) => setNoStrikeRotation(!value)}
      />
      
      <SelectBatsmanModal 
        open={strikerModal.isOpen}
        onClose={strikerModal.onClose}
        availablePlayers={battingTeam.players}
        onSelect={handleSelectStriker}
        title="Select Opening Batsman"
        description="Choose a batsman to face the first ball"
        selectForPosition="striker"
        allowAddPlayer={true}
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
        allowAddPlayer={true}
      />
      
      <SelectBowlerModal 
        open={bowlerModal.isOpen}
        onClose={bowlerModal.onClose}
        availablePlayers={bowlingTeam.players}
        onSelect={handleSelectBowler}
        allowAddPlayer={true}
      />

      <OverHistoryModal
        open={isOverHistoryModalOpen}
        onClose={closeOverHistoryModal}
        overs={currentInnings.overs}
        onEditBall={handleEditBall}
      />
      
      {selectedBallToEdit && (
        <EditBallModal
          open={isEditBallModalOpen}
          onClose={closeEditBallModal}
          match={match}
          overIndex={selectedBallToEdit.overIndex}
          ballIndex={selectedBallToEdit.ballIndex}
          onComplete={() => {
            setSelectedBallToEdit(null);
            toast({
              title: "Ball updated",
              description: "The ball has been updated successfully",
            });
          }}
        />
      )}
    </div>
  );
};

// Compact Current Over Display Component
const CurrentOverDisplay = ({ 
  currentInnings,
  onHistoryClick
}: { 
  currentInnings: any;
  onHistoryClick: () => void;
}) => {
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
  const emptyBallsCount = Math.max(0, 6 - currentOverBalls.length);
  
  const renderBallContent = (ball: any) => {
    if (ball.isWicket) return 'W';
    if (ball.isWide) return 'Wd';
    if (ball.isNoBall) return 'Nb';
    if (ball.isBye) return 'B';
    if (ball.isLegBye) return 'Lb';
    return ball.runs;
  };
  
  const getBallClass = (ball: any) => {
    return cn(
      "h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium border flex-shrink-0",
      ball.isWicket ? "bg-red-100 border-red-300 text-red-700" :
      ball.isWide || ball.isNoBall ? "bg-amber-100 border-amber-300 text-amber-700" :
      ball.isBye || ball.isLegBye ? "bg-indigo-100 border-indigo-300 text-indigo-700" :
      ball.runs === 4 ? "bg-green-100 border-green-300 text-green-700" :
      ball.runs === 6 ? "bg-emerald-100 border-emerald-300 text-emerald-700" :
      "bg-gray-100 border-gray-300 text-gray-700"
    );
  };
  
  return (
    <div className="bg-white rounded-md shadow-sm border p-2 mb-2">
      <div className="flex justify-between items-center mb-1.5">
        <h3 className="text-xs font-medium text-gray-600">This Over</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 px-2 text-xs text-green-700"
          onClick={onHistoryClick}
        >
          <History className="h-3.5 w-3.5 mr-1" />
          History
        </Button>
      </div>
      <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {currentOverBalls.map((ball: any, index: number) => (
          <div 
            key={index}
            className={getBallClass(ball)}
          >
            {renderBallContent(ball)}
          </div>
        ))}
        {Array.from({ length: emptyBallsCount }).map((_, index) => (
          <div 
            key={`empty-${index}`}
            className="h-8 w-8 rounded-full flex items-center justify-center text-xs border border-gray-200 text-gray-300 flex-shrink-0"
          >
            •
          </div>
        ))}
      </div>
    </div>
  );
};

// Compact Batsmen Info Component
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
    <div className="bg-white rounded-md shadow-sm border overflow-hidden">
      <div className="bg-green-50 px-2 py-1.5">
        <h3 className="text-xs font-medium text-green-800">Batsmen</h3>
      </div>
      <div className="divide-y">
        {batsmen.map((batsman, index) => (
          <div 
            key={index}
            className={cn(
              "px-3 py-2 flex items-center",
              batsman.onStrike ? "bg-green-50/50" : ""
            )}
          >
            <div className="flex-1">
              <div className="flex items-center">
                <span className="font-medium text-sm">
                  {batsman.name}
                  {batsman.onStrike && <span className="ml-1 text-green-600">*</span>}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {batsman.fours} fours, {batsman.sixes} sixes
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-semibold">{batsman.runs}</div>
              <div className="text-xs text-gray-500">
                {batsman.balls} balls
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Compact Bowler Info Component
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
    <div className="bg-white rounded-md shadow-sm border overflow-hidden">
      <div className="bg-green-50 px-2 py-1.5">
        <h3 className="text-xs font-medium text-green-800">Bowler</h3>
      </div>
      <div className="px-3 py-2">
        <div className="flex justify-between items-center">
          <span className="font-medium text-sm">{bowler.name}</span>
          <span className="text-xs text-gray-500">
            Econ: {bowler.economy}
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">
            {bowler.overs} ov, {bowler.maidens} md
          </span>
          <span className="font-semibold text-sm">
            {bowler.wickets}/{bowler.runs}
          </span>
        </div>
      </div>
    </div>
  );
};

// Redesigned Scoring Buttons Component
const ScoringButtons = ({ 
  selectedRun,
  onRunSelect,
  onExtrasClick,
  onWicketClick,
  onCustomRunsClick,
  onSwitchStrikeClick,
  onOverHistoryClick,
  disabled = false
}: {
  selectedRun: number | null;
  onRunSelect: (run: number) => void;
  onExtrasClick: () => void;
  onWicketClick: () => void;
  onCustomRunsClick: () => void;
  onSwitchStrikeClick: () => void;
  onOverHistoryClick: () => void;
  disabled?: boolean;
}) => {
  const runOptions = [0, 1, 2, 3, 4, 6];
  
  return (
    <div className="space-y-2 relative mb-4">
      {disabled && (
        <div className="absolute inset-0 bg-white/70 bg-white/70 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
          <div className="text-center p-3">
            <h3 className="text-base font-medium mb-1">Innings Setup Required</h3>
            <p className="text-gray-500 text-sm">Please select batsmen and bowler to start</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-2">
        {runOptions.map((run) => (
          <Button
            key={run}
            variant={selectedRun === run ? "default" : "outline"}
            className={cn(
              "h-12 text-base sm:text-lg font-medium transition-all",
              run === 4 && "bg-green-50 border-green-300 text-green-700 hover:bg-green-100",
              run === 6 && "bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100"
            )}
            onClick={() => onRunSelect(run)}
            disabled={disabled}
          >
            {run}
          </Button>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          className="bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 h-10 text-sm"
          onClick={onExtrasClick}
          disabled={disabled}
        >
          Extras
        </Button>
        <Button
          variant="outline"
          className="h-10 text-sm"
          onClick={onCustomRunsClick}
          disabled={disabled}
        >
          Custom Runs
        </Button>
      </div>
      
      <Button
        variant="outline"
        className="w-full bg-red-50 border-red-200 text-red-700 hover:bg-red-100 h-10 text-sm"
        onClick={onWicketClick}
        disabled={disabled}
      >
        Wicket
      </Button>
      
      <div className="flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 h-8 text-xs"
          onClick={onOverHistoryClick}
          disabled={disabled}
        >
          <Edit className="h-3.5 w-3.5 mr-1" />
          Edit Ball
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-green-700 h-8 text-xs"
          onClick={onSwitchStrikeClick}
          disabled={disabled}
        >
          <RotateCw className="h-3.5 w-3.5 mr-1" />
          Switch Strike
        </Button>
      </div>
    </div>
  );
};

export default ScoringInterface;
