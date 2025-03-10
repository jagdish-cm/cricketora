
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export interface Player {
  id: string;
  name: string;
  team: 'team1' | 'team2';
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
}

export interface BatsmanStats {
  playerId: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOut: boolean;
  dismissalType?: string;
  dismissedBy?: string;
  assistedBy?: string;
}

export interface BowlerStats {
  playerId: string;
  overs: number;
  balls: number;
  maidens: number;
  runs: number;
  wickets: number;
}

export interface BallEvent {
  ballNumber: number;
  overNumber: number;
  batsmanId: string;
  bowlerId: string;
  runs: number;
  isWide: boolean;
  isNoBall: boolean;
  isBye: boolean;
  isLegBye: boolean;
  isWicket: boolean;
  dismissalType?: string;
  dismissedPlayerId?: string;
  fielderIds?: string[];
  timestamp: number;
}

export interface Over {
  number: number;
  bowlerId: string;
  balls: BallEvent[];
  isMaiden: boolean;
}

export interface Innings {
  battingTeamId: string;
  bowlingTeamId: string;
  overs: Over[];
  currentOver: number;
  currentBall: number;
  totalRuns: number;
  wickets: number;
  extras: {
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
    penalties: number;
  };
  batsmanStats: Record<string, BatsmanStats>;
  bowlerStats: Record<string, BowlerStats>;
  currentBatsmen: [string, string];
  onStrike: string;
  currentBowler: string;
  isCompleted: boolean;
}

export interface Match {
  id: string;
  name?: string;
  team1: Team;
  team2: Team;
  tossWonBy: string;
  choseTo: 'bat' | 'bowl';
  totalOvers: number;
  isLimited: boolean;
  scoringOptions: {
    isLbwValid: boolean;
    byesValid: boolean;
    legByesValid: boolean;
  };
  innings: Innings[];
  currentInnings: number;
  matchStatus: 'not_started' | 'in_progress' | 'completed';
  createdAt: number;
  updatedAt: number;
  venue?: string;
  scorerEmail: string;
}

interface MatchContextType {
  match: Match | null;
  isLoading: boolean;
  error: string | null;
  createMatch: (matchData: Partial<Match>) => Promise<string>;
  loadMatch: (matchId: string, accessCode?: string) => Promise<void>;
  updateMatch: (matchData: Partial<Match>) => Promise<void>;
  saveMatchEvent: (event: BallEvent) => Promise<void>;
  clearMatch: () => void;
}

// Create the context with a default value
const MatchContext = createContext<MatchContextType | undefined>(undefined);

// Sample team for demo
const createTeamTemplate = (id: string, name: string): Team => ({
  id,
  name,
  players: Array(11).fill(null).map((_, index) => ({
    id: `${id}_player_${index + 1}`,
    name: `Player ${index + 1}`,
    team: id === 'team1' ? 'team1' : 'team2'
  }))
});

// Create match default template
const createMatchTemplate = (scorerEmail: string): Match => {
  const team1 = createTeamTemplate('team1', 'Team 1');
  const team2 = createTeamTemplate('team2', 'Team 2');
  
  const matchId = generateMatchId();
  
  return {
    id: matchId,
    team1,
    team2,
    tossWonBy: '',
    choseTo: 'bat',
    totalOvers: 20,
    isLimited: true,
    scoringOptions: {
      isLbwValid: true,
      byesValid: true,
      legByesValid: true
    },
    innings: [],
    currentInnings: 0,
    matchStatus: 'not_started',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    scorerEmail
  };
};

