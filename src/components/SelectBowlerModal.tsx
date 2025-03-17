
import React, { useState, useEffect } from 'react';
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UserRoundPlus, Check, X, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectBowlerModalProps {
  open: boolean;
  onClose: () => void;
  availablePlayers: Player[];
  onSelect: (playerId: string, playerName?: string) => void;
  title?: string;
  description?: string;
  currentBowler?: string;
  allowAddPlayer?: boolean;
}

const SelectBowlerModal = ({
  open,
  onClose,
  availablePlayers,
  onSelect,
  title = "Select Bowler",
  description = "Choose a bowler for this over",
  currentBowler,
  allowAddPlayer = false
}: SelectBowlerModalProps) => {
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editingPlayerName, setEditingPlayerName] = useState("");
  
  // Set the current bowler as selected when the modal opens
  useEffect(() => {
    if (open && currentBowler) {
      setSelectedPlayer(currentBowler);
    } else if (open) {
      setSelectedPlayer("");
    }
  }, [open, currentBowler]);
  
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
              <div className="grid grid-cols-2 gap-2">
                {availablePlayers.map((player) => (
                  <div key={player.id}>
                    {editingPlayerId === player.id ? (
                      <div className="flex items-center space-x-2 w-full p-2">
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
                      <div 
                        className={cn(
                          "flex items-center justify-between p-2 rounded-md border cursor-pointer transition-all",
                          selectedPlayer === player.id 
                            ? "border-primary bg-primary/5 text-primary" 
                            : "border-gray-200 hover:border-primary/30 hover:bg-primary/5"
                        )}
                        onClick={() => setSelectedPlayer(player.id)}
                      >
                        <span className="text-sm truncate">{player.name}</span>
                        <div className="flex items-center">
                          {selectedPlayer === player.id && (
                            <Check className="h-4 w-4 text-primary mr-1" />
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-primary/70 hover:text-primary flex-shrink-0 p-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditingPlayer(player);
                            }}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
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

export default SelectBowlerModal;
