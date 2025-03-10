
// Match Types
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
  id: string;
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
  accessCode?: string;
}

// Authentication types
export interface CreateMatchRequest {
  scorerEmail: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  matchId: string;
}

export interface ResumeMatchRequest {
  matchId: string;
  accessCode?: string;
}

// Event types for Socket.io
export interface ScoreUpdateEvent {
  matchId: string;
  innings: number;
  totalRuns: number;
  wickets: number;
  overs: string;
  currentBatsmen: {
    striker: string;
    nonStriker: string;
  };
  currentBowler: string;
  lastBall?: BallEvent;
}
