
import React from 'react';
import { Task } from '../types';
import { Check, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onDelete, onEdit }) => {
  return (
    <div 
      className={cn(
        "task-item", 
        task.completed && "opacity-60 border-gray-300",
        `border-l-[${task.category}]`
      )}
      style={{ borderLeftColor: `var(--tw-color-category-${task.category})` }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center">
            <button
              onClick={() => onToggleComplete(task.id)}
              className={cn(
                "w-5 h-5 rounded-full border flex items-center justify-center mr-2",
                task.completed ? "bg-primary border-primary" : "border-gray-300"
              )}
            >
              {task.completed && <Check size={12} className="text-white" />}
            </button>
            <h3 className={cn(
              "font-medium text-sm",
              task.completed && "line-through text-gray-500"
            )}>
              {task.title}
            </h3>
          </div>
          {task.description && (
            <p className="text-xs text-gray-500 mt-1 ml-7">
              {task.description}
            </p>
          )}
        </div>

        <div className="flex space-x-1">
          <button 
            onClick={() => onEdit(task)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-destructive p-1"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
