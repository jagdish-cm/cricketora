import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMatch, Innings, Team, Player, BatsmanStats, BowlerStats } from '@/context/MatchContext';
import { 
  PageTransition, 
  SectionTitle, 
  Button,
} from '@/components/ui-components';
import { getAllBallsFromInnings, getBallEventsFromCurrentOver } from '@/utils/matchUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, BookOpen, List, PlayCircle, Share2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useIsMobile } from '@/hooks/use-mobile';

const ViewMatch = () => {
  const navigate = useNavigate();
  const { matchId } = useParams();
  const { match, loadMatch, isLoading } = useMatch();
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [selectedTab, setSelectedTab] = useState('summary');
  const isMobile = useIsMobile();

  useEffect(() => {
    if (matchId && !initialLoadDone) {
      loadMatch(matchId)
        .then(() => setInitialLoadDone(true))
        .catch(err => console.error("Error loading match:", err));
    } else if (!match && !matchId) {
      navigate('/watch-live');
    }
  }, [matchId, navigate, loadMatch, match, initialLoadDone]);

  useEffect(() => {
    let interval: number | undefined;
    
    if (initialLoadDone && isAutoRefresh && match?.matchStatus === 'in_progress') {
      interval = window.setInterval(() => {
        if (matchId) {
          loadMatch(matchId).catch(err => {
            console.error("Error refreshing match data:", err);
            if (interval) {
              clearInterval(interval);
              setIsAutoRefresh(false);
            }
          });
        }
      }, 15000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAutoRefresh, match?.matchStatus, matchId, loadMatch, initialLoadDone]);

  if (isLoading && !initialLoadDone) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-green-200 flex items-center justify-center">
            <PlayCircle className="w-12 h-12 text-green-500" />
          </div>
          <p className="mt-4 text-green-700">Loading match data...</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Match not found</h2>
        <p className="mt-2 text-gray-600">The match you are looking for doesn't exist or has ended.</p>
        <Button 
          onClick={() => navigate('/watch-live')} 
          className="mt-4"
        >
          Go Back
        </Button>
      </div>
    );
  }

  const currentInnings = match.innings[match.currentInnings];
  const battingTeam = currentInnings?.battingTeamId === match.team1.id ? match.team1 : match.team2;
  const bowlingTeam = currentInnings?.bowlingTeamId === match.team1.id ? match.team1 : match.team2;

  const getCurrentOversText = () => {
    if (!currentInnings) return "0.0";
    const completedOvers = currentInnings.currentOver;
    const ballsInCurrentOver = currentInnings.currentBall;
    return `${completedOvers}.${ballsInCurrentOver}`;
  };

  const getTargetText = () => {
    if (match.currentInnings === 0 || !match.innings[0]) {
      return null;
    }
    
    const firstInningsRuns = match.innings[0].totalRuns;
    return `Target: ${firstInningsRuns + 1}`;
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-2 sm:px-4 py-2 max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm border mb-3 overflow-hidden">
          <div className="bg-green-600 text-white p-3">
            <div className="flex justify-between items-baseline">
              <h1 className="font-bold text-sm sm:text-base">{match.team1.name} vs {match.team2.name}</h1>
              <span className="text-xs opacity-80">
                {match.matchStatus === 'in_progress' ? 'Live' : 
                  match.matchStatus === 'completed' ? 'Completed' : 'Not started'}
              </span>
            </div>
            <div className="text-xs sm:text-sm mt-1 opacity-90">
              {match.venue || 'Venue not specified'} • {match.totalOvers} overs match
            </div>
            
            {currentInnings && (
              <div className="mt-2 text-base sm:text-lg font-bold flex justify-between items-baseline flex-wrap">
                <div className="mr-2">
                  {battingTeam.name}: {currentInnings.totalRuns}/{currentInnings.wickets}
                  <span className="text-xs sm:text-sm font-normal ml-2">
                    ({getCurrentOversText()} ov)
                  </span>
                </div>
                {getTargetText() && (
                  <div className="text-xs sm:text-sm font-normal">{getTargetText()}</div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-end mb-2 gap-2">
          <span className="text-xs text-gray-500">Auto refresh</span>
          <Switch
            checked={isAutoRefresh}
            onCheckedChange={setIsAutoRefresh}
            size="sm"
          />
        </div>
        
        <Tabs defaultValue="summary" className="w-full" onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="summary" className="flex items-center gap-1 text-xs sm:text-sm">
              <PlayCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Summary</span>
            </TabsTrigger>
            <TabsTrigger value="scorecard" className="flex items-center gap-1 text-xs sm:text-sm">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Full Scorecard</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="mt-2">
            <SummaryView 
              match={match} 
              currentInnings={currentInnings} 
              battingTeam={battingTeam} 
              bowlingTeam={bowlingTeam} 
              isMobile={isMobile}
            />
          </TabsContent>
          
          <TabsContent value="scorecard" className="mt-2">
            <ScorecardView 
              match={match}
              isMobile={isMobile}  
              currentInnings={match.currentInnings}
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-4 mb-8 gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate('/watch-live')}
            className="text-xs sm:text-sm px-2 sm:px-4 flex items-center"
            size={isMobile ? "sm" : "default"}
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> 
            <span>Back</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `${match.team1.name} vs ${match.team2.name} - Live Cricket Score`,
                  text: `Follow the live cricket match between ${match.team1.name} and ${match.team2.name}`,
                  url: window.location.href
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }
            }}
            className="text-xs sm:text-sm px-2 sm:px-4 flex items-center"
            size={isMobile ? "sm" : "default"}
          >
            <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> 
            <span>Share</span>
          </Button>
        </div>
      </div>
    </PageTransition>
  );
};

