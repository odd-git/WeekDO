
import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { Plus, Menu, List as ListIcon } from 'lucide-react';
import { Task, CustomList } from '../types';
import WeekHeader from '../components/WeekHeader';
import DayColumn from '../components/DayColumn';
import AddTaskForm from '../components/AddTaskForm';
import { useToast } from '@/hooks/use-toast';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import CustomLists from '../components/CustomLists';
import { useTheme } from '@/hooks/use-theme';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<CustomList[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [formVisible, setFormVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | undefined>();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedListId, setSelectedListId] = useState<string | undefined>();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  // Load tasks and lists from localStorage on component mount
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

    const savedLists = localStorage.getItem('weekTodoLists');
    if (savedLists) {
      try {
        const parsedLists = JSON.parse(savedLists);
        const listsWithDates = parsedLists.map((list: any) => ({
          ...list,
          createdAt: new Date(list.createdAt)
        }));
        setLists(listsWithDates);
      } catch (error) {
        console.error('Error loading lists from localStorage:', error);
      }
    }
  }, []);

  // Save tasks and lists to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('weekTodoTasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('weekTodoLists', JSON.stringify(lists));
  }, [lists]);

  // Listen for events to open the add task form
  useEffect(() => {
    const handleOpenAddTask = (e: CustomEvent) => {
      setSelectedDay(e.detail.selectedDay);
      setEditingTask(null);
      setFormVisible(true);
    };

    document.addEventListener('open-add-task', handleOpenAddTask as EventListener);
    return () => {
      document.removeEventListener('open-add-task', handleOpenAddTask as EventListener);
    };
  }, []);

  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(startOfCurrentWeek, i);
    return format(day, 'EEEE');
  });

  const handleAddTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date(),
      listId: selectedListId
    };
    setTasks([...tasks, task]);
    toast({ title: "Task added", description: `"${task.title}" added to ${task.day || 'your list'}` });
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

  const handleMoveTask = (taskId: string, sourceDay: string, targetDay: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, day: targetDay } : task
    ));
    toast({ title: "Task moved", description: `Task moved to ${targetDay}` });
  };

  const handleAddList = (name: string) => {
    const newList: CustomList = {
      id: Date.now().toString(),
      name,
      createdAt: new Date()
    };
    setLists([...lists, newList]);
    setSelectedListId(newList.id);
    toast({ title: "List created", description: `"${name}" list created` });
  };

  const handleDeleteList = (id: string) => {
    const listToDelete = lists.find(list => list.id === id);
    
    // Delete the list
    setLists(lists.filter(list => list.id !== id));
    
    // Delete or reassign tasks from this list
    setTasks(tasks.filter(task => task.listId !== id));
    
    // If we were viewing this list, go back to week view
    if (selectedListId === id) {
      setSelectedListId(undefined);
    }
    
    toast({ 
      title: "List deleted", 
      description: listToDelete ? `"${listToDelete.name}" list removed` : "List removed",
      variant: "destructive"
    });
  };

  const openFormForDay = (day: string) => {
    setSelectedDay(day);
    setEditingTask(null);
    setFormVisible(true);
  };

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      <div className="flex flex-col h-screen max-h-screen bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark">
        <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-900 shadow-sm">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                <Menu size={20} />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85%] sm:w-[350px]">
              <CustomLists 
                lists={lists}
                onAddList={handleAddList}
                onDeleteList={handleDeleteList}
                selectedListId={selectedListId}
                onSelectList={setSelectedListId}
                onToggleTheme={toggleTheme}
                currentTheme={theme}
              />
            </SheetContent>
          </Sheet>
          
          <h1 className="text-lg font-bold">Week Todo</h1>
          
          {selectedListId ? (
            <button
              onClick={() => setSelectedListId(undefined)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ListIcon size={20} />
            </button>
          ) : (
            <div className="w-[28px]"></div>
          )}
        </div>
        
        {selectedListId ? (
          <div className="flex-1 overflow-hidden">
            <div className="h-full p-4 overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">
                {lists.find(list => list.id === selectedListId)?.name || 'List'}
              </h2>
              
              {tasks
                .filter(task => task.listId === selectedListId)
                .map((task, index) => (
                  <React.Fragment key={task.id}>
                    <TaskItem
                      task={task}
                      onToggleComplete={handleToggleComplete}
                      onDelete={handleDeleteTask}
                      onEdit={handleEditTask}
                    />
                    {index < tasks.filter(t => t.listId === selectedListId).length - 1 && (
                      <div className="px-2 py-1">
                        <Separator className="border-dashed opacity-40" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              
              {tasks.filter(task => task.listId === selectedListId).length === 0 && (
                <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                  <p>No tasks in this list yet</p>
                  <p>Tap the + button to add a task</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <WeekHeader currentDate={currentDate} />
            
            <div className="flex flex-1 overflow-hidden">
              {daysOfWeek.map((day) => (
                <DayColumn
                  key={day}
                  day={day}
                  tasks={tasks.filter(task => task.day === day && !task.listId)}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                  onMoveTask={handleMoveTask}
                />
              ))}
            </div>
          </>
        )}

        {/* Floating Action Button */}
        <button 
          onClick={() => {
            setSelectedDay(undefined);
            setEditingTask(null);
            setFormVisible(true);
          }}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary dark:bg-primary-dark text-white dark:text-black flex items-center justify-center shadow-lg hover:bg-primary/90 dark:hover:bg-primary-dark/90"
        >
          <Plus size={24} />
        </button>
        
        {/* Background overlay when form is visible */}
        {formVisible && (
          <div 
            className="fixed inset-0 bg-black/40 dark:bg-black/60 z-10"
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
          inCustomList={!!selectedListId}
        />
      </div>
    </DndProvider>
  );
};

export default Index;
