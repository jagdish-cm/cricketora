
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DismissalType } from './DismissalModal';
import { AlertTriangle } from 'lucide-react';

export interface ScoreDetails {
  runs: number;
  isWide?: boolean;
  isNoBall?: boolean;
  isBye?: boolean;
  isLegBye?: boolean;
  isWicket?: boolean;
  dismissalType?: DismissalType;
  batsmanName?: string;
  bowlerName?: string;
  rotateStrike?: boolean;
}

interface ScoreConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  scoreDetails: ScoreDetails;
  allowRotateStrikeToggle?: boolean;
  rotateStrike?: boolean;
  onRotateStrikeChange?: (value: boolean) => void;
}

const ScoreConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  scoreDetails,
  allowRotateStrikeToggle = false,
  rotateStrike = true,
  onRotateStrikeChange
}: ScoreConfirmationModalProps) => {
  
  const getDescription = () => {
    if (scoreDetails.isWicket) {
      return `WICKET: ${scoreDetails.batsmanName}${scoreDetails.dismissalType ? ` (${formatDismissalType(scoreDetails.dismissalType)})` : ''}`;
    }
    
    let prefix = '';
    if (scoreDetails.isWide) prefix = 'Wide + ';
    else if (scoreDetails.isNoBall) prefix = 'No Ball + ';
    else if (scoreDetails.isBye) prefix = 'Bye + ';
    else if (scoreDetails.isLegBye) prefix = 'Leg Bye + ';
    
    return `${prefix}${scoreDetails.runs} run${scoreDetails.runs !== 1 ? 's' : ''}`;
  };
  
  const formatDismissalType = (type: DismissalType): string => {
    switch(type) {
      case 'bowled': return 'Bowled';
      case 'caught': return 'Caught';
      case 'lbw': return 'LBW';
      case 'run_out': return 'Run Out';
      case 'stumped': return 'Stumped';
      case 'hit_wicket': return 'Hit Wicket';
      case 'handled_ball': return 'Handled Ball';
      case 'obstructing_field': return 'Obstructing Field';
      case 'hit_ball_twice': return 'Hit Ball Twice';
      case 'timed_out': return 'Timed Out';
      default: return type;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Score</DialogTitle>
          <DialogDescription>Please verify the details before confirming</DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="text-center mb-3">
            <span className="text-lg font-semibold">{getDescription()}</span>
          </div>
          
          {scoreDetails.batsmanName && !scoreDetails.isWicket && (
            <div className="text-sm text-gray-600 mb-1">
              Batsman: {scoreDetails.batsmanName}
            </div>
          )}
          
          {scoreDetails.bowlerName && (
            <div className="text-sm text-gray-600 mb-3">
              Bowler: {scoreDetails.bowlerName}
            </div>
          )}
          
          {allowRotateStrikeToggle && (
            <div className="flex items-center space-x-2 mt-4 p-2 bg-green-50 rounded-md">
              <Switch
                id="rotateStrike"
                checked={rotateStrike}
                onCheckedChange={onRotateStrikeChange}
              />
              <Label htmlFor="rotateStrike" className="flex-grow cursor-pointer">
                Rotate strike
              </Label>
            </div>
          )}
          
          {scoreDetails.isWicket && (
            <div className="flex items-center mt-4 p-3 bg-amber-50 text-amber-800 rounded-md text-sm">
              <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>New batsman selection will appear after confirming this dismissal.</span>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="text-sm h-9">Cancel</Button>
          <Button onClick={onConfirm} className="text-sm h-9">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScoreConfirmationModal;
