
import React, { useState, useEffect, useRef } from 'react';
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
  Share2,
  ChevronLeft,
  ChevronRight
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
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

const ScoringInterface = () => {
  const navigate = useNavigate();
  const { match, isLoading, saveMatchEvent, updateMatch } = useMatch();
  const [selectedRun, setSelectedRun] = useState<number | null>(null);
  const [pendingBallEvent, setPendingBallEvent] = useState<Partial<BallEvent> | null>(null);
  const [pendingScoreDetails, setPendingScoreDetails] = useState<ScoreDetails | null>(null);
  const [noStrikeRotation, setNoStrikeRotation] = useState<boolean>(false);
  const [selectedBallToEdit, setSelectedBallToEdit] = useState<{overIndex: number, ballIndex: number} | null>(null);
  const [currentOverIndex, setCurrentOverIndex] = useState<number>(0);
  
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
        duration: 5000,
      });
      return;
    }
    
    if (match.matchStatus === 'not_started' || match.innings.length === 0) {
      navigate('/setup');
      toast({
        title: "Match not set up",
        description: "Please complete match setup first",
        duration: 5000,
      });
      return;
    }
  }, [match, navigate]);

  useEffect(() => {
    if (match && match.innings.length > 0) {
      setCurrentOverIndex(match.innings[match.currentInnings].currentOver);
    }
  }, [match]);
  
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
      
      const willRotateStrike = run % 2 === 1;
      
      setPendingScoreDetails({
        runs: run,
        batsmanName: getBatsmanName(currentInnings.onStrike),
        bowlerName: getBowlerName(currentInnings.currentBowler),
        rotateStrike: willRotateStrike,
      });
      
      openScoreConfirmation();
      
      setTimeout(() => setSelectedRun(null), 300);
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
    
    const willRotateStrike = runsInfo.runs % 2 === 1;
    setNoStrikeRotation(!willRotateStrike);
    
    setPendingScoreDetails({
      runs: runsInfo.runs,
      batsmanName: getBatsmanName(currentInnings.onStrike),
      bowlerName: getBowlerName(currentInnings.currentBowler),
      rotateStrike: willRotateStrike,
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
    
    const willRotateStrike = extrasInfo.runs % 2 === 1;
    setNoStrikeRotation(!willRotateStrike);
    
    setPendingScoreDetails({
      runs: extrasInfo.runs,
      isWide: ballEvent.isWide,
      isNoBall: ballEvent.isNoBall,
      isBye: ballEvent.isBye,
      isLegBye: ballEvent.isLegBye,
      isWicket: extrasInfo.isWicket,
      batsmanName: getBatsmanName(currentInnings.onStrike),
      bowlerName: getBowlerName(currentInnings.currentBowler),
      rotateStrike: willRotateStrike,
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
          duration: 5000,
        });
      }
    } catch (err) {
      console.error("Error switching strike:", err);
      toast({
        title: "Error",
        description: "Failed to switch strike",
        variant: "destructive",
        duration: 5000,
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
        duration: 5000,
      });
    } catch (err) {
      console.error("Error selecting batsman:", err);
      toast({
        title: "Error",
        description: "Failed to select batsman",
        variant: "destructive",
        duration: 5000,
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
          duration: 5000,
        });
      } catch (err) {
        console.error("Error selecting bowler:", err);
        toast({
          title: "Error",
          description: "Failed to select bowler",
          variant: "destructive",
          duration: 5000,
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
          currentInnings.currentBall === 0 && currentInnings.currentOver > 0) {
        openSelectBowlerModal();
      }

      if (event.isWicket && event.dismissedPlayerId) {
        openSelectBatsmanModal();
      }

      if (!noStrikeRotation && 
          (event.runs % 2 === 1 || 
           (currentInnings.currentBall === 0 && currentInnings.currentOver > 0 && !event.isWide && !event.isNoBall))) {
        await handleSwitchStrike();
      }
      
      setCurrentOverIndex(currentInnings.currentOver);

    } catch (err) {
      console.error("Error processing score update:", err);
      toast({
        title: "Error",
        description: "Failed to update score",
        variant: "destructive",
        duration: 5000,
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

  const navigateToPreviousOver = () => {
    if (currentOverIndex > 0) {
      setCurrentOverIndex(currentOverIndex - 1);
    }
  };

  const navigateToNextOver = () => {
    if (currentOverIndex < currentInnings.overs.length - 1) {
      setCurrentOverIndex(currentOverIndex + 1);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-blue-600 text-white sticky top-0 z-30">
        <div className="container px-2 py-2 mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2 text-white hover:bg-blue-700/80"
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
                className="text-white hover:bg-blue-700/80 rounded-full h-8 w-8"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-blue-700/80 rounded-full h-8 w-8"
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

      <div className="bg-white border-b py-2 px-3 shadow-sm">
        <div className="flex justify-between items-center text-sm">
          <div className="font-medium">{match.team1.name} vs {match.team2.name}</div>
          <div className="text-blue-700 text-xs bg-blue-50 px-2 py-0.5 rounded font-mono">
            {match.id}
          </div>
        </div>
      </div>
      
      <PageTransition className="flex-grow flex flex-col max-w-full">
        <div className="container mx-auto px-2 py-2 flex-grow flex flex-col">
          <div className="bg-white rounded-md shadow-sm border mb-2 overflow-hidden">
            <div className="bg-blue-600 text-white px-3 py-3">
              <div className="flex justify-between items-baseline">
                <h2 className="text-base font-semibold">{battingTeam.name}</h2>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">{currentInnings.totalRuns}</span>
                  <span className="mx-0.5">/</span>
                  <span>{currentInnings.wickets}</span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-1 text-blue-100 text-xs">
                <div className="flex items-center">
                  <span>{oversDisplay} overs</span>
                </div>
                <div>
                  CRR: {currentRunRate}
                </div>
              </div>
            </div>
          </div>
          
          <CurrentOverDisplay 
            innings={currentInnings}
            currentOverIndex={currentOverIndex}
            onPrev={navigateToPreviousOver}
            onNext={navigateToNextOver}
            onHistoryClick={openOverHistoryModal}
          />
          
          <div className="grid gap-2 mb-1">
            <BatsmenInfo 
              currentInnings={currentInnings}
              battingTeam={battingTeam}
            />
            
            <BowlerInfo 
              currentInnings={currentInnings}
              bowlingTeam={bowlingTeam}
            />
          </div>
          
          <div className="pt-1">
            <ScoringButtons 
              selectedRun={selectedRun}
              onRunSelect={handleRunSelect}
              onExtrasClick={openExtrasModal}
              onWicketClick={openDismissalModal}
              onSwitchStrikeClick={handleSwitchStrike}
              onOverHistoryClick={openOverHistoryModal}
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
              duration: 5000,
            });
          }}
        />
      )}
    </div>
  );
};

