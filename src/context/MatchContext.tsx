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
  playersCount: number;
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

const MatchContext = createContext<MatchContextType | undefined>(undefined);

const createTeamTemplate = (id: string, name: string, playersCount: number = 11): Team => {
  return {
    id,
    name,
    playersCount,
    players: Array(playersCount).fill(null).map((_, index) => ({
      id: `${id}_player_${index + 1}`,
      name: `Player ${index + 1}`,
      team: id === 'team1' ? 'team1' : 'team2'
    }))
  };
};

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

const generateMatchId = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const MatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [match, setMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    if (match) {
      localStorage.setItem('cricketora_current_match', JSON.stringify(match));
    }
  }, [match]);

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
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMatch(newMatch);
      
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

  const loadMatch = useCallback(async (matchId: string, accessCode?: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const allMatches = JSON.parse(localStorage.getItem('cricketora_matches') || '{}');
      const loadedMatch = allMatches[matchId];
      
      if (!loadedMatch) {
        throw new Error('Match not found');
      }
      
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
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setMatch(updatedMatch);
      
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

  const saveMatchEvent = useCallback(async (event: BallEvent): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!match) {
        throw new Error('No match loaded');
      }
      
      const updatedMatch = JSON.parse(JSON.stringify(match)) as Match;
      
      const currentInningsIndex = updatedMatch.currentInnings;
      if (currentInningsIndex >= updatedMatch.innings.length) {
        throw new Error('Invalid innings index');
      }
      
      const innings = updatedMatch.innings[currentInningsIndex];
      
      if (!innings.overs[innings.currentOver]) {
        innings.overs[innings.currentOver] = {
          number: innings.currentOver,
          bowlerId: event.bowlerId,
          balls: [],
          isMaiden: true
        };
      }
      
      const currentOver = innings.overs[innings.currentOver];
      currentOver.balls.push(event);
      
      if (event.runs > 0 || event.isWide || event.isNoBall) {
        currentOver.isMaiden = false;
      }
      
      const runsFromBall = event.runs;
      const extrasRuns = (event.isWide || event.isNoBall) ? 1 : 0;
      innings.totalRuns += runsFromBall + extrasRuns;
      
      if (event.isWide) innings.extras.wides += 1 + runsFromBall;
      if (event.isNoBall) innings.extras.noBalls += 1;
      if (event.isBye) innings.extras.byes += runsFromBall;
      if (event.isLegBye) innings.extras.legByes += runsFromBall;
      
      if (event.isWicket) {
        innings.wickets += 1;
        
        if (event.dismissedPlayerId && innings.batsmanStats[event.dismissedPlayerId]) {
          innings.batsmanStats[event.dismissedPlayerId].isOut = true;
          innings.batsmanStats[event.dismissedPlayerId].dismissalType = event.dismissalType;
          
          if (event.dismissalType && 
              ['bowled', 'caught', 'lbw', 'stumped'].includes(event.dismissalType)) {
            innings.batsmanStats[event.dismissedPlayerId].dismissedBy = event.bowlerId;
            
            if (innings.bowlerStats[event.bowlerId]) {
              innings.bowlerStats[event.bowlerId].wickets += 1;
            }
          }
          
          if (event.fielderIds && event.fielderIds.length > 0) {
            innings.batsmanStats[event.dismissedPlayerId].assistedBy = event.fielderIds[0];
          }
        }
      }
      
      if (!event.isWide && event.batsmanId && innings.batsmanStats[event.batsmanId]) {
        const batsmanStats = innings.batsmanStats[event.batsmanId];
        
        batsmanStats.balls += 1;
        
        if (!event.isBye && !event.isLegBye) {
          batsmanStats.runs += event.runs;
          
          if (event.runs === 4) batsmanStats.fours += 1;
          if (event.runs === 6) batsmanStats.sixes += 1;
        }
      }
      
      if (event.bowlerId && innings.bowlerStats[event.bowlerId]) {
        const bowlerStats = innings.bowlerStats[event.bowlerId];
        
        if (!event.isWide && !event.isNoBall) {
          bowlerStats.balls += 1;
        }
        
        bowlerStats.runs += event.runs + (event.isWide || event.isNoBall ? 1 : 0);
        
        if (innings.currentBall === 5 && currentOver.isMaiden) {
          bowlerStats.maidens += 1;
        }
        
        bowlerStats.overs = Math.floor(bowlerStats.balls / 6) + (bowlerStats.balls % 6) / 10;
      }
      
      if (!event.isWide && !event.isNoBall) {
        innings.currentBall += 1;
        
        if (innings.currentBall >= 6) {
          innings.currentBall = 0;
          innings.currentOver += 1;
          
          if (innings.currentOver >= updatedMatch.totalOvers) {
            innings.isCompleted = true;
            
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
              updatedMatch.matchStatus = 'completed';
            }
          }
        }
      }
      
      updatedMatch.updatedAt = Date.now();
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setMatch(updatedMatch);
      
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

export const useMatch = () => {
  const context = useContext(MatchContext);
  if (context === undefined) {
    throw new Error('useMatch must be used within a MatchProvider');
  }
  return context;
};
