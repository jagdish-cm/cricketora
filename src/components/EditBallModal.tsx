
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
import { BallEvent } from '@/context/MatchContext';
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
  ballEvents: BallEvent[];
  onEditBall: (originalBall: BallEvent, updatedBall: Partial<BallEvent>) => void;
  currentInningsIndex: number;
}

const EditBallModal = ({
  open,
  onClose,
  ballEvents,
  onEditBall,
  currentInningsIndex
}: EditBallModalProps) => {
  const [selectedBall, setSelectedBall] = useState<BallEvent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedBall(null);
      setIsEditing(false);
    }
  }, [open]);
  
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
  
  const handleSelectBall = (ball: BallEvent) => {
    setSelectedBall(ball);
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
      onEditBall(selectedBall, {
        isWide: !selectedBall.isWide,
        // In a real implementation, you would handle all fields here
      });
      
      setIsEditing(false);
      setSelectedBall(null);
      onClose();
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Previous Balls</DialogTitle>
          <DialogDescription>Select a ball to edit or view details</DialogDescription>
        </DialogHeader>
        
        <div className="py-4 max-h-[60vh] overflow-y-auto">
          {ballEvents.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No balls recorded yet</p>
          ) : (
            <div className="space-y-2">
              {ballEvents.map((ball, index) => (
                <div 
                  key={`${ball.overNumber}.${ball.ballNumber}`}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    selectedBall === ball ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelectBall(ball)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="bg-gray-100 text-xs font-medium px-2 py-1 rounded">
                        {formatBallNumber(ball)}
                      </div>
                      <div className="text-sm">
                        {getBallDescription(ball)}
                      </div>
                    </div>
                    {selectedBall === ball && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={handleEditBall}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          {selectedBall && (
            <Button onClick={handleEditBall} disabled={isEditing}>
              Edit Selected
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditBallModal;
