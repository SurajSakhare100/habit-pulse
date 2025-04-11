import { useState } from 'react';
import { Expand, ChevronDown, ChevronUp } from 'lucide-react';
import HabitComponent from './HabitComponent';

interface Habit {
  id: string;
  name: string;
  streak: number;
  consistency: number;
  checkIns: number;
  data: {
    date: string;
    completed: boolean;
  }[];
  emoji: string;
}

interface HabitListProps {
  habits: Habit[];
}

// Sample data
const habits: Habit[] = [
  {
    id: '1',
    name: 'Exercise',
    streak: 5,
    consistency: 80,
    checkIns: 12,
    emoji: '💪',
    data: [
      { date: '2024-01-01', completed: true },
      { date: '2024-01-02', completed: true },
      { date: '2024-01-03', completed: false },
      { date: '2024-01-04', completed: true },
      { date: '2024-01-05', completed: true },
    ]
  },
  {
    id: '2', 
    name: 'Read',
    streak: 3,
    consistency: 65,
    checkIns: 8,
    emoji: '📚',
    data: [
      { date: '2024-01-01', completed: true },
      { date: '2024-01-02', completed: false },
      { date: '2024-01-03', completed: true },
      { date: '2024-01-04', completed: true },
      { date: '2024-01-05', completed: false },
    ]
  },
  {
    id: '3',
    name: 'Meditate',
    streak: 10,
    consistency: 90,
    checkIns: 15,
    emoji: '🧘',
    data: [
      { date: '2024-01-01', completed: true },
      { date: '2024-01-02', completed: true },
      { date: '2024-01-03', completed: true },
      { date: '2024-01-04', completed: true },
      { date: '2024-01-05', completed: true },
    ]
  }
];

const HabitList = () => {
  const [expandedHabits, setExpandedHabits] = useState<Set<string>>(new Set());

  const toggleExpand = (habitId: string) => {
    setExpandedHabits(prev => {
      const newSet = new Set(prev);
      if (newSet.has(habitId)) {
        newSet.delete(habitId);
      } else {
        newSet.add(habitId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-4 w-full max-w-3xl mx-auto p-4">
      {habits.map((habit) => (
       <HabitComponent key={habit.id} {...habit} />
      ))}
    </div>
  );
};

export default HabitList; 