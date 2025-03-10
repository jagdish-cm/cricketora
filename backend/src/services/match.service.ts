
import { db } from '../config/firebase';
import { 
  Match, 
  BallEvent, 
  ScoreUpdateEvent,
  Innings,
  Over
} from '../types';
import { 
  generateMatchId, 
  generateAccessCode, 
  generateUuid,
  isMaidenOver
} from '../utils/helpers';

// Collection references
const matchesCollection = db.collection('matches');
const otpCollection = db.collection('otps');

/**
 * Create a new match with the scorer's email
 */
export const createMatch = async (scorerEmail: string): Promise<{ matchId: string, accessCode: string }> => {
  try {
    const matchId = generateMatchId();
    const accessCode = generateAccessCode();
    
    // Create a team template
    const createTeamTemplate = (id: string, name: string) => ({
      id,
      name,
      players: Array(11).fill(null).map((_, index) => ({
        id: `${id}_player_${index + 1}`,
        name: `Player ${index + 1}`,
        team: id === 'team1' ? 'team1' : 'team2'
      }))
    });
    
    // Create new match object
    const match: Match = {
      id: matchId,
      team1: createTeamTemplate('team1', 'Team 1'),
      team2: createTeamTemplate('team2', 'Team 2'),
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
      scorerEmail,
      accessCode
    };
    
    // Save match to Firestore
    await matchesCollection.doc(matchId).set(match);
    
    return { matchId, accessCode };
  } catch (error) {
    console.error('Error creating match:', error);
    throw new Error('Failed to create match');
  }
};

/**
 * Get a match by ID
 */
export const getMatch = async (matchId: string): Promise<Match | null> => {
  try {
    const matchDoc = await matchesCollection.doc(matchId).get();
    
    if (!matchDoc.exists) {
      return null;
    }
    
    return matchDoc.data() as Match;
  } catch (error) {
    console.error('Error getting match:', error);
    throw new Error('Failed to get match');
  }
};

/**
 * Update match details
 */
export const updateMatch = async (matchId: string, matchData: Partial<Match>): Promise<Match> => {
  try {
    const match = await getMatch(matchId);
    
    if (!match) {
      throw new Error('Match not found');
    }
    
    const updatedMatch = {
      ...match,
      ...matchData,
      updatedAt: Date.now()
    };
    
    await matchesCollection.doc(matchId).update(updatedMatch);
    
    return updatedMatch;
  } catch (error) {
    console.error('Error updating match:', error);
    throw new Error('Failed to update match');
  }
};

/**
 * Validate match access
 */
export const validateMatchAccess = async (
  matchId: string, 
  accessCode?: string
): Promise<boolean> => {
  try {
    const match = await getMatch(matchId);
    
    if (!match) {
      return false;
    }
    
    // If access code is provided, validate it
    if (accessCode && match.accessCode !== accessCode) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating match access:', error);
    return false;
  }
};

/**
 * Store a ball event and update match statistics
 */
