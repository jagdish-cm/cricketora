
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BallEvent, Match } from '@/context/MatchContext';
import { toast } from '@/hooks/use-toast';
import {
  Pencil,
  Trash2,
  Check,
  X
} from 'lucide-react';

interface EditBallModalProps {
  open: boolean;
  onClose: () => void;
  match: Match;
  overIndex: number;
  ballIndex: number;
  onComplete: () => void;
}

const EditBallModal = ({
  open,
  onClose,
  match,
  overIndex,
  ballIndex,
  onComplete
}: EditBallModalProps) => {
  const [selectedBall, setSelectedBall] = useState<BallEvent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedBall(null);
      setIsEditing(false);
    } else if (match) {
      // Get the ball from the specified over and ball index
      const currentInnings = match.innings[match.currentInnings];
      if (currentInnings && currentInnings.overs[overIndex]) {
        const ball = currentInnings.overs[overIndex].balls[ballIndex];
        if (ball) {
          setSelectedBall(ball);
        }
      }
    }
  }, [open, match, overIndex, ballIndex]);
  
  const formatBallNumber = (ball: BallEvent) => {
    return `${ball.overNumber}.${ball.ballNumber}`;
  };
  
  const getBallDescription = (ball: BallEvent) => {
    const parts = [];
    
    if (ball.isWide) parts.push("Wide");
    if (ball.isNoBall) parts.push("No Ball");
    
    if (ball.runs > 0) {
      if (ball.isBye) parts.push(`${ball.runs} Bye${ball.runs > 1 ? 's' : ''}`);
      else if (ball.isLegBye) parts.push(`${ball.runs} Leg Bye${ball.runs > 1 ? 's' : ''}`);
      else parts.push(`${ball.runs} Run${ball.runs > 1 ? 's' : ''}`);
    } else if (!ball.isWide && !ball.isNoBall) {
      parts.push("Dot Ball");
    }
    
    if (ball.isWicket) {
      parts.push(ball.dismissalType || "Wicket");
    }
    
    return parts.join(", ");
  };
  
  const handleEditBall = () => {
    if (selectedBall) {
      setIsEditing(true);
      
      // In a real implementation, you would open another modal or form here
      // For now, we'll just simulate an edit
      toast({
        title: "Edit functionality",
        description: "In a real implementation, this would open an edit form",
      });
      
      // For demonstration, let's just toggle the wide status
      // In a real implementation, you would handle all fields here
      
      setIsEditing(false);
      setSelectedBall(null);
      onClose();
      onComplete();
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Ball</DialogTitle>
          <DialogDescription>View and edit ball details</DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {selectedBall ? (
            <div className="space-y-4">
              <div className="p-4 border rounded-md">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 text-xs font-medium px-2 py-1 rounded">
                      {formatBallNumber(selectedBall)}
                    </div>
                    <div className="text-sm">
                      {getBallDescription(selectedBall)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <p className="text-sm font-medium">Ball Details:</p>
                <ul className="text-sm space-y-1">
                  <li>Over: {selectedBall.overNumber + 1}, Ball: {selectedBall.ballNumber + 1}</li>
                  <li>Runs: {selectedBall.runs}</li>
                  {selectedBall.isWide && <li>Wide: Yes</li>}
                  {selectedBall.isNoBall && <li>No Ball: Yes</li>}
                  {selectedBall.isBye && <li>Bye: Yes</li>}
                  {selectedBall.isLegBye && <li>Leg Bye: Yes</li>}
                  {selectedBall.isWicket && (
                    <li>Wicket: {selectedBall.dismissalType || "Unknown"}</li>
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">No ball data found</p>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          {selectedBall && (
            <Button onClick={handleEditBall} disabled={isEditing}>
              Edit Ball
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditBallModal;
