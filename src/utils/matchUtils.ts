
import { BallEvent, Innings, Over } from '@/context/MatchContext';

export const getAllBallsFromInnings = (innings: Innings): BallEvent[] => {
  if (!innings || !innings.overs || innings.overs.length === 0) {
    return [];
  }
  
  // Flatten the array of balls from all overs
  return innings.overs.flatMap((over) => over.balls || [])
    // Sort by over and ball number
    .sort((a, b) => {
      if (a.overNumber !== b.overNumber) {
        return a.overNumber - b.overNumber;
      }
      return a.ballNumber - b.ballNumber;
    });
};

export const getBallEventsFromCurrentOver = (innings: Innings): BallEvent[] => {
  if (!innings || !innings.overs || innings.currentOver >= innings.overs.length) {
    return [];
  }
  
  const currentOver = innings.overs[innings.currentOver];
  return currentOver?.balls || [];
};

export const formatRunsForDisplay = (ball: BallEvent): string => {
  if (ball.isWide) return 'W';
  if (ball.isNoBall) return 'N';
  if (ball.isWicket) return 'O';
  return ball.runs.toString();
};

export const getDetailedBallDescription = (ball: BallEvent): string[] => {
  const events: string[] = [];
  
  if (ball.isWide) events.push('Wide');
  if (ball.isNoBall) events.push('No Ball');
  
  if (ball.runs > 0) {
    if (ball.isBye) events.push(`${ball.runs} Bye${ball.runs > 1 ? 's' : ''}`);
    else if (ball.isLegBye) events.push(`${ball.runs} Leg Bye${ball.runs > 1 ? 's' : ''}`);
    else events.push(`${ball.runs} Run${ball.runs > 1 ? 's' : ''}`);
    
    if (ball.runs === 4 && !ball.isBye && !ball.isLegBye) events.push('Boundary');
    if (ball.runs === 6 && !ball.isBye && !ball.isLegBye) events.push('Six');
  }
  
  if (ball.isWicket) events.push(ball.dismissalType || 'Wicket');
  
  return events;
};

export const getColorForBall = (ball: BallEvent): string => {
  if (ball.isWicket) return 'bg-red-500';
  if (ball.isWide || ball.isNoBall) return 'bg-amber-500';
  if (ball.runs === 4) return 'bg-green-500';
  if (ball.runs === 6) return 'bg-blue-500';
  if (ball.runs > 0) return 'bg-green-400';
  return 'bg-gray-300';
};