const SummaryView = ({ match, currentInnings, battingTeam, bowlingTeam, isMobile }: any) => {
  if (!currentInnings) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Match has not started yet.</p>
      </div>
    );
  }
  
  const strikerBatsman = battingTeam.players.find(
    (p: Player) => p.id === currentInnings.onStrike
  );
  
  const nonStrikerBatsman = battingTeam.players.find(
    (p: Player) => p.id === currentInnings.currentBatsmen.find(
      (id: string) => id !== currentInnings.onStrike
    )
  );
  
  const currentBowler = bowlingTeam.players.find(
    (p: Player) => p.id === currentInnings.currentBowler
  );
  
  const currentOverBalls = getBallEventsFromCurrentOver(currentInnings);
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="py-2 px-3 sm:py-3 sm:px-4">
          <CardTitle className="text-sm sm:text-base flex justify-between items-center">
            <span>This Over</span>
            <span className="text-xs sm:text-sm font-normal">
              {currentOverBalls.reduce((total: number, ball: any) => 
                total + ball.runs + (ball.isWide || ball.isNoBall ? 1 : 0), 0
              )} runs
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="py-2 px-3 sm:px-4">
          <div className="flex space-x-2 pb-1 overflow-x-auto scrollbar-none">
            {currentOverBalls.length > 0 ? (
              currentOverBalls.map((ball: any, index: number) => {
                let displayText = ball.runs.toString();
                if (ball.isWide) displayText = 'WD';
                if (ball.isNoBall) displayText = 'NB';
                if (ball.isWicket) displayText = 'W';
                
                let bgColor = 'bg-gray-200';
                if (ball.isWicket) bgColor = 'bg-red-500';
                else if (ball.isWide || ball.isNoBall) bgColor = 'bg-amber-400';
                else if (ball.runs === 4) bgColor = 'bg-green-500';
                else if (ball.runs === 6) bgColor = 'bg-blue-500';
                else if (ball.runs > 0) bgColor = 'bg-green-300';
                
                return (
                  <div 
                    key={index}
                    className={`${bgColor} text-white w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 flex items-center justify-center rounded-full text-xs sm:text-sm font-medium`}
                  >
                    {displayText}
                  </div>
                );
              })
            ) : (
              <div className="text-gray-400 py-2 text-xs sm:text-sm">No balls bowled yet in this over</div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-2 px-3 sm:py-3 sm:px-4">
          <CardTitle className="text-sm sm:text-base">Batsmen</CardTitle>
        </CardHeader>
        <CardContent className="py-0 px-0">
          <div className="overflow-x-auto -mx-1">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm whitespace-nowrap">Batsman</TableHead>
                  <TableHead className="text-right w-8 sm:w-12 text-xs sm:text-sm">R</TableHead>
                  <TableHead className="text-right w-8 sm:w-12 text-xs sm:text-sm">B</TableHead>
                  <TableHead className="text-right w-8 sm:w-12 text-xs sm:text-sm">4s</TableHead>
                  <TableHead className="text-right w-8 sm:w-12 text-xs sm:text-sm">6s</TableHead>
                  <TableHead className="text-right w-8 sm:w-12 text-xs sm:text-sm">SR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {strikerBatsman && (
                  <TableRow className="bg-green-50">
                    <TableCell className="font-medium flex items-center text-xs sm:text-sm py-2 whitespace-nowrap">
                      <span className="truncate max-w-[110px] sm:max-w-none">{strikerBatsman.name}</span>
                      <span className="ml-1 text-xs">*</span>
                    </TableCell>
                    <TableCell className="text-right text-xs sm:text-sm py-2">{currentInnings.batsmanStats[strikerBatsman.id]?.runs || 0}</TableCell>
                    <TableCell className="text-right text-xs sm:text-sm py-2">{currentInnings.batsmanStats[strikerBatsman.id]?.balls || 0}</TableCell>
                    <TableCell className="text-right text-xs sm:text-sm py-2">{currentInnings.batsmanStats[strikerBatsman.id]?.fours || 0}</TableCell>
                    <TableCell className="text-right text-xs sm:text-sm py-2">{currentInnings.batsmanStats[strikerBatsman.id]?.sixes || 0}</TableCell>
                    <TableCell className="text-right text-xs sm:text-sm py-2">
                      {currentInnings.batsmanStats[strikerBatsman.id]?.balls ? 
                        ((currentInnings.batsmanStats[strikerBatsman.id]?.runs / 
                          currentInnings.batsmanStats[strikerBatsman.id]?.balls) * 100).toFixed(1) : 
                        '0.0'}
                    </TableCell>
                  </TableRow>
                )}
                
                {nonStrikerBatsman && (
                  <TableRow>
                    <TableCell className="font-medium text-xs sm:text-sm py-2 whitespace-nowrap">
                      <span className="truncate max-w-[110px] sm:max-w-none block">{nonStrikerBatsman.name}</span>
                    </TableCell>
                    <TableCell className="text-right text-xs sm:text-sm py-2">{currentInnings.batsmanStats[nonStrikerBatsman.id]?.runs || 0}</TableCell>
                    <TableCell className="text-right text-xs sm:text-sm py-2">{currentInnings.batsmanStats[nonStrikerBatsman.id]?.balls || 0}</TableCell>
                    <TableCell className="text-right text-xs sm:text-sm py-2">{currentInnings.batsmanStats[nonStrikerBatsman.id]?.fours || 0}</TableCell>
                    <TableCell className="text-right text-xs sm:text-sm py-2">{currentInnings.batsmanStats[nonStrikerBatsman.id]?.sixes || 0}</TableCell>
                    <TableCell className="text-right text-xs sm:text-sm py-2">
                      {currentInnings.batsmanStats[nonStrikerBatsman.id]?.balls ? 
                        ((currentInnings.batsmanStats[nonStrikerBatsman.id]?.runs / 
                          currentInnings.batsmanStats[nonStrikerBatsman.id]?.balls) * 100).toFixed(1) : 
                        '0.0'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-2 px-3 sm:py-3 sm:px-4">
          <CardTitle className="text-sm sm:text-base">Bowler</CardTitle>
        </CardHeader>
        <CardContent className="py-0 px-0">
          <div className="overflow-x-auto -mx-1">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm whitespace-nowrap">Bowler</TableHead>
                  <TableHead className="text-right w-8 sm:w-12 text-xs sm:text-sm">O</TableHead>
                  <TableHead className="text-right w-8 sm:w-12 text-xs sm:text-sm">M</TableHead>
                  <TableHead className="text-right w-8 sm:w-12 text-xs sm:text-sm">R</TableHead>
                  <TableHead className="text-right w-8 sm:w-12 text-xs sm:text-sm">W</TableHead>
                  <TableHead className="text-right w-8 sm:w-12 text-xs sm:text-sm">Econ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentBowler && (
                  <TableRow>
                    <TableCell className="font-medium text-xs sm:text-sm py-2 whitespace-nowrap">
                      <span className="truncate max-w-[110px] sm:max-w-none block">{currentBowler.name}</span>
                    </TableCell>
                    <TableCell className="text-right text-xs sm:text-sm py-2">{currentInnings.bowlerStats[currentBowler.id]?.overs.toFixed(1) || 0}</TableCell>
                    <TableCell className="text-right text-xs sm:text-sm py-2">{currentInnings.bowlerStats[currentBowler.id]?.maidens || 0}</TableCell>
                    <TableCell className="text-right text-xs sm:text-sm py-2">{currentInnings.bowlerStats[currentBowler.id]?.runs || 0}</TableCell>
                    <TableCell className="text-right text-xs sm:text-sm py-2">{currentInnings.bowlerStats[currentBowler.id]?.wickets || 0}</TableCell>
                    <TableCell className="text-right text-xs sm:text-sm py-2">
                      {currentInnings.bowlerStats[currentBowler.id]?.balls ? 
                        ((currentInnings.bowlerStats[currentBowler.id]?.runs / 
                          (currentInnings.bowlerStats[currentBowler.id]?.balls / 6)) * 6).toFixed(1) : 
                        '0.0'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ScorecardView = ({ match, isMobile, currentInnings }: any) => {
  const [selectedInnings, setSelectedInnings] = useState(currentInnings);
  
  if (match.innings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Match has not started yet.</p>
      </div>
    );
  }
  
  const innings = match.innings[selectedInnings];
  const battingTeam = innings.battingTeamId === match.team1.id ? match.team1 : match.team2;
  const bowlingTeam = innings.bowlingTeamId === match.team1.id ? match.team1 : match.team2;
  
  const getBatsmenWithStats = () => {
    return Object.entries(innings.batsmanStats)
      .map(([playerId, stats]: [string, any]) => {
        const player = battingTeam.players.find((p: Player) => p.id === playerId);
        const isOnStrike = playerId === innings.onStrike;
        return { 
          ...stats, 
          id: playerId,
          name: player ? player.name : 'Unknown Player',
          isOnStrike
        };
      })
      .sort((a, b) => {
        const aIsCurrent = innings.currentBatsmen.includes(a.id);
        const bIsCurrent = innings.currentBatsmen.includes(b.id);
        
        if (aIsCurrent && !bIsCurrent) return -1;
        if (!aIsCurrent && bIsCurrent) return 1;
        
        return a.id.localeCompare(b.id);
      });
  };
  
  const getBowlersWithStats = () => {
    return Object.entries(innings.bowlerStats)
      .map(([playerId, stats]: [string, any]) => {
        const player = bowlingTeam.players.find((p: Player) => p.id === playerId);
        const isCurrentBowler = playerId === innings.currentBowler;
        return { 
          ...stats, 
          id: playerId,
          name: player ? player.name : 'Unknown Player',
          isCurrentBowler
        };
      })
      .sort((a, b) => {
        if (b.wickets !== a.wickets) return b.wickets - a.wickets;
        
        const aEcon = a.balls ? (a.runs / (a.balls / 6)) : 999;
        const bEcon = b.balls ? (b.runs / (b.balls / 6)) : 999;
        return aEcon - bEcon;
      });
  };
  
  const batsmen = getBatsmenWithStats();
  const bowlers = getBowlersWithStats();
  
  const getDismissalText = (batsman: any) => {
    if (!batsman.isOut) return 'not out';
    
    switch (batsman.dismissalType) {
      case 'bowled':
        return `b ${getBowlerName(batsman.dismissedBy)}`;
      case 'caught':
        return `c ${getFielderName(batsman.assistedBy)} b ${getBowlerName(batsman.dismissedBy)}`;
      case 'lbw':
        return `lbw b ${getBowlerName(batsman.dismissedBy)}`;
      case 'run_out':
        return 'run out';
      case 'stumped':
        return `st ${getFielderName(batsman.assistedBy)} b ${getBowlerName(batsman.dismissedBy)}`;
      default:
        return batsman.dismissalType || 'dismissed';
    }
  };
  
  const getBowlerName = (id: string) => {
    const player = bowlingTeam.players.find((p: Player) => p.id === id);
    return player ? player.name : 'Unknown';
  };
  
  const getFielderName = (id: string) => {
    const player = bowlingTeam.players.find((p: Player) => p.id === id);
    return player ? player.name : 'Unknown';
  };
  
  return (
    <div className="space-y-4">
      {match.innings.length > 1 && (
        <div className="flex space-x-2 mb-4">
          {match.innings.map((inn: Innings, idx: number) => {
            const team = inn.battingTeamId === match.team1.id ? match.team1 : match.team2;
            return (
              <Button
                key={idx}
                variant={selectedInnings === idx ? "default" : "outline"}
                size={isMobile ? "sm" : "default"}
                onClick={() => setSelectedInnings(idx)}
                className="flex-1 text-xs sm:text-sm"
              >
                {team.name}
              </Button>
            );
          })}
        </div>
      )}
      
      <Card>
        <CardHeader className="py-2 px-3 sm:py-3 sm:px-4">
          <CardTitle className="text-sm sm:text-base flex justify-between items-center">
            <span className="truncate max-w-[150px] sm:max-w-none">
              {battingTeam.name} - {innings.totalRuns}/{innings.wickets}
            </span>
            <span className="text-xs sm:text-sm font-normal">
              {innings.currentOver}.{innings.currentBall} ov
            </span>
          </CardTitle>
        </CardHeader>
      </Card>
      
      <Card>
        <CardHeader className="py-2 px-3 sm:py-3 sm:px-4">
          <CardTitle className="text-sm sm:text-base">Batting</CardTitle>
        </CardHeader>
        <CardContent className="py-0 px-0">
          <div className="overflow-x-auto -mx-1">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm whitespace-nowrap">Batsman</TableHead>
                  <TableHead className="text-right w-8 sm:w-12 text-xs sm:text-sm">R</TableHead>
                  <TableHead className="text-right w-8 sm:w-12 text-xs sm:text-sm">B</TableHead>
                  <TableHead className="text-right w-8 sm:w-12 text-xs sm:text-sm">4s</TableHead>
                  <TableHead className="text-right w-8 sm:w-12 text-xs sm:text-sm">6s</TableHead>
                  <TableHead className="text-right w-8 sm:w-12 text-xs sm:text-sm">SR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batsmen.map((batsman) => (
                  <TableRow key={batsman.id} className={innings.currentBatsmen.includes(batsman.id) ? (batsman.isOnStrike ? "bg-green-50" : "bg-blue-50") : ""}>
                    <TableCell className="py-1 sm:py-2">
                      <div>
                        <div className="font-medium text-xs sm:text-sm truncate max-w-[110px] sm:max-w-none flex items-center">
                          {batsman.name}
                          {batsman.isOnStrike && <span className="ml-1 text-green-600">*</span>}
                          {innings.currentBatsmen.includes(batsman.id) && !batsman.isOnStrike && <span className="ml-1 text-blue-600">•</span>}
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-500 truncate max-w-[110px] sm:max-w-none">{getDismissalText(batsman)}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-xs sm:text-sm py-1 sm:py-2">{batsman.runs}</TableCell>
                    <TableCell className="text-right text-xs sm:text-sm py-1 sm:py-2">{batsman.balls}</TableCell>
                    <TableCell className="text-right text-xs sm:text-sm py-1 sm:py-2">{batsman.fours}</TableCell>
                    <TableCell className="text-right text-xs sm:text-sm py-1 sm:py-2">{batsman.sixes}</TableCell>
                    <TableCell className="text-right text-xs sm:text-sm py-1 sm:py-2">
                      {batsman.balls ? ((batsman.runs / batsman.balls) * 100).toFixed(1) : '0.0'}
                    </TableCell>
                  </TableRow>
                ))}
                
                <TableRow>
                  <TableCell colSpan={5} className="text-[10px] sm:text-xs py-1 sm:py-2">
                    <span className="font-medium">Extras</span>
                    <span className="ml-2 text-gray-600 text-[10px] sm:text-xs">
                      ({innings.extras.wides} w, {innings.extras.noBalls} nb, 
                       {innings.extras.byes} b, {innings.extras.legByes} lb)
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium text-xs sm:text-sm py-1 sm:py-2">
                    {innings.extras.wides + innings.extras.noBalls + 
                     innings.extras.byes + innings.extras.legByes}
                  </TableCell>
                </TableRow>
                
                <TableRow className="bg-gray-50 font-medium">
                  <TableCell colSpan={5} className="py-1 sm:py-2">
                    <span className="text-xs sm:text-sm">Total</span>
                    <span className="ml-2 text-gray-600 text-[10px] sm:text-xs">
                      ({innings.wickets} wkts, {innings.currentOver}.{innings.currentBall} ov)
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-xs sm:text-sm py-1 sm:py-2">{innings.totalRuns}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-2 px-3 sm:py-3 sm:px-4">
          <CardTitle className="text-sm sm:text-base">Bowling</CardTitle>
        </CardHeader>
        <CardContent className="py-0 px-0">
          <div className="overflow-x-auto -mx-1">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm whitespace-nowrap">Bowler</TableHead>
                  <TableHead className="text-right w-8 sm:w-12 text-xs sm:text-sm">O</TableHead>
                  <TableHead className="text-right w-8 sm:w-12 text-xs sm:text-sm">M</TableHead>
                  <TableHead className="text-right w-8 sm:w-12 text-xs sm:text-sm">R</TableHead>
                  <TableHead className="text-right w-8 sm:w-12 text-xs sm:text-sm">W</TableHead>
                  <TableHead className="text-right w-8 sm:w-12 text-xs sm:text-sm">Econ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bowlers.map((bowler) => (
                  <TableRow key={bowler.id} className={bowler.isCurrentBowler ? "bg-amber-50" : ""}>
                    <TableCell className="font-medium text-xs sm:text-sm py-1 sm:py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="truncate max-w-[110px] sm:max-w-none">{bowler.name}</span>
                        {bowler.isCurrentBowler && <span className="ml-1 text-amber-600">•</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-xs sm:text-sm py-1 sm:py-2">{bowler.overs.toFixed(1)}</TableCell>
                    <TableCell className="text-right text-xs sm:text-sm py-1 sm:py-2">{bowler.maidens}</TableCell>
                    <TableCell className="text-right text-xs sm:text-sm py-1 sm:py-2">{bowler.runs}</TableCell>
                    <TableCell className="text-right text-xs sm:text-sm py-1 sm:py-2">{bowler.wickets}</TableCell>
                    <TableCell className="text-right text-xs sm:text-sm py-1 sm:py-2">
                      {bowler.balls ? ((bowler.runs / (bowler.balls / 6)) * 6).toFixed(1) : '0.0'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewMatch;
