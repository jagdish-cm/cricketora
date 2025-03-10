
import React, { useState } from 'react';
import { Player } from '@/context/MatchContext';
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

interface SelectBowlerModalProps {
  open: boolean;
  onClose: () => void;
  availablePlayers: Player[];
  currentBowler?: string;
  onSelect: (playerId: string) => void;
}

const SelectBowlerModal = ({
  open,
  onClose,
  availablePlayers,
  currentBowler,
  onSelect,
}: SelectBowlerModalProps) => {
  // Filter out current bowler if provided
  const eligibleBowlers = currentBowler 
    ? availablePlayers.filter(player => player.id !== currentBowler)
    : availablePlayers;
    
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  
  const handleSubmit = () => {
    if (selectedPlayer) {
      onSelect(selectedPlayer);
      setSelectedPlayer("");
      onClose();
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Bowler</DialogTitle>
          <DialogDescription>Choose the bowler for the next over</DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup value={selectedPlayer} onValueChange={setSelectedPlayer}>
            {eligibleBowlers.map((player) => (
              <div key={player.id} className="flex items-center space-x-2 py-2">
                <RadioGroupItem value={player.id} id={player.id} />
                <Label htmlFor={player.id} className="flex-grow cursor-pointer">
                  {player.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
          
          {eligibleBowlers.length === 0 && (
            <p className="text-muted-foreground text-center py-4">No available bowlers</p>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedPlayer || eligibleBowlers.length === 0}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectBowlerModal;
