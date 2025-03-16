
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
import { UserRoundPlus, UserRound, Check, X, Edit } from 'lucide-react';

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
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editingPlayerName, setEditingPlayerName] = useState("");
  
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

  const startEditingPlayer = (player: Player) => {
    setEditingPlayerId(player.id);
    setEditingPlayerName(player.name);
  };

  const savePlayerEdit = (playerId: string) => {
    // Here we would typically update the player name in the context or API
    // For now, let's just save the name locally by selecting with the new name
    if (editingPlayerName.trim()) {
      onSelect(playerId, editingPlayerName.trim());
      resetEditing();
      onClose();
    }
  };

  const resetEditing = () => {
    setEditingPlayerId(null);
    setEditingPlayerName("");
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-auto">
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
                    {editingPlayerId === player.id ? (
                      <div className="flex items-center space-x-2 w-full">
                        <Input
                          value={editingPlayerName}
                          onChange={(e) => setEditingPlayerName(e.target.value)}
                          className="flex-grow text-sm h-8"
                          autoFocus
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-green-500"
                          onClick={() => savePlayerEdit(player.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-500"
                          onClick={resetEditing}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <RadioGroupItem value={player.id} id={player.id} />
                        <Label htmlFor={player.id} className="flex-grow cursor-pointer text-sm">
                          {player.name}
                        </Label>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-primary/70 hover:text-primary"
                          onClick={() => startEditingPlayer(player)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </RadioGroup>
              
              {availablePlayers.length === 0 && (
                <p className="text-muted-foreground text-center py-4 text-sm">No available players</p>
              )}
              
              {allowAddPlayer && (
                <Button 
                  variant="outline" 
                  className="w-full mt-4 flex items-center justify-center text-sm h-9"
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
                <Label htmlFor="newPlayerName" className="text-sm">Player Name</Label>
                <Input
                  id="newPlayerName"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="Enter player name"
                  className="text-sm"
                  autoFocus
                />
              </div>
              
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center text-sm h-9"
                onClick={() => setIsAddingPlayer(false)}
              >
                Back to Player List
              </Button>
            </div>
          )}
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="text-sm h-9"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={(!selectedPlayer && !isAddingPlayer) || (isAddingPlayer && !newPlayerName.trim())}
            className="text-sm h-9"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectBatsmanModal;
