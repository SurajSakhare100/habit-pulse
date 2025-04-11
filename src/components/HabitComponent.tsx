import { useState, useEffect, useMemo } from 'react';
import { MoreVertical, ChevronDown, ChevronUp, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import {
  eachDayOfInterval,
  format,
  subMonths,
  isSameDay,
  startOfMonth,
  endOfMonth,
  getDay,
  isToday,
  isBefore,
  addDays,
  subYears,
  addMonths,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import confetti from 'canvas-confetti';

interface HabitProps {
  name: string;
  streak: number;
  consistency: number;
  checkIns: number;
  data: {
    date: string;
    completed: boolean;
  }[];
  onAddRecord?: (date: string, completed: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

const HabitComponent = ({
  name = "Workout",
  streak = 0,
  consistency = 1,
  checkIns = 1,
  data = [],
  onAddRecord,
  onEdit,
  onDelete,
}: HabitProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [todayChecked, setTodayChecked] = useState(false);
  
  const currentDate = useMemo(() => new Date(), []);
  const startDate = subYears(currentDate, 1);

  // Check if a date has a completion record
  const isDateCompleted = (date: Date) => {
    return data.some(record => 
      isSameDay(new Date(record.date), date) && record.completed
    );
  };

  // Initialize today's checked state
  useEffect(() => {
    setTodayChecked(isDateCompleted(currentDate));
  }, [data, currentDate]);

  // Handle checkbox toggle with confetti
  const handleCheckboxToggle = () => {
    const newCheckedState = !todayChecked;
    setTodayChecked(newCheckedState);
    
    if (newCheckedState) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    
    onAddRecord?.(format(currentDate, 'yyyy-MM-dd'), newCheckedState);
  };

  // Generate calendar data
  const calendarData = useMemo(() => {
    const months = [];
    let date = currentDate;
    
    // Generate months in reverse order
    for (let i = 0; i < 12; i++) {
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
      
      months.push({
        label: format(date, 'MMM'),
        days: monthDays.reduce((acc: Date[][], day) => {
          const dayOfWeek = getDay(day);
          // Convert to 0-6 where 0 is Monday
          const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
          if (!acc[adjustedDay]) acc[adjustedDay] = [];
          if (!isBefore(currentDate, day)) {
            acc[adjustedDay].push(day);
          }
          return acc;
        }, Array(7).fill(null).map(() => []))
      });
      
      date = subMonths(date, 1);
    }

    return months.reverse();
  }, [currentDate]);

  return (
    <div className={cn(
      "bg-slate-900 rounded-lg p-6 transition-all duration-300",
      isExpanded ? "w-full max-w-4xl" : "w-full max-w-md"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <span className="text-yellow-500 text-2xl">💪</span>
          <h2 className="text-slate-200 text-xl font-semibold">{name}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCheckboxToggle}
            className={cn(
              "h-6 w-6 rounded border-2 transition-all duration-200 flex items-center justify-center",
              todayChecked 
                ? "border-green-500 bg-green-500" 
                : "border-slate-600 bg-transparent hover:bg-slate-800"
            )}
          >
            {todayChecked && (
              <Check className="h-4 w-4 text-white" />
            )}
          </button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleCheckboxToggle()} className="text-green-500">
                Add Record
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                Edit Habit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-red-500">
                Delete Habit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="text-center">
          <p className="text-3xl font-bold text-slate-200">{streak}</p>
          <p className="text-sm text-slate-400">Streak</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-slate-200">{consistency}%</p>
          <p className="text-sm text-slate-400">Consistency</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-slate-200">{checkIns}</p>
          <p className="text-sm text-slate-400">Check-ins</p>
        </div>
      </div>

      {/* Calendar Heatmap */}
      {isExpanded && (
        <div className="w-full">
          {/* Month labels */}
          <div className="grid grid-cols-[1.5rem_repeat(12,1fr)] gap-x-0 mb-1">
            <div /> {/* Spacer for day labels */}
            {calendarData.map(({ label }) => (
              <div key={label} className="text-xs text-slate-500 pl-0.5">{label}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="space-y-[2px]">
            {DAYS.map((day, dayIndex) => (
              <div key={day} className="grid grid-cols-[1.5rem_repeat(12,1fr)] gap-x-0">
                <div className="text-xs text-slate-500">{day}</div>
                {calendarData.map(({ days: monthDays }, monthIndex) => (
                  <div key={monthIndex} className="flex gap-[2px] px-0.5">
                    {monthDays[dayIndex].map((date) => (
                      <div
                        key={date.toISOString()}
                        className={cn(
                          "w-3 h-3 rounded-[2px]",
                          isDateCompleted(date) ? "bg-green-500" : "bg-red-900/50",
                          isToday(date) && "bg-green-500"
                        )}
                        title={format(date, 'PPP')}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitComponent;