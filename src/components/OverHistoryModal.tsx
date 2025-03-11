
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Edit, Clock } from 'lucide-react';
import { BallEvent, Over } from '@/context/MatchContext';
import { cn } from '@/lib/utils';

interface OverHistoryModalProps {
  open: boolean;
  onClose: () => void;
  overs: Over[];
  onEditBall: (overNumber: number, ballIndex: number) => void;
}

const OverHistoryModal = ({
  open,
  onClose,
  overs,
  onEditBall
}: OverHistoryModalProps) => {
  const [selectedOver, setSelectedOver] = useState<number | null>(null);
  
  const renderBallContent = (ball: BallEvent) => {
    const elements = [];
    
    if (ball.isWicket) elements.push('W');
    if (ball.isWide) elements.push('Wd');
    if (ball.isNoBall) elements.push('Nb');
    if (ball.isBye) elements.push('B');
    if (ball.isLegBye) elements.push('Lb');
    if (!ball.isWide && !ball.isNoBall && !ball.isBye && !ball.isLegBye && ball.runs > 0) {
      elements.push(ball.runs.toString());
    } else if (elements.length === 0) {
      elements.push('0');
    }
    
    return elements.join(', ');
  };
  
  const getBallClass = (ball: BallEvent) => {
    return cn(
      "h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium border flex-shrink-0 relative",
      ball.isWicket ? "bg-red-100 border-red-300 text-red-700" :
      ball.isWide || ball.isNoBall ? "bg-amber-100 border-amber-300 text-amber-700" :
      ball.isBye || ball.isLegBye ? "bg-indigo-100 border-indigo-300 text-indigo-700" :
      ball.runs === 4 || ball.runs === 6 ? "bg-green-100 border-green-300 text-green-700" :
      "bg-gray-100 border-gray-300 text-gray-700"
    );
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Over History</DialogTitle>
          <DialogDescription>View and edit previous balls</DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {overs.length === 0 ? (
            <p className="text-center text-muted-foreground">No overs recorded yet</p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                {overs.map((over, idx) => (
                  <Button
                    key={idx}
                    variant={selectedOver === idx ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedOver(idx)}
                  >
                    Over {over.number + 1}
                  </Button>
                ))}
              </div>
              
              <Separator />
              
              {selectedOver !== null ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">
                      Over {overs[selectedOver].number + 1}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 inline mr-1" />
                      {new Date(overs[selectedOver].balls[0]?.timestamp || Date.now()).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {overs[selectedOver].balls.map((ball, ballIdx) => (
                      <div 
                        key={ballIdx}
                        className="relative group"
                      >
                        <div className={getBallClass(ball)}>
                          <div className="absolute -top-1 -left-1 bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                            {ballIdx + 1}
                          </div>
                          <span className="text-xs">{renderBallContent(ball)}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-0 right-0 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => onEditBall(selectedOver, ballIdx)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">Select an over to view details</p>
              )}
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OverHistoryModal;
