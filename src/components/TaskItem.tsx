
import React from 'react';
import { Task } from '../types';
import { Check, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDrag } from 'react-dnd';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onDelete, onEdit }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id, day: task.day },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the column's click handler
  };

  return (
    <div 
      ref={drag}
      className={cn(
        "task-item", 
        task.completed && "opacity-60 border-gray-300 dark:border-gray-600",
        isDragging && "opacity-50",
        `border-l-[${task.category}]`
      )}
      style={{ 
        borderLeftColor: `var(--tw-color-category-${task.category})`,
        cursor: 'grab'
      }}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center">
            <button
              onClick={() => onToggleComplete(task.id)}
              className={cn(
                "w-5 h-5 rounded-full border flex items-center justify-center mr-2",
                task.completed ? "bg-primary border-primary dark:bg-primary-dark dark:border-primary-dark" : "border-gray-300 dark:border-gray-600"
              )}
            >
              {task.completed && <Check size={12} className="text-white dark:text-black" />}
            </button>
            <h3 className={cn(
              "font-medium text-sm",
              task.completed && "line-through text-gray-500 dark:text-gray-400"
            )}>
              {task.title}
            </h3>
          </div>
          {task.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-7">
              {task.description}
            </p>
          )}
        </div>

        <div className="flex space-x-1">
          <button 
            onClick={() => onEdit(task)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-destructive dark:hover:text-destructive p-1"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
