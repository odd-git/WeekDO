
import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { Plus } from 'lucide-react';
import { Task } from '../types';
import WeekHeader from '../components/WeekHeader';
import DayColumn from '../components/DayColumn';
import AddTaskForm from '../components/AddTaskForm';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [formVisible, setFormVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | undefined>();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { toast } = useToast();

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('weekTodoTasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        // Convert string dates back to Date objects
        const tasksWithDates = parsedTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt)
        }));
        setTasks(tasksWithDates);
      } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('weekTodoTasks', JSON.stringify(tasks));
  }, [tasks]);

  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(startOfCurrentWeek, i);
    return format(day, 'EEEE');
  });

  const handleAddTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setTasks([...tasks, task]);
    toast({ title: "Task added", description: `"${task.title}" added to ${task.day}` });
  };

  const handleToggleComplete = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id: string) => {
    const taskToDelete = tasks.find(task => task.id === id);
    setTasks(tasks.filter(task => task.id !== id));
    toast({ 
      title: "Task deleted", 
      description: taskToDelete ? `"${taskToDelete.title}" removed` : "Task removed",
      variant: "destructive"
    });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setFormVisible(true);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    setEditingTask(null);
    toast({ title: "Task updated", description: `"${updatedTask.title}" updated` });
  };

  const openFormForDay = (day: string) => {
    setSelectedDay(day);
    setEditingTask(null);
    setFormVisible(true);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-background">
      <WeekHeader currentDate={currentDate} />
      
      <div className="flex flex-1 overflow-hidden">
        {daysOfWeek.map((day) => (
          <DayColumn
            key={day}
            day={day}
            tasks={tasks.filter(task => task.day === day)}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
          />
        ))}
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => {
          setSelectedDay(undefined);
          setEditingTask(null);
          setFormVisible(true);
        }}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/90"
      >
        <Plus size={24} />
      </button>
      
      {/* Background overlay when form is visible */}
      {formVisible && (
        <div 
          className="fixed inset-0 bg-black/40 z-10"
          onClick={() => setFormVisible(false)}
        />
      )}
      
      <AddTaskForm
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        onAddTask={handleAddTask}
        selectedDay={selectedDay}
        editingTask={editingTask}
        onUpdateTask={handleUpdateTask}
      />
    </div>
  );
};

export default Index;
