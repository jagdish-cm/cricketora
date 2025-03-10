
import { useState, useEffect } from 'react';
import { useMatch, Match, Innings } from '@/context/MatchContext';
import { useDisclosure } from '@/hooks/use-disclosure';
import { toast } from '@/hooks/use-toast';

export function useInningsInit() {
  const { match, updateMatch } = useMatch();
  const [needsInitialization, setNeedsInitialization] = useState(false);
  const [needsStriker, setNeedsStriker] = useState(false);
  const [needsNonStriker, setNeedsNonStriker] = useState(false);
  const [needsBowler, setNeedsBowler] = useState(false);
  
  const strikerModal = useDisclosure();
  const nonStrikerModal = useDisclosure();
  const bowlerModal = useDisclosure();

  // Check if the innings needs to be initialized
  useEffect(() => {
    if (!match) return;
    
    const currentInnings = match.innings[match.currentInnings];
    if (!currentInnings) return;
    
    const needsInit = !currentInnings.currentBatsmen[0] || 
                      !currentInnings.currentBatsmen[1] || 
                      !currentInnings.currentBowler;
                      
    if (needsInit) {
      setNeedsInitialization(true);
      
      // Check what's missing
      if (!currentInnings.currentBatsmen[0]) {
        setNeedsStriker(true);
        strikerModal.onOpen();
      } else if (!currentInnings.currentBatsmen[1]) {
        setNeedsNonStriker(true);
        nonStrikerModal.onOpen();
      } else if (!currentInnings.currentBowler) {
        setNeedsNonStriker(false);
        setNeedsStriker(false);
        setNeedsBowler(true);
        bowlerModal.onOpen();
      }
    } else {
      setNeedsInitialization(false);
    }
  }, [match]);

  const handleSelectStriker = async (playerId: string) => {
    if (!match) return;
    
    try {
      const updatedMatch = JSON.parse(JSON.stringify(match)) as Match;
      const innings = updatedMatch.innings[updatedMatch.currentInnings];
      
      innings.currentBatsmen[0] = playerId;
      innings.onStrike = playerId;
      
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
      setNeedsStriker(false);
      
      if (!innings.currentBatsmen[1]) {
        setNeedsNonStriker(true);
        nonStrikerModal.onOpen();
      } else if (!innings.currentBowler) {
        setNeedsBowler(true);
        bowlerModal.onOpen();
      }
      
      toast({
        title: "Striker Selected",
        description: "Striker is now set for this innings",
      });
    } catch (error) {
      console.error("Error selecting striker:", error);
      toast({
        title: "Error selecting striker",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleSelectNonStriker = async (playerId: string) => {
    if (!match) return;
    
    try {
      const updatedMatch = JSON.parse(JSON.stringify(match)) as Match;
      const innings = updatedMatch.innings[updatedMatch.currentInnings];
      
      innings.currentBatsmen[1] = playerId;
      
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
      setNeedsNonStriker(false);
      
      if (!innings.currentBowler) {
        setNeedsBowler(true);
        bowlerModal.onOpen();
      }
      
      toast({
        title: "Non-Striker Selected",
        description: "Non-striker is now set for this innings",
      });
    } catch (error) {
      console.error("Error selecting non-striker:", error);
      toast({
        title: "Error selecting non-striker",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleSelectBowler = async (playerId: string) => {
    if (!match) return;
    
    try {
      const updatedMatch = JSON.parse(JSON.stringify(match)) as Match;
      const innings = updatedMatch.innings[updatedMatch.currentInnings];
      
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
      setNeedsBowler(false);
      setNeedsInitialization(false);
      
      toast({
        title: "Bowler Selected",
        description: "Bowler is now set for this innings",
      });
    } catch (error) {
      console.error("Error selecting bowler:", error);
      toast({
        title: "Error selecting bowler",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return {
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
  };
}
