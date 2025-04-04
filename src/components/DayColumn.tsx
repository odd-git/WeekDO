
import React from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';

interface DayColumnProps {
  day: string;
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const DayColumn: React.FC<DayColumnProps> = ({ 
  day,
  tasks, 
  onToggleComplete, 
  onDelete, 
  onEdit 
}) => {
  return (
    <div className="day-column">
      <div className="p-1 overflow-y-auto">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
};

export default DayColumn;