const CurrentOverDisplay = ({ 
  innings,
  currentOverIndex,
  onPrev,
  onNext,
  onHistoryClick
}: { 
  innings: any;
  currentOverIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onHistoryClick: () => void;
}) => {
  const getOverBalls = (overIndex: number) => {
    if (!innings.overs || innings.overs.length === 0 || !innings.overs[overIndex]) {
      return [];
    }
    
    return innings.overs[overIndex]?.balls || [];
  };
  
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
      ball.runs === 4 ? "bg-blue-100 border-blue-300 text-blue-700" :
      ball.runs === 6 ? "bg-red-100 border-red-300 text-red-700" :
      "bg-gray-100 border-gray-300 text-gray-700"
    );
  };

  const availableOvers = Array.from(
    { length: innings.overs ? innings.overs.length : 0 },
    (_, i) => i
  );
  
  const showPrev = currentOverIndex > 0;
  const showNext = currentOverIndex < (innings.overs?.length || 0) - 1;
  
  const startIndex = currentOverIndex;
  
  return (
    <div className="bg-white rounded-md shadow-sm border p-2 mb-2">
      <div className="flex justify-between items-center mb-1.5">
        <h3 className="text-xs font-medium text-gray-600">
          {currentOverIndex === innings.currentOver ? "This Over" : `Over ${currentOverIndex + 1}`}
        </h3>
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs text-blue-700"
            onClick={onHistoryClick}
          >
            <History className="h-3.5 w-3.5 mr-1" />
            History
          </Button>
        </div>
      </div>
      
      <Carousel opts={{ loop: false, align: "center", startIndex }} className="w-full">
        <CarouselContent>
          {availableOvers.map((overIndex) => {
            const overBalls = getOverBalls(overIndex);
            const emptyBallsCount = Math.max(0, 6 - overBalls.length);
            
            return (
              <CarouselItem key={overIndex} className="basis-full">
                <div className="flex justify-center space-x-2 pb-1">
                  {overBalls.map((ball: any, index: number) => (
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
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {showPrev && <CarouselPrevious onClick={onPrev} />}
        {showNext && <CarouselNext onClick={onNext} />}
      </Carousel>
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
        const stats = currentInnings.batsmanStats[batsmanId];
        
        if (player && stats) {
          result.push({
            player,
            stats,
            isOnStrike: batsmanId === currentInnings.onStrike
          });
        }
      }
    }
    
    return result;
  };
  
  const batsmen = getBatsmen();
  
  if (batsmen.length === 0) {
    return (
      <div className="bg-white rounded-md shadow-sm border p-2">
        <div className="py-4 text-center text-gray-500">
          No batsmen selected
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-md shadow-sm border p-2">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-xs font-medium text-gray-600">Batsmen</h3>
      </div>
      
      <div className="space-y-1">
        {batsmen.map(({ player, stats, isOnStrike }) => (
          <div key={player.id} className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex flex-col">
                <div className="flex items-center">
                  {isOnStrike && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-1.5"></div>
                  )}
                  <span className="font-medium text-sm">{player.name}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {stats.balls ? `${(stats.runs / stats.balls * 100).toFixed(1)} SR` : 'Yet to face'}
                </span>
              </div>
            </div>
            <div className="text-right flex items-center space-x-1">
              <div className="text-sm font-medium">
                {stats.runs}
              </div>
              <div className="text-xs text-gray-500">
                ({stats.balls})
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
  const getCurrentBowler = () => {
    const bowlerId = currentInnings.currentBowler;
    if (!bowlerId) return null;
    
    const player = bowlingTeam.players.find((p: any) => p.id === bowlerId);
    const stats = currentInnings.bowlerStats[bowlerId];
    
    if (player && stats) {
      return { player, stats };
    }
    
    return null;
  };
  
  const bowler = getCurrentBowler();
  
  if (!bowler) {
    return (
      <div className="bg-white rounded-md shadow-sm border p-2">
        <div className="py-4 text-center text-gray-500">
          No bowler selected
        </div>
      </div>
    );
  }
  
  const completeOvers = Math.floor(bowler.stats.balls / 6);
  const remainingBalls = bowler.stats.balls % 6;
  const overs = `${completeOvers}${remainingBalls > 0 ? '.' + remainingBalls : ''}`;
  
  return (
    <div className="bg-white rounded-md shadow-sm border p-2">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-xs font-medium text-gray-600">Bowler</h3>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex flex-col">
            <span className="font-medium text-sm">{bowler.player.name}</span>
            <span className="text-xs text-gray-500">
              {bowler.stats.balls > 0 ? `${(bowler.stats.runs / bowler.stats.balls * 6).toFixed(2)} Econ` : 'Yet to bowl'}
            </span>
          </div>
        </div>
        <div className="text-right flex items-center space-x-1">
          <div className="text-sm flex space-x-3">
            <span>{overs} ov</span>
            <span>{bowler.stats.runs} runs</span>
            <span>{bowler.stats.wickets} wkts</span>
          </div>
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
  onSwitchStrikeClick,
  onOverHistoryClick,
  disabled
}: {
  selectedRun: number | null;
  onRunSelect: (run: number) => void;
  onExtrasClick: () => void;
  onWicketClick: () => void;
  onSwitchStrikeClick: () => void;
  onOverHistoryClick: () => void;
  disabled?: boolean;
}) => {
  const runButtons = [0, 1, 2, 3, 4, 6];
  
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-6 gap-2">
        {runButtons.map(run => (
          <Button
            key={run}
            onClick={() => onRunSelect(run)}
            variant={run === 4 ? "blue" : run === 6 ? "red" : "outline"}
            className={`h-16 text-lg ${run === selectedRun ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
            disabled={disabled}
          >
            {run}
          </Button>
        ))}
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <Button 
          variant="outline" 
          className="h-12 text-blue-700 border-blue-500"
          onClick={onExtrasClick}
          disabled={disabled}
        >
          Extras
        </Button>
        
        <Button 
          variant="blue" 
          className="h-12"
          onClick={onWicketClick}
          disabled={disabled}
        >
          Wicket
        </Button>
        
        <Button 
          variant="outline" 
          className="h-12 gap-1"
          onClick={onSwitchStrikeClick}
          disabled={disabled}
        >
          <RotateCw className="h-4 w-4" />
          Switch
        </Button>
      </div>
    </div>
  );
};

export default ScoringInterface;
