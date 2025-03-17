
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export type ExtraType = 'wide' | 'noBall' | 'bye' | 'legBye' | 'penalty';

export interface ExtrasInfo {
  extraType: ExtraType;
  runs: number;
  isNoBallRuns?: boolean;
  isWicket?: boolean;
  rotateStrike?: boolean;
}

interface ExtrasModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (extrasInfo: ExtrasInfo) => void;
  byesEnabled?: boolean;
  legByesEnabled?: boolean;
}

const ExtrasModal = ({
  open,
  onClose,
  onSubmit,
  byesEnabled = true,
  legByesEnabled = true
}: ExtrasModalProps) => {
  const [extraType, setExtraType] = useState<ExtraType>('wide');
  const [runs, setRuns] = useState<string>("1");
  const [isWicket, setIsWicket] = useState(false);
  const [rotateStrike, setRotateStrike] = useState(false);
  const [isNoBallRuns, setIsNoBallRuns] = useState(false);
  
  const handleSubmit = () => {
    const parsedRuns = parseInt(runs);
    if (!isNaN(parsedRuns)) {
      onSubmit({
        extraType,
        runs: parsedRuns,
        isWicket,
        rotateStrike,
        isNoBallRuns: extraType === 'noBall' ? isNoBallRuns : undefined
      });
      
      // Reset form
      resetForm();
      onClose();
    }
  };
  
  const resetForm = () => {
    setExtraType('wide');
    setRuns("1");
    setIsWicket(false);
    setRotateStrike(false);
    setIsNoBallRuns(false);
  };
  
  const handleCancel = () => {
    resetForm();
    onClose();
  };

  // Default rotation based on ICC rules
  const setDefaultRotation = (run: string) => {
    const parsedRun = parseInt(run);
    if (!isNaN(parsedRun)) {
      setRotateStrike(parsedRun % 2 === 1);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Extras</DialogTitle>
          <DialogDescription>Enter details for the extras</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Extra Type</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={cn(
                  "p-3 rounded-md border text-sm flex items-center justify-center font-medium",
                  extraType === 'wide' 
                    ? "bg-green-50 border-green-500 text-green-700 ring-2 ring-green-200" 
                    : "border-gray-200 hover:border-green-300 hover:bg-green-50/50"
                )}
                onClick={() => setExtraType('wide')}
              >
                Wide
              </button>
              <button
                type="button"
                className={cn(
                  "p-3 rounded-md border text-sm flex items-center justify-center font-medium",
                  extraType === 'noBall' 
                    ? "bg-green-50 border-green-500 text-green-700 ring-2 ring-green-200" 
                    : "border-gray-200 hover:border-green-300 hover:bg-green-50/50"
                )}
                onClick={() => setExtraType('noBall')}
              >
                No Ball
              </button>
              {byesEnabled && (
                <button
                  type="button"
                  className={cn(
                    "p-3 rounded-md border text-sm flex items-center justify-center font-medium",
                    extraType === 'bye' 
                      ? "bg-green-50 border-green-500 text-green-700 ring-2 ring-green-200" 
                      : "border-gray-200 hover:border-green-300 hover:bg-green-50/50"
                  )}
                  onClick={() => setExtraType('bye')}
                >
                  Bye
                </button>
              )}
              {legByesEnabled && (
                <button
                  type="button"
                  className={cn(
                    "p-3 rounded-md border text-sm flex items-center justify-center font-medium",
                    extraType === 'legBye' 
                      ? "bg-green-50 border-green-500 text-green-700 ring-2 ring-green-200" 
                      : "border-gray-200 hover:border-green-300 hover:bg-green-50/50"
                  )}
                  onClick={() => setExtraType('legBye')}
                >
                  Leg Bye
                </button>
              )}
              <button
                type="button"
                className={cn(
                  "p-3 rounded-md border text-sm flex items-center justify-center font-medium",
                  extraType === 'penalty' 
                    ? "bg-green-50 border-green-500 text-green-700 ring-2 ring-green-200" 
                    : "border-gray-200 hover:border-green-300 hover:bg-green-50/50"
                )}
                onClick={() => setExtraType('penalty')}
              >
                Penalty
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="runs">Runs</Label>
            <Input
              id="runs"
              type="number"
              min="0"
              max="99"
              value={runs}
              onChange={(e) => {
                setRuns(e.target.value);
                setDefaultRotation(e.target.value);
              }}
              placeholder="Enter runs"
            />
          </div>
          
          {extraType === 'noBall' && (
            <div className="flex items-center space-x-2">
              <Switch
                id="isNoBallRuns"
                checked={isNoBallRuns}
                onCheckedChange={setIsNoBallRuns}
              />
              <Label htmlFor="isNoBallRuns" className="flex-grow cursor-pointer">
                Batsman scored runs on this no ball
              </Label>
            </div>
          )}
          
          {extraType === 'noBall' && (
            <div className="flex items-center space-x-2">
              <Switch
                id="isWicket"
                checked={isWicket}
                onCheckedChange={setIsWicket}
              />
              <Label htmlFor="isWicket" className="flex-grow cursor-pointer">
                Wicket on this delivery (run out only)
              </Label>
            </div>
          )}
          
          {(extraType === 'bye' || extraType === 'legBye' || (extraType === 'noBall' && isNoBallRuns)) && (
            <div className="flex items-center space-x-2">
              <Switch
                id="rotateStrike"
                checked={rotateStrike}
                onCheckedChange={setRotateStrike}
              />
              <Label htmlFor="rotateStrike" className="flex-grow cursor-pointer">
                Rotate strike
              </Label>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isNaN(parseInt(runs))}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExtrasModal;