// Generate a unique match ID
const generateMatchId = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar looking characters
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// The Provider component
export const MatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [match, setMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load match from local storage on startup
  useEffect(() => {
    const storedMatch = localStorage.getItem('cricketora_current_match');
    if (storedMatch) {
      try {
        setMatch(JSON.parse(storedMatch));
      } catch (err) {
        console.error('Failed to parse stored match', err);
        localStorage.removeItem('cricketora_current_match');
      }
    }
  }, []);

  // Save match to local storage when it changes
  useEffect(() => {
    if (match) {
      localStorage.setItem('cricketora_current_match', JSON.stringify(match));
    }
  }, [match]);

  // Create a new match
  const createMatch = useCallback(async (matchData: Partial<Match>): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!matchData.scorerEmail) {
        throw new Error('Scorer email is required');
      }
      
      const newMatch = {
        ...createMatchTemplate(matchData.scorerEmail),
        ...matchData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      // In a real app, you would send this to an API
      // For now, we'll just simulate a delay and store locally
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMatch(newMatch);
      
      // Save to local matches database
      const allMatches = JSON.parse(localStorage.getItem('cricketora_matches') || '{}');
      allMatches[newMatch.id] = newMatch;
      localStorage.setItem('cricketora_matches', JSON.stringify(allMatches));
      
      toast({
        title: "Match created",
        description: `Match ID: ${newMatch.id}`,
      });
      
      return newMatch.id;
    } catch (err: any) {
      setError(err.message || 'Failed to create match');
      toast({
        title: "Error creating match",
        description: err.message || 'Failed to create match',
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load a match by ID
  const loadMatch = useCallback(async (matchId: string, accessCode?: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, you would fetch this from an API
      // For now, we'll just simulate a delay and load from local storage
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const allMatches = JSON.parse(localStorage.getItem('cricketora_matches') || '{}');
      const loadedMatch = allMatches[matchId];
      
      if (!loadedMatch) {
        throw new Error('Match not found');
      }
      
      // In a real implementation, you would verify the access code here
      // if (accessCode && loadedMatch.accessCode !== accessCode) {
      //   throw new Error('Invalid access code');
      // }
      
      setMatch(loadedMatch);
      
      toast({
        title: "Match loaded",
        description: `${loadedMatch.team1.name} vs ${loadedMatch.team2.name}`,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load match');
      toast({
        title: "Error loading match",
        description: err.message || 'Failed to load match',
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update match details
  const updateMatch = useCallback(async (matchData: Partial<Match>): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!match) {
        throw new Error('No match loaded');
      }
      
      const updatedMatch = {
        ...match,
        ...matchData,
        updatedAt: Date.now(),
      };
      
      // In a real app, you would send this to an API
      // For now, we'll just simulate a delay and update locally
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setMatch(updatedMatch);
      
      // Update in local matches database
      const allMatches = JSON.parse(localStorage.getItem('cricketora_matches') || '{}');
      allMatches[updatedMatch.id] = updatedMatch;
      localStorage.setItem('cricketora_matches', JSON.stringify(allMatches));
      
    } catch (err: any) {
      setError(err.message || 'Failed to update match');
      toast({
        title: "Error updating match",
        description: err.message || 'Failed to update match',
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [match]);

  // Save a ball event
  const saveMatchEvent = useCallback(async (event: BallEvent): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!match) {
        throw new Error('No match loaded');
      }
      
      // Deep clone to avoid direct state mutation
      const updatedMatch = JSON.parse(JSON.stringify(match)) as Match;
      
      // Get current innings
      const currentInningsIndex = updatedMatch.currentInnings;
      if (currentInningsIndex >= updatedMatch.innings.length) {
        throw new Error('Invalid innings index');
      }
      
      const innings = updatedMatch.innings[currentInningsIndex];
      
      // Check if we need to create a new over
      if (!innings.overs[innings.currentOver]) {
        innings.overs[innings.currentOver] = {
          number: innings.currentOver,
          bowlerId: event.bowlerId,
          balls: [],
          isMaiden: true  // Will be updated as runs are scored
        };
      }
      
      // Add ball to current over
      const currentOver = innings.overs[innings.currentOver];
      currentOver.balls.push(event);
      
      // Update maiden status if runs scored (including extras)
      if (event.runs > 0 || event.isWide || event.isNoBall) {
        currentOver.isMaiden = false;
      }
      
      // Update innings stats
      // 1. Update total runs
      const runsFromBall = event.runs;
      const extrasRuns = (event.isWide || event.isNoBall) ? 1 : 0;
      innings.totalRuns += runsFromBall + extrasRuns;
      
      // 2. Update extras
      if (event.isWide) innings.extras.wides += 1 + runsFromBall;
      if (event.isNoBall) innings.extras.noBalls += 1;
      if (event.isBye) innings.extras.byes += runsFromBall;
      if (event.isLegBye) innings.extras.legByes += runsFromBall;
      
      // 3. Update wickets
      if (event.isWicket) {
        innings.wickets += 1;
        
        // Update batsman stats to mark as out
        if (event.dismissedPlayerId && innings.batsmanStats[event.dismissedPlayerId]) {
          innings.batsmanStats[event.dismissedPlayerId].isOut = true;
          innings.batsmanStats[event.dismissedPlayerId].dismissalType = event.dismissalType;
          
          // If the bowler is credited with the wicket
          if (event.dismissalType && 
              ['bowled', 'caught', 'lbw', 'stumped'].includes(event.dismissalType)) {
            innings.batsmanStats[event.dismissedPlayerId].dismissedBy = event.bowlerId;
            
            // Update bowler stats
            if (innings.bowlerStats[event.bowlerId]) {
              innings.bowlerStats[event.bowlerId].wickets += 1;
            }
          }
          
          // If there's a fielder involved
          if (event.fielderIds && event.fielderIds.length > 0) {
            innings.batsmanStats[event.dismissedPlayerId].assistedBy = event.fielderIds[0];
          }
        }
      }
      
      // 4. Update batsman stats (only if not a wide and the batsman actually faced the ball)
      if (!event.isWide && event.batsmanId && innings.batsmanStats[event.batsmanId]) {
        const batsmanStats = innings.batsmanStats[event.batsmanId];
        
        // Only count the ball for the batsman if it's not a wide
        batsmanStats.balls += 1;
        
        // Only add runs to batsman if they're not extras
        if (!event.isBye && !event.isLegBye) {
          batsmanStats.runs += event.runs;
          
          // Update boundaries
          if (event.runs === 4) batsmanStats.fours += 1;
          if (event.runs === 6) batsmanStats.sixes += 1;
        }
      }
      
      // 5. Update bowler stats
      if (event.bowlerId && innings.bowlerStats[event.bowlerId]) {
        const bowlerStats = innings.bowlerStats[event.bowlerId];
        
        // Only count legal deliveries for overs bowled
        if (!event.isWide && !event.isNoBall) {
          bowlerStats.balls += 1;
        }
        
        // Add runs conceded (including extras)
        bowlerStats.runs += event.runs + (event.isWide || event.isNoBall ? 1 : 0);
        
        // Update maidens at the end of the over
        if (innings.currentBall === 5 && currentOver.isMaiden) {
          bowlerStats.maidens += 1;
        }
        
        // Calculate completed overs
        bowlerStats.overs = Math.floor(bowlerStats.balls / 6) + (bowlerStats.balls % 6) / 10;
      }
      
      // 6. Update current ball and over counters
      // Only legal deliveries count toward the over progression
      if (!event.isWide && !event.isNoBall) {
        innings.currentBall += 1;
        
        // If we've completed an over (6 balls)
        if (innings.currentBall >= 6) {
          innings.currentBall = 0;
          innings.currentOver += 1;
          
          // If we've reached the maximum overs, mark innings as completed
          if (innings.currentOver >= updatedMatch.totalOvers) {
            innings.isCompleted = true;
            
            // If this is the first innings, set up the second innings
            if (currentInningsIndex === 0 && updatedMatch.innings.length === 1) {
              const firstInnings = updatedMatch.innings[0];
              updatedMatch.innings.push({
                battingTeamId: firstInnings.bowlingTeamId,
                bowlingTeamId: firstInnings.battingTeamId,
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
              });
              updatedMatch.currentInnings = 1;
            } else if (currentInningsIndex === 1) {
              // If this is the second innings, the match is completed
              updatedMatch.matchStatus = 'completed';
            }
          }
        }
      }
      
      // Update the match state
      updatedMatch.updatedAt = Date.now();
      
      // In a real app, you would send this to an API
      // For now, we'll just simulate a delay and update locally
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setMatch(updatedMatch);
      
      // Update in local matches database
      const allMatches = JSON.parse(localStorage.getItem('cricketora_matches') || '{}');
      allMatches[updatedMatch.id] = updatedMatch;
      localStorage.setItem('cricketora_matches', JSON.stringify(allMatches));
      
    } catch (err: any) {
      setError(err.message || 'Failed to save match event');
      toast({
        title: "Error saving ball event",
        description: err.message || 'Failed to save match event',
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [match]);

  // Clear the current match
  const clearMatch = useCallback(() => {
    setMatch(null);
    localStorage.removeItem('cricketora_current_match');
  }, []);

  const value = {
    match,
    isLoading,
    error,
    createMatch,
    loadMatch,
    updateMatch,
    saveMatchEvent,
    clearMatch,
  };

  return (
    <MatchContext.Provider value={value}>
      {children}
    </MatchContext.Provider>
  );
};

// Custom hook to use the match context
export const useMatch = () => {
  const context = useContext(MatchContext);
  if (context === undefined) {
    throw new Error('useMatch must be used within a MatchProvider');
  }
  return context;
};
