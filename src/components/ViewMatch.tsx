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

const ViewMatch = () => {
  const navigate = useNavigate();
  const { matchId } = useParams();
  const { match, loadMatch, isLoading } = useMatch();
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [selectedTab, setSelectedTab] = useState('summary');

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
      <div className="container mx-auto px-4 py-2 max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm border mb-3 overflow-hidden">
          <div className="bg-green-600 text-white p-3">
            <div className="flex justify-between items-baseline">
              <h1 className="font-bold">{match.team1.name} vs {match.team2.name}</h1>
              <span className="text-xs opacity-80">
                {match.matchStatus === 'in_progress' ? 'Live' : 
                  match.matchStatus === 'completed' ? 'Completed' : 'Not started'}
              </span>
            </div>
            <div className="text-sm mt-1 opacity-90">
              {match.venue || 'Venue not specified'} • {match.totalOvers} overs match
            </div>
            
            {currentInnings && (
              <div className="mt-2 text-lg font-bold flex justify-between items-baseline">
                <div>
                  {battingTeam.name}: {currentInnings.totalRuns}/{currentInnings.wickets}
                  <span className="text-sm font-normal ml-2">
                    ({getCurrentOversText()} ov)
                  </span>
                </div>
                {getTargetText() && (
                  <div className="text-sm font-normal">{getTargetText()}</div>
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
            <TabsTrigger value="summary" className="flex items-center gap-1">
              <PlayCircle className="h-4 w-4" />
              <span>Summary</span>
            </TabsTrigger>
            <TabsTrigger value="scorecard" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>Full Scorecard</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="mt-2">
            <SummaryView 
              match={match} 
              currentInnings={currentInnings} 
              battingTeam={battingTeam} 
              bowlingTeam={bowlingTeam} 
            />
          </TabsContent>
          
          <TabsContent value="scorecard" className="mt-2">
            <ScorecardView 
              match={match}  
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/watch-live')}
            className="text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
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
            className="text-sm"
          >
            <Share2 className="h-4 w-4 mr-1" /> Share
          </Button>
        </div>
      </div>
    </PageTransition>
  );
};

const SummaryView = ({ match, currentInnings, battingTeam, bowlingTeam }: any) => {
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
        <CardHeader className="py-3">
          <CardTitle className="text-base flex justify-between items-center">
            <span>This Over</span>
            <span className="text-sm font-normal">
              {currentOverBalls.reduce((total: number, ball: any) => 
                total + ball.runs + (ball.isWide || ball.isNoBall ? 1 : 0), 0
              )} runs
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="py-2">
          <div className="flex space-x-2 pb-1 overflow-x-auto">
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
                    className={`${bgColor} text-white w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium`}
                  >
                    {displayText}
                  </div>
                );
              })
            ) : (
              <div className="text-gray-400 py-2 text-sm">No balls bowled yet in this over</div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-base">Batsmen</CardTitle>
        </CardHeader>
        <CardContent className="py-0 px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batsman</TableHead>
                <TableHead className="text-right w-12">R</TableHead>
                <TableHead className="text-right w-12">B</TableHead>
                <TableHead className="text-right w-12">4s</TableHead>
                <TableHead className="text-right w-12">6s</TableHead>
                <TableHead className="text-right w-12">SR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {strikerBatsman && (
                <TableRow className="bg-green-50">
                  <TableCell className="font-medium flex items-center">
                    {strikerBatsman.name}
                    <span className="ml-1 text-xs">*</span>
                  </TableCell>
                  <TableCell className="text-right">{currentInnings.batsmanStats[strikerBatsman.id]?.runs || 0}</TableCell>
                  <TableCell className="text-right">{currentInnings.batsmanStats[strikerBatsman.id]?.balls || 0}</TableCell>
                  <TableCell className="text-right">{currentInnings.batsmanStats[strikerBatsman.id]?.fours || 0}</TableCell>
                  <TableCell className="text-right">{currentInnings.batsmanStats[strikerBatsman.id]?.sixes || 0}</TableCell>
                  <TableCell className="text-right">
                    {currentInnings.batsmanStats[strikerBatsman.id]?.balls ? 
                      ((currentInnings.batsmanStats[strikerBatsman.id]?.runs / 
                        currentInnings.batsmanStats[strikerBatsman.id]?.balls) * 100).toFixed(1) : 
                      '0.0'}
                  </TableCell>
                </TableRow>
              )}
              
              {nonStrikerBatsman && (
                <TableRow>
                  <TableCell className="font-medium">{nonStrikerBatsman.name}</TableCell>
                  <TableCell className="text-right">{currentInnings.batsmanStats[nonStrikerBatsman.id]?.runs || 0}</TableCell>
                  <TableCell className="text-right">{currentInnings.batsmanStats[nonStrikerBatsman.id]?.balls || 0}</TableCell>
                  <TableCell className="text-right">{currentInnings.batsmanStats[nonStrikerBatsman.id]?.fours || 0}</TableCell>
                  <TableCell className="text-right">{currentInnings.batsmanStats[nonStrikerBatsman.id]?.sixes || 0}</TableCell>
                  <TableCell className="text-right">
                    {currentInnings.batsmanStats[nonStrikerBatsman.id]?.balls ? 
                      ((currentInnings.batsmanStats[nonStrikerBatsman.id]?.runs / 
                        currentInnings.batsmanStats[nonStrikerBatsman.id]?.balls) * 100).toFixed(1) : 
                      '0.0'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-base">Bowler</CardTitle>
        </CardHeader>
        <CardContent className="py-0 px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bowler</TableHead>
                <TableHead className="text-right w-12">O</TableHead>
                <TableHead className="text-right w-12">M</TableHead>
                <TableHead className="text-right w-12">R</TableHead>
                <TableHead className="text-right w-12">W</TableHead>
                <TableHead className="text-right w-12">Econ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentBowler && (
                <TableRow>
                  <TableCell className="font-medium">{currentBowler.name}</TableCell>
                  <TableCell className="text-right">{currentInnings.bowlerStats[currentBowler.id]?.overs.toFixed(1) || 0}</TableCell>
                  <TableCell className="text-right">{currentInnings.bowlerStats[currentBowler.id]?.maidens || 0}</TableCell>
                  <TableCell className="text-right">{currentInnings.bowlerStats[currentBowler.id]?.runs || 0}</TableCell>
                  <TableCell className="text-right">{currentInnings.bowlerStats[currentBowler.id]?.wickets || 0}</TableCell>
                  <TableCell className="text-right">
                    {currentInnings.bowlerStats[currentBowler.id]?.balls ? 
                      ((currentInnings.bowlerStats[currentBowler.id]?.runs / 
                        (currentInnings.bowlerStats[currentBowler.id]?.balls / 6)) * 6).toFixed(1) : 
                      '0.0'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const ScorecardView = ({ match }: any) => {
  const [selectedInnings, setSelectedInnings] = useState(match.currentInnings);
  
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
        return { 
          ...stats, 
          id: playerId,
          name: player ? player.name : 'Unknown Player'
        };
      })
      .sort((a, b) => {
        return a.id.localeCompare(b.id);
      });
  };
  
  const getBowlersWithStats = () => {
    return Object.entries(innings.bowlerStats)
      .map(([playerId, stats]: [string, any]) => {
        const player = bowlingTeam.players.find((p: Player) => p.id === playerId);
        return { 
          ...stats, 
          id: playerId,
          name: player ? player.name : 'Unknown Player'
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
                size="sm"
                onClick={() => setSelectedInnings(idx)}
                className="flex-1"
              >
                {team.name}
              </Button>
            );
          })}
        </div>
      )}
      
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-base flex justify-between items-center">
            <span>
              {battingTeam.name} - {innings.totalRuns}/{innings.wickets}
            </span>
            <span className="text-sm font-normal">
              {innings.currentOver}.{innings.currentBall} ov
            </span>
          </CardTitle>
        </CardHeader>
      </Card>
      
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-base">Batting</CardTitle>
        </CardHeader>
        <CardContent className="py-0 px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batsman</TableHead>
                <TableHead className="text-right w-12">R</TableHead>
                <TableHead className="text-right w-12">B</TableHead>
                <TableHead className="text-right w-12">4s</TableHead>
                <TableHead className="text-right w-12">6s</TableHead>
                <TableHead className="text-right w-12">SR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batsmen.map((batsman) => (
                <TableRow key={batsman.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{batsman.name}</div>
                      <div className="text-xs text-gray-500">{getDismissalText(batsman)}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{batsman.runs}</TableCell>
                  <TableCell className="text-right">{batsman.balls}</TableCell>
                  <TableCell className="text-right">{batsman.fours}</TableCell>
                  <TableCell className="text-right">{batsman.sixes}</TableCell>
                  <TableCell className="text-right">
                    {batsman.balls ? ((batsman.runs / batsman.balls) * 100).toFixed(1) : '0.0'}
                  </TableCell>
                </TableRow>
              ))}
              
              <TableRow>
                <TableCell colSpan={5} className="text-sm">
                  <span className="font-medium">Extras</span>
                  <span className="ml-2 text-gray-600">
                    ({innings.extras.wides} w, {innings.extras.noBalls} nb, 
                     {innings.extras.byes} b, {innings.extras.legByes} lb)
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {innings.extras.wides + innings.extras.noBalls + 
                   innings.extras.byes + innings.extras.legByes}
                </TableCell>
              </TableRow>
              
              <TableRow className="bg-gray-50 font-medium">
                <TableCell colSpan={5}>
                  <span>Total</span>
                  <span className="ml-2 text-gray-600">
                    ({innings.wickets} wkts, {innings.currentOver}.{innings.currentBall} ov)
                  </span>
                </TableCell>
                <TableCell className="text-right">{innings.totalRuns}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-base">Bowling</CardTitle>
        </CardHeader>
        <CardContent className="py-0 px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bowler</TableHead>
                <TableHead className="text-right w-12">O</TableHead>
                <TableHead className="text-right w-12">M</TableHead>
                <TableHead className="text-right w-12">R</TableHead>
                <TableHead className="text-right w-12">W</TableHead>
                <TableHead className="text-right w-12">Econ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bowlers.map((bowler) => (
                <TableRow key={bowler.id}>
                  <TableCell className="font-medium">{bowler.name}</TableCell>
                  <TableCell className="text-right">{bowler.overs.toFixed(1)}</TableCell>
                  <TableCell className="text-right">{bowler.maidens}</TableCell>
                  <TableCell className="text-right">{bowler.runs}</TableCell>
                  <TableCell className="text-right">{bowler.wickets}</TableCell>
                  <TableCell className="text-right">
                    {bowler.balls ? ((bowler.runs / (bowler.balls / 6)) * 6).toFixed(1) : '0.0'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewMatch;
