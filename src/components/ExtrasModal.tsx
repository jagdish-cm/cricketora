
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Extras</DialogTitle>
          <DialogDescription>Enter details for the extras</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Extra Type</Label>
            <RadioGroup value={extraType} onValueChange={(value: ExtraType) => setExtraType(value)}>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2 py-2">
                  <RadioGroupItem value="wide" id="wide" />
                  <Label htmlFor="wide" className="cursor-pointer">Wide</Label>
                </div>
                <div className="flex items-center space-x-2 py-2">
                  <RadioGroupItem value="noBall" id="noBall" />
                  <Label htmlFor="noBall" className="cursor-pointer">No Ball</Label>
                </div>
                {byesEnabled && (
                  <div className="flex items-center space-x-2 py-2">
                    <RadioGroupItem value="bye" id="bye" />
                    <Label htmlFor="bye" className="cursor-pointer">Bye</Label>
                  </div>
                )}
                {legByesEnabled && (
                  <div className="flex items-center space-x-2 py-2">
                    <RadioGroupItem value="legBye" id="legBye" />
                    <Label htmlFor="legBye" className="cursor-pointer">Leg Bye</Label>
                  </div>
                )}
                <div className="flex items-center space-x-2 py-2">
                  <RadioGroupItem value="penalty" id="penalty" />
                  <Label htmlFor="penalty" className="cursor-pointer">Penalty</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="runs">Runs</Label>
            <Input
              id="runs"
              type="number"
              min="0"
              max="99"
              value={runs}
              onChange={(e) => setRuns(e.target.value)}
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
