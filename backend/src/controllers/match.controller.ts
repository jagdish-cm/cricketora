
import { Request, Response, NextFunction } from 'express';
import { 
  getMatch, 
  updateMatch,
  recordBallEvent 
} from '../services/match.service';
import { Match, BallEvent } from '../types';

/**
 * Get match details
 * @route GET /api/matches/:id
 */
export const getMatchHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    
    // Get match
    const match = await getMatch(id);
    
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }
    
    // For security, remove access code from response
    const { accessCode, ...safeMatch } = match;
    
    res.status(200).json({
      success: true,
      data: safeMatch
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update match details
 * @route PATCH /api/matches/:id
 */
export const updateMatchHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const matchData: Partial<Match> = req.body;
    
    // Don't allow updating certain fields
    delete matchData.id;
    delete matchData.createdAt;
    delete matchData.scorerEmail;
    delete matchData.accessCode;
    
    // Update match
    const updatedMatch = await updateMatch(id, matchData);
    
    // For security, remove access code from response
    const { accessCode, ...safeMatch } = updatedMatch;
    
    res.status(200).json({
      success: true,
      data: safeMatch
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get live match data (public view)
 * @route GET /api/matches/:id/live
 */
export const getLiveMatchHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    
    // Get match
    const match = await getMatch(id);
    
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }
    
    // Prepare limited data for public view
    const liveData = {
      id: match.id,
      name: match.name,
      team1: {
        id: match.team1.id,
        name: match.team1.name,
        players: match.team1.players.map(p => ({ id: p.id, name: p.name }))
      },
      team2: {
        id: match.team2.id,
        name: match.team2.name,
        players: match.team2.players.map(p => ({ id: p.id, name: p.name }))
      },
      tossWonBy: match.tossWonBy,
      choseTo: match.choseTo,
      totalOvers: match.totalOvers,
      innings: match.innings.map(inn => ({
        battingTeamId: inn.battingTeamId,
        bowlingTeamId: inn.bowlingTeamId,
        currentOver: inn.currentOver,
        currentBall: inn.currentBall,
        totalRuns: inn.totalRuns,
        wickets: inn.wickets,
        extras: inn.extras,
        batsmanStats: inn.batsmanStats,
        bowlerStats: inn.bowlerStats,
        currentBatsmen: inn.currentBatsmen,
        onStrike: inn.onStrike,
        currentBowler: inn.currentBowler,
        isCompleted: inn.isCompleted
      })),
      currentInnings: match.currentInnings,
      matchStatus: match.matchStatus,
      createdAt: match.createdAt,
      updatedAt: match.updatedAt,
      venue: match.venue
    };
    
    res.status(200).json({
      success: true,
      data: liveData
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Record a ball event
 * @route POST /api/matches/:id/events
 */
export const recordBallEventHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const ballEventData: Omit<BallEvent, 'id' | 'timestamp'> = req.body;
    
    // Record ball event
    const { ballEvent, scoreUpdate } = await recordBallEvent(id, ballEventData);
    
    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io) {
      io.to(`match:${id}`).emit('score-update', scoreUpdate);
    }
    
    res.status(201).json({
      success: true,
      data: ballEvent
    });
  } catch (error) {
    next(error);
  }
};
