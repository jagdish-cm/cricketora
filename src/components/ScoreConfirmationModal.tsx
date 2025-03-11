
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
import { 
  AlertTriangle, 
  Zap, 
  UserX, 
  Footprints,
  ArrowBigRightDash,
  ShieldAlert
} from 'lucide-react';

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
  events?: string[];
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
    events = []
  } = scoreDetails;

  const getBallTypeText = () => {
    if (isWide) return "Wide";
    if (isNoBall) return "No Ball";
    if (isBye) return "Bye";
    if (isLegBye) return "Leg Bye";
    return "Legal Delivery";
  };
  
  // Generate a descriptive text for the ball
  const getBallDescription = () => {
    const eventParts = [];
    
    if (isWide) eventParts.push("Wide");
    if (isNoBall) eventParts.push("No Ball");
    if (runs > 0) {
      if (runs === 1) eventParts.push("1 Run");
      else eventParts.push(`${runs} Runs`);
    }
    if (isBye) eventParts.push("Bye");
    if (isLegBye) eventParts.push("Leg Bye");
    if (isWicket) eventParts.push(dismissalType || "Wicket");
    
    // Add any custom events
    eventParts.push(...events.filter(event => !eventParts.includes(event)));
    
    return eventParts.join(" + ");
  };
  
  const getBallTypeIcon = () => {
    if (isWide) return <ArrowBigRightDash className="h-4 w-4" />;
    if (isNoBall) return <Zap className="h-4 w-4" />;
    if (isWicket) return <UserX className="h-4 w-4" />;
    if (isBye || isLegBye) return <Footprints className="h-4 w-4" />;
    return null;
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
              "flex items-center gap-1",
              isWide || isNoBall ? "text-amber-600" : "text-green-600"
            )}>
              {getBallTypeIcon()}
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
          
          {events.length > 0 && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm text-amber-800">Multiple events on this ball</h4>
                  <p className="text-sm text-amber-700 mt-1">{getBallDescription()}</p>
                </div>
              </div>
            </div>
          )}
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
