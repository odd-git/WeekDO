
import React, { useState } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface WeekHeaderProps {
  currentDate: Date;
  tasks?: Array<{ day: string }>;
  onDateSelect?: (date: Date) => void;
}

const WeekHeader: React.FC<WeekHeaderProps> = ({ currentDate, tasks = [], onDateSelect }) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  
  // Generate days of the week
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(startOfCurrentWeek, i);
    const dayName = format(day, 'EEE'); // Short weekday name
    const dayNumber = format(day, 'd');
    const isToday = format(currentDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    
    return { dayName, dayNumber, date: day, isToday };
  });

  // Create a set of dates that have tasks
  const datesWithTasks = new Set(
    tasks.map(task => {
      // Convert day name to date (this is an approximation)
      const dayIndex = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        .findIndex(d => d === task.day);
      if (dayIndex !== -1) {
        return format(addDays(startOfCurrentWeek, dayIndex), 'yyyy-MM-dd');
      }
      return null;
    }).filter(Boolean)
  );

  // Function to determine if a date has tasks
  const hasTasksOnDate = (date: Date) => {
    return datesWithTasks.has(format(date, 'yyyy-MM-dd'));
  };

  // Handle calendar date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date && onDateSelect) {
      onDateSelect(date);
      setCalendarOpen(false);
    }
  };

  return (
    <div className="bg-background dark:bg-gray-900 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-lg font-bold">Week Todo</h1>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            {format(startOfCurrentWeek, 'MMM d')} - {format(addDays(startOfCurrentWeek, 6), 'MMM d, yyyy')}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={() => setCalendarOpen(true)}
          >
            <CalendarIcon size={20} />
          </Button>
        </div>
      </div>
      <div className="flex border-b dark:border-gray-800">
        {daysOfWeek.map((day) => (
          <div key={day.dayNumber} className="day-column">
            <div className={`day-header ${day.isToday ? 'bg-primary/10 text-primary' : ''}`}>
              <span className="text-xs font-medium">{day.dayName}</span>
              <span className={`mt-1 ${day.isToday ? 'h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center' : ''}`}>
                {day.dayNumber}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Calendar View</DialogTitle>
          </DialogHeader>
          <div className="p-2">
            <Calendar
              mode="single"
              selected={currentDate}
              onSelect={handleDateSelect}
              modifiers={{
                hasTasks: (date) => hasTasksOnDate(date),
              }}
              modifiersClassNames={{
                hasTasks: 'bg-primary/20 font-bold',
              }}
              className="pointer-events-auto"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WeekHeader;
