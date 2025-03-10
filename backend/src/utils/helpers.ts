
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique match ID (6 characters alphanumeric, uppercase)
 */
export const generateMatchId = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar looking characters
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generate a 6-digit OTP for email verification
 */
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate a random access code for match
 */
export const generateAccessCode = (): string => {
  return Math.random().toString(36).substring(2, 10);
};

/**
 * Generate a unique ID for entities
 */
export const generateUuid = (): string => {
  return uuidv4();
};

/**
 * Calculate the number of overs from completed overs and balls
 */
export const calculateOversString = (overs: number, balls: number): string => {
  return `${overs}${balls > 0 ? '.' + balls : ''}`;
};

/**
 * Calculate run rate (runs per over)
 */
export const calculateRunRate = (runs: number, overs: number, balls: number): number => {
  const totalOvers = overs + (balls / 6);
  return totalOvers > 0 ? runs / totalOvers : 0;
};

/**
 * Check if an over is a maiden (no runs scored from the bat)
 */
export const isMaidenOver = (balls: any[]): boolean => {
  if (balls.length !== 6) return false;
  
  return balls.every(ball => {
    // A maiden means no runs from the bat (extras don't count)
    const runsFromBat = ball.isWide || ball.isNoBall || ball.isBye || ball.isLegBye ? 0 : ball.runs;
    return runsFromBat === 0;
  });
};
