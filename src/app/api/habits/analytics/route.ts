import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Habit, { IHabit, IHabitLog } from '@/models/Habit';
import { startOfWeek, endOfWeek, format, parseISO } from 'date-fns';
import mongoose from 'mongoose';
import { authOptions } from '@/lib/auth';

interface WeeklyDataPoint {
  day: string;
  value: number;
}

interface HabitStats {
  id: string;
  name: string;
  emoji: string;
  color: string;
  completions: number;
  goal: number;
  progress: number;
  weeklyData: WeeklyDataPoint[];
}

interface AnalyticsResponse {
  weeklyData: WeeklyDataPoint[];
  totalCompleted: number;
  averageScore: number;
  habits: HabitStats[];
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const date = new Date();
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Start week on Monday
    const end = endOfWeek(date, { weekStartsOn: 1 });

    // Get all habits for the user
    const habits = await Habit.find({ 
      userId: new mongoose.Types.ObjectId(session.user.id)
    }).lean();

    if (!habits || habits.length === 0) {
      return NextResponse.json({
        weeklyData: Array.from({ length: 7 }, (_, i) => ({
          day: format(new Date(start.getTime() + i * 24 * 60 * 60 * 1000), 'EEE'),
          value: 0
        })),
        totalCompleted: 0,
        averageScore: 0,
        habits: []
      });
    }

    // Calculate weekly data for all habits combined
    const weeklyData: WeeklyDataPoint[] = Array.from({ length: 7 }, (_, i) => {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      const dayStr = format(currentDate, 'EEE');
      const dateStr = format(currentDate, 'yyyy-MM-dd');

      // Count total completions for this day across all habits
      const value = habits.reduce((sum, habit) => {
        return sum + (habit.logs || []).filter((log: IHabitLog) => 
          log.date === dateStr && log.status
        ).length;
      }, 0);

      return { day: dayStr, value };
    });

    // Calculate individual habit statistics
    const habitStats: HabitStats[] = habits.map(habit => {
      const habitWeeklyData = Array.from({ length: 7 }, (_, i) => {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + i);
        const dayStr = format(currentDate, 'EEE');
        const dateStr = format(currentDate, 'yyyy-MM-dd');

        const value = (habit.logs || []).filter((log: IHabitLog) => 
          log.date === dateStr && log.status
        ).length;

        return { day: dayStr, value };
      });

      const completions = habitWeeklyData.reduce((sum, day) => sum + day.value, 0);
      const goalFrequency = habit.goal?.frequency || 7;
      const progress = (completions / goalFrequency) * 100;

      return {
        id: (habit as any)._id.toString(),
        name: habit.habitName || 'Untitled Habit',
        emoji: habit.emoji || '✨',
        color: habit.color || '#22c55e',
        completions,
        goal: goalFrequency,
        progress,
        weeklyData: habitWeeklyData
      };
    });

    // Calculate total completions and average score
    const totalCompleted = weeklyData.reduce((sum, day) => sum + day.value, 0);
    const totalPossibleCompletions = habits.reduce((sum, habit) => 
      sum + (habit.goal?.frequency || 7), 0
    );
    const averageScore = totalPossibleCompletions > 0 
      ? (totalCompleted / totalPossibleCompletions) * 100 
      : 0;

    const response: AnalyticsResponse = {
      weeklyData,
      totalCompleted,
      averageScore,
      habits: habitStats
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 