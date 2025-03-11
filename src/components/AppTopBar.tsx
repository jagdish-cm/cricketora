
import React, { useState } from 'react';
import { useMatch } from '@/context/MatchContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  Settings, 
  Menu, 
  X, 
  ArrowLeft, Pencil, 
  History, 
  BarChart3, 
  Info, 
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from '@/hooks/use-toast';

const AppTopBar = () => {
  const { match } = useMatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleCopyMatchId = () => {
    if (match?.id) {
      navigator.clipboard.writeText(match.id);
      toast({
        title: "Match ID copied",
        description: "Share this ID with other viewers",
      });
    }
  };
  
  const isScoring = location.pathname === '/scoring';
  
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container px-4 h-14 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')}
            className="mr-2"
          >
            <HomeIcon className="h-5 w-5" />
          </Button>
          
          {match && (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                {match.team1.name} vs {match.team2.name}
              </span>
              {match.innings && match.innings.length > 0 && match.currentInnings >= 0 && (
                <div className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                  Innings {match.currentInnings + 1}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {isScoring && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <History className="h-4 w-4" />
                  <span className="hidden sm:inline">History</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex items-center gap-2">
                  <Pencil className="h-4 w-4" />
                  Edit Previous Ball
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  View Scorecard
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {match && (
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={handleCopyMatchId}
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          )}
          
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader className="pb-4">
                <SheetTitle>CricketOra</SheetTitle>
              </SheetHeader>
              
              <div className="flex flex-col gap-1">
                <SheetClose asChild>
                  <Button 
                    variant="ghost" 
                    className="justify-start" 
                    onClick={() => navigate('/')}
                  >
                    <HomeIcon className="h-4 w-4 mr-2" />
                    Home
                  </Button>
                </SheetClose>
                
                {match && (
                  <>
                    <SheetClose asChild>
                      <Button 
                        variant="ghost" 
                        className="justify-start" 
                        onClick={() => {
                          if (isScoring) return;
                          navigate('/scoring');
                        }}
                        disabled={isScoring}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Scoring
                      </Button>
                    </SheetClose>
                    
                    <SheetClose asChild>
                      <Button 
                        variant="ghost" 
                        className="justify-start" 
                        onClick={handleCopyMatchId}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Match
                      </Button>
                    </SheetClose>
                  </>
                )}
                
                <SheetClose asChild>
                  <Button 
                    variant="ghost" 
                    className="justify-start"
                  >
                    <Info className="h-4 w-4 mr-2" />
                    About
                  </Button>
                </SheetClose>
                
                <SheetClose asChild>
                  <Button 
                    variant="ghost" 
                    className="justify-start"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default AppTopBar;
