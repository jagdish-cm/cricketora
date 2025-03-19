
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Player } from '@/context/MatchContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type DismissalType = 
  | 'bowled' 
  | 'caught' 
  | 'lbw' 
  | 'run_out' 
  | 'stumped' 
  | 'hit_wicket' 
  | 'handled_ball'
  | 'obstructing_field'
  | 'hit_ball_twice'
  | 'timed_out';

interface DismissalModalProps {
  open: boolean;
  onClose: () => void;
  batsmen: [Player | null, Player | null];
  fielders: Player[];
  bowler: Player | null;
  isLbwEnabled: boolean;
  onDismiss: (dismissalInfo: {
    batsmanId: string;
    dismissalType: DismissalType;
    fielderIds?: string[];
  }) => void;
}

const DismissalModal = ({
  open,
  onClose,
  batsmen,
  fielders,
  bowler,
  isLbwEnabled,
  onDismiss,
}: DismissalModalProps) => {
  const [batsmanId, setBatsmanId] = useState<string>("");
  const [dismissalType, setDismissalType] = useState<DismissalType>('bowled');
  const [fielderId, setFielderId] = useState<string>("");
  
  // Get list of available dismissal types based on rules
  const getAvailableDismissalTypes = () => {
    const types: Array<{value: DismissalType, label: string}> = [
      { value: 'bowled', label: 'Bowled' },
      { value: 'caught', label: 'Caught' },
      { value: 'run_out', label: 'Run Out' },
      { value: 'stumped', label: 'Stumped' },
      { value: 'hit_wicket', label: 'Hit Wicket' },
      { value: 'handled_ball', label: 'Handled Ball' },
      { value: 'obstructing_field', label: 'Obstructing Field' },
      { value: 'hit_ball_twice', label: 'Hit Ball Twice' },
      { value: 'timed_out', label: 'Timed Out' },
    ];
    
    if (isLbwEnabled) {
      types.splice(2, 0, { value: 'lbw', label: 'LBW' });
    }
    
    return types;
  };
  
  const dismissalTypes = getAvailableDismissalTypes();
  
  const needsFielder = dismissalType === 'caught' || dismissalType === 'run_out' || dismissalType === 'stumped';
  
  const handleSubmit = () => {
    if (batsmanId && dismissalType) {
      const dismissalInfo: {
        batsmanId: string;
        dismissalType: DismissalType;
        fielderIds?: string[];
      } = {
        batsmanId,
        dismissalType,
      };
      
      if (needsFielder && fielderId) {
        dismissalInfo.fielderIds = [fielderId];
      }
      
      onDismiss(dismissalInfo);
      
      // Reset form
      setBatsmanId("");
      setDismissalType('bowled');
      setFielderId("");
      onClose();
    }
  };
  
  const handleCancel = () => {
    // Reset form
    setBatsmanId("");
    setDismissalType('bowled');
    setFielderId("");
    onClose();
  };
  
  // Handle clicking on entire batsman row
  const handleBatsmanSelect = (id: string) => {
    setBatsmanId(id);
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Wicket!</DialogTitle>
          <DialogDescription>Enter dismissal details</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Batsman Out</Label>
            <RadioGroup value={batsmanId} onValueChange={setBatsmanId}>
              {batsmen.map((batsman, index) => batsman && (
                <div 
                  key={batsman.id} 
                  className="flex items-center space-x-2 py-2 border rounded-md px-3 my-1 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleBatsmanSelect(batsman.id)}
                >
                  <RadioGroupItem value={batsman.id} id={`batsman-${batsman.id}`} className="text-blue-600 focus:ring-blue-600" />
                  <Label htmlFor={`batsman-${batsman.id}`} className="flex-grow cursor-pointer">
                    {batsman.name} {index === 0 ? '(on strike)' : '(non-striker)'}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>How Out</Label>
            <Select value={dismissalType} onValueChange={(value: DismissalType) => setDismissalType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select dismissal type" />
              </SelectTrigger>
              <SelectContent>
                {dismissalTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {needsFielder && (
            <div className="space-y-2">
              <Label>Fielder</Label>
              <Select value={fielderId} onValueChange={setFielderId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fielder" />
                </SelectTrigger>
                <SelectContent>
                  {fielders.map((fielder) => (
                    <SelectItem key={fielder.id} value={fielder.id}>
                      {fielder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!batsmanId || !dismissalType || (needsFielder && !fielderId)}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DismissalModal;
