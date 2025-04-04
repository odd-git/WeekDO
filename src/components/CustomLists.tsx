
import React, { useState } from 'react';
import { CustomList } from '../types';
import { Plus, Trash2, Moon, Sun } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface CustomListsProps {
  lists: CustomList[];
  onAddList: (name: string) => void;
  onDeleteList: (id: string) => void;
  selectedListId?: string;
  onSelectList: (id: string | undefined) => void;
  onToggleTheme: () => void;
  currentTheme: string;
}

const CustomLists: React.FC<CustomListsProps> = ({
  lists,
  onAddList,
  onDeleteList,
  selectedListId,
  onSelectList,
  onToggleTheme,
  currentTheme
}) => {
  const [newListName, setNewListName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      onAddList(newListName.trim());
      setNewListName('');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Your Lists</h2>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onToggleTheme}
        >
          {currentTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
      </div>
      
      <Separator className="mb-4" />
      
      <div className="mb-4">
        <Button
          variant={selectedListId ? "outline" : "secondary"}
          className="w-full justify-start mb-2"
          onClick={() => onSelectList(undefined)}
        >
          Week Calendar
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {lists.map(list => (
          <div 
            key={list.id}
            className="flex items-center mb-2"
          >
            <Button
              variant={selectedListId === list.id ? "secondary" : "outline"}
              className="flex-1 justify-start text-left"
              onClick={() => onSelectList(list.id)}
            >
              {list.name}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteList(list.id)}
              className="ml-1 text-destructive hover:text-destructive"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </div>
      
      <Separator className="my-4" />
      
      <form onSubmit={handleSubmit} className="mt-auto">
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="New list name..."
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" className="ml-2" disabled={!newListName.trim()}>
            <Plus size={18} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CustomLists;
