
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

interface SelectBatsmanModalProps {
  open: boolean;
  onClose: () => void;
  availablePlayers: Player[];
  onSelect: (playerId: string) => void;
  title?: string;
  description?: string;
  selectForPosition?: 'striker' | 'non-striker';
}

const SelectBatsmanModal = ({
  open,
  onClose,
  availablePlayers,
  onSelect,
  title = "Select Batsman",
  description = "Choose the next batsman to come to the crease",
  selectForPosition
}: SelectBatsmanModalProps) => {
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  
  const handleSubmit = () => {
    if (selectedPlayer) {
      onSelect(selectedPlayer);
      setSelectedPlayer("");
      onClose();
    }
  };
  
  const positionText = selectForPosition === 'striker' 
    ? " (Striker)" 
    : selectForPosition === 'non-striker' 
      ? " (Non-striker)" 
      : "";
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}{positionText}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup value={selectedPlayer} onValueChange={setSelectedPlayer}>
            {availablePlayers.map((player) => (
              <div key={player.id} className="flex items-center space-x-2 py-2">
                <RadioGroupItem value={player.id} id={player.id} />
                <Label htmlFor={player.id} className="flex-grow cursor-pointer">
                  {player.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
          
          {availablePlayers.length === 0 && (
            <p className="text-muted-foreground text-center py-4">No available players</p>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedPlayer || availablePlayers.length === 0}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectBatsmanModal;
