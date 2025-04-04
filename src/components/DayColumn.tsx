
import React from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';
import { useDrag, useDrop } from 'react-dnd';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface DayColumnProps {
  day: string;
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onMoveTask: (taskId: string, sourceDay: string, targetDay: string) => void;
}

const DayColumn: React.FC<DayColumnProps> = ({ 
  day,
  tasks, 
  onToggleComplete, 
  onDelete, 
  onEdit,
  onMoveTask 
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: (item: { id: string, day: string }) => {
      if (item.day !== day) {
        onMoveTask(item.id, item.day, day);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const addNewTask = () => {
    // Trigger the add task form with this day pre-selected
    document.dispatchEvent(new CustomEvent('open-add-task', { 
      detail: { selectedDay: day } 
    }));
  };

  return (
    <div className={cn(
      "day-column relative border-r border-border dark:border-border-dark",
      isOver && "bg-accent/50 dark:bg-accent-dark/20"
    )}>
      <div 
        ref={drop}
        className="h-full p-1 overflow-y-auto"
        onClick={addNewTask}
      >
        {tasks.map((task, index) => (
          <React.Fragment key={task.id}>
            <TaskItem
              task={task}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onEdit={onEdit}
            />
            {index < tasks.length - 1 && (
              <div className="px-2 py-1">
                <Separator className="border-dashed opacity-40" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default DayColumn;
