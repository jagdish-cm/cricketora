
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

export interface RunsInfo {
  runs: number;
  isNonInteger?: boolean;
  isStrikeRotated?: boolean;
}

interface RunsInputModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (runsInfo: RunsInfo) => void;
  defaultValue?: number;
}

const RunsInputModal = ({
  open,
  onClose,
  onSubmit,
  defaultValue = 0
}: RunsInputModalProps) => {
  const [runs, setRuns] = useState<string>(defaultValue.toString());
  const [isNonInteger, setIsNonInteger] = useState(false);
  const [rotateStrike, setRotateStrike] = useState(true);
  
  const handleSubmit = () => {
    const parsedRuns = parseFloat(runs);
    if (!isNaN(parsedRuns)) {
      onSubmit({
        runs: parsedRuns,
        isNonInteger: isNonInteger && parsedRuns % 1 !== 0,
        isStrikeRotated: rotateStrike
      });
      
      // Reset form
      setRuns(defaultValue.toString());
      setIsNonInteger(false);
      setRotateStrike(true);
      onClose();
    }
  };
  
  const handleCancel = () => {
    // Reset form
    setRuns(defaultValue.toString());
    setIsNonInteger(false);
    setRotateStrike(true);
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Runs Scored</DialogTitle>
          <DialogDescription>Enter the exact number of runs</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="runs">Runs</Label>
            <Input
              id="runs"
              type="number"
              step={isNonInteger ? "0.1" : "1"}
              min="0"
              max="99"
              value={runs}
              onChange={(e) => setRuns(e.target.value)}
              placeholder="Enter runs"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="nonInteger"
              checked={isNonInteger}
              onCheckedChange={setIsNonInteger}
            />
            <Label htmlFor="nonInteger" className="flex-grow cursor-pointer">
              Allow non-integer runs (e.g., 1/3, 2/3)
            </Label>
          </div>
          
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
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isNaN(parseFloat(runs))}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RunsInputModal;
