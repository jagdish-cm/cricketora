
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
import { Input } from "@/components/ui/input";
import { UserRoundPlus, UserRound } from 'lucide-react';

interface SelectBatsmanModalProps {
  open: boolean;
  onClose: () => void;
  availablePlayers: Player[];
  onSelect: (playerId: string, playerName?: string) => void;
  title?: string;
  description?: string;
  selectForPosition?: 'striker' | 'non-striker' | undefined;
  allowAddPlayer?: boolean;
}

const SelectBatsmanModal = ({
  open,
  onClose,
  availablePlayers,
  onSelect,
  title = "Select Batsman",
  description = "Choose a batsman to join the crease",
  selectForPosition,
  allowAddPlayer = false
}: SelectBatsmanModalProps) => {
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  
  const handleSubmit = () => {
    if (isAddingPlayer && newPlayerName.trim()) {
      onSelect('new_player', newPlayerName.trim());
      setNewPlayerName("");
      setIsAddingPlayer(false);
      onClose();
    } else if (selectedPlayer) {
      onSelect(selectedPlayer);
      setSelectedPlayer("");
      onClose();
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {!isAddingPlayer ? (
            <>
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
              
              {allowAddPlayer && (
                <Button 
                  variant="outline" 
                  className="w-full mt-4 flex items-center justify-center"
                  onClick={() => setIsAddingPlayer(true)}
                >
                  <UserRoundPlus className="h-4 w-4 mr-2" />
                  Add New Player
                </Button>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPlayerName">Player Name</Label>
                <Input
                  id="newPlayerName"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="Enter player name"
                  autoFocus
                />
              </div>
              
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center"
                onClick={() => setIsAddingPlayer(false)}
              >
                Back to Player List
              </Button>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={(!selectedPlayer && !isAddingPlayer) || (isAddingPlayer && !newPlayerName.trim())}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectBatsmanModal;