export const recordBallEvent = async (
  matchId: string, 
  ballEventData: Omit<BallEvent, 'id' | 'timestamp'>
): Promise<{ ballEvent: BallEvent, scoreUpdate: ScoreUpdateEvent }> => {
  const matchRef = matchesCollection.doc(matchId);
  
  // Use a Firestore transaction to ensure data consistency
  return db.runTransaction(async (transaction) => {
    const matchDoc = await transaction.get(matchRef);
    
    if (!matchDoc.exists) {
      throw new Error('Match not found');
    }
    
    const match = matchDoc.data() as Match;
    
    if (match.matchStatus !== 'in_progress') {
      throw new Error('Match is not in progress');
    }
    
    const currentInningsIndex = match.currentInnings;
    if (currentInningsIndex >= match.innings.length) {
      throw new Error('No active innings');
    }
    
    const innings = { ...match.innings[currentInningsIndex] };
    
    // Create the ball event with unique ID
    const ballEvent: BallEvent = {
      ...ballEventData,
      id: generateUuid(),
      timestamp: Date.now()
    };
    
    // Update innings statistics
    updateInningsStats(innings, ballEvent);
    
    // Update match with new innings data
    match.innings[currentInningsIndex] = innings;
    match.updatedAt = Date.now();
    
    // Save updated match
    transaction.update(matchRef, { innings: match.innings, updatedAt: match.updatedAt });
    
    // Prepare score update event for real-time notification
    const scoreUpdate: ScoreUpdateEvent = {
      matchId,
      innings: currentInningsIndex,
      totalRuns: innings.totalRuns,
      wickets: innings.wickets,
      overs: `${innings.currentOver}.${innings.currentBall}`,
      currentBatsmen: {
        striker: innings.onStrike,
        nonStriker: innings.currentBatsmen.find(id => id !== innings.onStrike) || '',
      },
      currentBowler: innings.currentBowler,
      lastBall: ballEvent
    };
    
    return { ballEvent, scoreUpdate };
  });
};

/**
 * Helper function to update innings statistics based on a ball event
 */
function updateInningsStats(innings: Innings, ballEvent: BallEvent): void {
  // Handle runs and extras
  let runsFromBall = ballEvent.runs;
  
  if (ballEvent.isWide) {
    runsFromBall += 1; // Wide adds 1 run plus any runs taken
    innings.extras.wides += 1;
  } else if (ballEvent.isNoBall) {
    runsFromBall += 1; // No ball adds 1 run plus any runs taken
    innings.extras.noBalls += 1;
  } else if (ballEvent.isBye) {
    innings.extras.byes += ballEvent.runs;
    runsFromBall = ballEvent.runs; // All runs are byes
  } else if (ballEvent.isLegBye) {
    innings.extras.legByes += ballEvent.runs;
    runsFromBall = ballEvent.runs; // All runs are leg byes
  }
  
  // Update total runs
  innings.totalRuns += runsFromBall;
  
  // Process wicket if applicable
  if (ballEvent.isWicket) {
    innings.wickets += 1;
    
    // Update batsman stats
    if (ballEvent.dismissedPlayerId && innings.batsmanStats[ballEvent.dismissedPlayerId]) {
      innings.batsmanStats[ballEvent.dismissedPlayerId].isOut = true;
      innings.batsmanStats[ballEvent.dismissedPlayerId].dismissalType = ballEvent.dismissalType;
      // Handle fields for who dismissed the batsman if needed
    }
    
    // We would need additional logic here to handle new batsman coming in
  }
  
  // Update batsman stats
  if (!ballEvent.isWide) { // Wides don't count as a ball faced by batsman
    const batsmanId = ballEvent.batsmanId;
    
    if (!innings.batsmanStats[batsmanId]) {
      innings.batsmanStats[batsmanId] = {
        playerId: batsmanId,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isOut: false
      };
    }
    
    const batsmanStats = innings.batsmanStats[batsmanId];
    batsmanStats.balls += 1;
    
    // Only add runs that aren't extras
    if (!ballEvent.isBye && !ballEvent.isLegBye) {
      batsmanStats.runs += ballEvent.runs;
      
      if (ballEvent.runs === 4) {
        batsmanStats.fours += 1;
      } else if (ballEvent.runs === 6) {
        batsmanStats.sixes += 1;
      }
    }
  }
  
  // Update bowler stats
  const bowlerId = ballEvent.bowlerId;
  
  if (!innings.bowlerStats[bowlerId]) {
    innings.bowlerStats[bowlerId] = {
      playerId: bowlerId,
      overs: 0,
      balls: 0,
      maidens: 0,
      runs: 0,
      wickets: 0
    };
  }
  
  const bowlerStats = innings.bowlerStats[bowlerId];
  
  // Handle legal delivery
  if (!ballEvent.isWide && !ballEvent.isNoBall) {
    bowlerStats.balls += 1;
    
    // Update overs bowled
    if (bowlerStats.balls >= 6) {
      bowlerStats.overs += Math.floor(bowlerStats.balls / 6);
      bowlerStats.balls = bowlerStats.balls % 6;
      
      // Check if the over was a maiden
      const currentOver = getCurrentOver(innings);
      if (currentOver && isMaidenOver(currentOver.balls)) {
        bowlerStats.maidens += 1;
      }
    }
  }
  
  // Add runs conceded (except byes and leg byes)
  if (!ballEvent.isBye && !ballEvent.isLegBye) {
    bowlerStats.runs += runsFromBall;
  }
  
  // Add wicket to bowler's stats if applicable
  if (ballEvent.isWicket && 
      ballEvent.dismissalType !== 'run_out' && 
      ballEvent.dismissalType !== 'stumped') {
    bowlerStats.wickets += 1;
  }
  
  // Update ball and over count for the innings
  if (!ballEvent.isWide && !ballEvent.isNoBall) {
    innings.currentBall += 1;
    
    // Check if over is complete
    if (innings.currentBall >= 6) {
      innings.currentOver += 1;
      innings.currentBall = 0;
      
      // Close the current over
      completeOver(innings);
      
      // Switch strike for next over
      switchStrike(innings);
    }
  }
  
  // Add ball to the current over
  addBallToOver(innings, ballEvent);
  
  // Update striker position based on runs (unless wicket ends the innings)
  if (!ballEvent.isWicket || innings.wickets < 10) {
    if (ballEvent.runs % 2 === 1) {
      switchStrike(innings);
    }
  }
}

