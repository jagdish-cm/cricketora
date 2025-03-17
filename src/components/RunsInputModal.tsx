
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
  const [rotateStrike, setRotateStrike] = useState(true);
  
  const handleSubmit = () => {
    const parsedRuns = parseInt(runs);
    if (!isNaN(parsedRuns)) {
      onSubmit({
        runs: parsedRuns,
        isStrikeRotated: rotateStrike
      });
      
      // Reset form
      setRuns(defaultValue.toString());
      setRotateStrike(true);
      onClose();
    }
  };
  
  const handleCancel = () => {
    // Reset form
    setRuns(defaultValue.toString());
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
              step="1"
              min="0"
              max="99"
              value={runs}
              onChange={(e) => setRuns(e.target.value)}
              placeholder="Enter runs"
            />
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
            disabled={isNaN(parseInt(runs))}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RunsInputModal;
