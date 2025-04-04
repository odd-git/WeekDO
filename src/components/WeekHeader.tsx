
import React from 'react';
import { format, startOfWeek, addDays } from 'date-fns';

interface WeekHeaderProps {
  currentDate: Date;
}

const WeekHeader: React.FC<WeekHeaderProps> = ({ currentDate }) => {
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  
  // Generate days of the week
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(startOfCurrentWeek, i);
    const dayName = format(day, 'EEE');
    const dayNumber = format(day, 'd');
    const isToday = format(currentDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    
    return { dayName, dayNumber, date: day, isToday };
  });

  return (
    <div className="bg-white sticky top-0 z-10 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-lg font-bold">Week Todo</h1>
        <div className="text-sm text-muted-foreground">
          {format(startOfCurrentWeek, 'MMM d')} - {format(addDays(startOfCurrentWeek, 6), 'MMM d, yyyy')}
        </div>
      </div>
      <div className="flex border-b">
        {daysOfWeek.map((day) => (
          <div key={day.dayNumber} className="day-column">
            <div className={`day-header ${day.isToday ? 'bg-primary/10 text-primary' : ''}`}>
              <span className="text-xs">{day.dayName}</span>
              <span className={`${day.isToday ? 'h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center' : ''}`}>
                {day.dayNumber}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekHeader;