/**
 * Get the current over in the innings
 */
function getCurrentOver(innings: Innings): Over | null {
  return innings.overs.find(o => o.number === innings.currentOver) || null;
}

/**
 * Add a ball to the current over
 */
function addBallToOver(innings: Innings, ballEvent: BallEvent): void {
  let currentOver = getCurrentOver(innings);
  
  // If over doesn't exist, create it
  if (!currentOver) {
    currentOver = {
      number: innings.currentOver,
      bowlerId: ballEvent.bowlerId,
      balls: [],
      isMaiden: false
    };
    innings.overs.push(currentOver);
  }
  
  // Add the ball to the over
  currentOver.balls.push(ballEvent);
}

/**
 * Complete the current over
 */
function completeOver(innings: Innings): void {
  const currentOver = getCurrentOver(innings);
  
  if (currentOver) {
    // Check if it's a maiden over
    currentOver.isMaiden = isMaidenOver(currentOver.balls);
  }
}

/**
 * Switch the strike between batsmen
 */
function switchStrike(innings: Innings): void {
  // Find the non-striker
  const nonStriker = innings.currentBatsmen.find(id => id !== innings.onStrike);
  
  // If we have both batsmen, switch strike
  if (nonStriker) {
    innings.onStrike = nonStriker;
  }
}

/**
 * Store an OTP for email verification
 */
export const storeOtp = async (email: string, matchId: string, otp: string): Promise<void> => {
  try {
    await otpCollection.doc(`${email}_${matchId}`).set({
      email,
      matchId,
      otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes expiry
    });
  } catch (error) {
    console.error('Error storing OTP:', error);
    throw new Error('Failed to store OTP');
  }
};

/**
 * Verify an OTP
 */
export const verifyOtp = async (email: string, matchId: string, otp: string): Promise<boolean> => {
  try {
    const otpDoc = await otpCollection.doc(`${email}_${matchId}`).get();
    
    if (!otpDoc.exists) {
      return false;
    }
    
    const otpData = otpDoc.data();
    
    if (!otpData) {
      return false;
    }
    
    // Check if OTP is expired
    if (otpData.expiresAt < Date.now()) {
      return false;
    }
    
    // Check if OTP matches
    return otpData.otp === otp;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return false;
  }
};
