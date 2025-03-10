
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

export interface ScoreDetails {
  runs: number;
  isWide?: boolean;
  isNoBall?: boolean;
  isBye?: boolean;
  isLegBye?: boolean;
  isWicket?: boolean;
  dismissalType?: string;
  batsmanName?: string;
  bowlerName?: string;
  rotateStrike?: boolean;
}

interface ScoreConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  scoreDetails: ScoreDetails;
}

const ScoreConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  scoreDetails,
}: ScoreConfirmationModalProps) => {
  const {
    runs,
    isWide,
    isNoBall,
    isBye,
    isLegBye,
    isWicket,
    dismissalType,
    batsmanName,
    bowlerName,
    rotateStrike,
  } = scoreDetails;

  const getBallTypeText = () => {
    if (isWide) return "Wide";
    if (isNoBall) return "No Ball";
    if (isBye) return "Bye";
    if (isLegBye) return "Leg Bye";
    return "Legal Delivery";
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Score</DialogTitle>
          <DialogDescription>Please verify the details before submitting</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="font-medium">Ball Type:</span>
            <span className={cn(
              isWide || isNoBall ? "text-amber-600" : "text-green-600"
            )}>
              {getBallTypeText()}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium">Runs:</span>
            <span className={cn(
              "font-semibold",
              runs === 4 || runs === 6 ? "text-green-600" : ""
            )}>
              {runs}
            </span>
          </div>
          
          {batsmanName && (
            <div className="flex justify-between items-center">
              <span className="font-medium">Batsman:</span>
              <span>{batsmanName}</span>
            </div>
          )}
          
          {bowlerName && (
            <div className="flex justify-between items-center">
              <span className="font-medium">Bowler:</span>
              <span>{bowlerName}</span>
            </div>
          )}
          
          {isWicket && (
            <div className="flex justify-between items-center text-red-600">
              <span className="font-medium">Wicket:</span>
              <span>{dismissalType || "Out"}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="font-medium">Strike Rotation:</span>
            <span>{rotateStrike ? "Yes" : "No"}</span>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Edit</Button>
          <Button 
            onClick={onConfirm}
            className={isWicket ? "bg-red-600 hover:bg-red-700" : ""}
          >
            Confirm & Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScoreConfirmationModal;
