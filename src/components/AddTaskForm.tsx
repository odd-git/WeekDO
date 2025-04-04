
import React, { useState, useEffect } from 'react';
import { X, Plus, CheckSquare } from 'lucide-react';
import { Task, TaskCategory } from '../types';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from '@/lib/utils';

interface AddTaskFormProps {
  visible: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  selectedDay?: string;
  editingTask?: Task | null;
  onUpdateTask?: (task: Task) => void;
  inCustomList?: boolean;
}

const TaskCategoryButton = ({ 
  category, 
  selected, 
  onClick 
}: { 
  category: TaskCategory; 
  selected: boolean; 
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "w-6 h-6 rounded-full",
      selected && "ring-2 ring-offset-2 ring-primary dark:ring-primary-dark"
    )}
    style={{ backgroundColor: `var(--tw-color-category-${category})` }}
  />
);

const AddTaskForm: React.FC<AddTaskFormProps> = ({ 
  visible, 
  onClose, 
  onAddTask, 
  selectedDay,
  editingTask,
  onUpdateTask,
  inCustomList = false
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [day, setDay] = useState(selectedDay || format(new Date(), 'EEEE'));
  const [category, setCategory] = useState<TaskCategory>('blue');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const categories: TaskCategory[] = ['red', 'green', 'blue', 'yellow', 'purple'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setDay(editingTask.day);
      setCategory(editingTask.category);
    } else {
      resetForm();
      setDay(selectedDay || format(new Date(), 'EEEE'));
    }
  }, [editingTask, selectedDay]);

  // Focus the input field when the form becomes visible
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        const titleInput = document.getElementById('task-title');
        if (titleInput) {
          titleInput.focus();
        }
      }, 300);
    }
  }, [visible]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('blue');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    if (editingTask && onUpdateTask) {
      onUpdateTask({
        ...editingTask,
        title,
        description,
        day: inCustomList ? '' : day,
        category
      });
    } else {
      onAddTask({
        title,
        description,
        day: inCustomList ? '' : day,
        completed: false,
        category
      });
    }
    
    resetForm();
    onClose();
  };

  return (
    <div className={cn(
      "add-task-form z-20 dark:bg-gray-900 dark:border-gray-700",
      visible && "visible"
    )}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          {editingTask ? 'Edit Task' : 'Add New Task'}
        </h2>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-muted dark:hover:bg-gray-800">
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            id="task-title"
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
            autoFocus
          />
        </div>
        
        <div className="mb-4">
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full"
            rows={2}
          />
        </div>
        
        {!inCustomList && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Day</label>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            >
              {daysOfWeek.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        )}
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Category</label>
          <div className="flex space-x-4">
            {categories.map((c) => (
              <TaskCategoryButton
                key={c}
                category={c}
                selected={category === c}
                onClick={() => setCategory(c)}
              />
            ))}
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button
            type="submit"
            className="flex-1 flex items-center justify-center"
          >
            {editingTask ? (
              <>
                <CheckSquare size={16} className="mr-1" />
                Update Task
              </>
            ) : (
              <>
                <Plus size={16} className="mr-1" />
                Add Task
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskForm;
