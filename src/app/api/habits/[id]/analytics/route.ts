import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Habit from '@/models/Habit';
import { subDays, format, isSameDay } from 'date-fns';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Get the specific habit
    const habit = await Habit.findOne({ 
      _id: params.id,
      // userId: session.user.id 
    });

    if (!habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
    }

    // Calculate weekly data
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      const dayName = format(date, 'EEE');
      const completed = habit.logs.some((log: any) => 
        isSameDay(new Date(log.date), date) && log.status
      );
      
      return {
        name: dayName,
        value: completed ? 1 : 0
      };
    }).reverse();

    // Calculate monthly data
    const monthlyData = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'MMM dd');
      const completed = habit.logs.some((log: any) => 
        isSameDay(new Date(log.date), date) && log.status
      );
      
      return {
        date: dateStr,
        value: completed ? 1 : 0
      };
    }).reverse();

    // Calculate streak data
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    
    for (let i = 0; i < 30; i++) {
      const date = subDays(new Date(), i);
      const hasCompleted = habit.logs.some((log: any) => 
        isSameDay(new Date(log.date), date) && log.status
      );
      
      if (hasCompleted) {
        tempStreak++;
        if (i === 0) currentStreak = tempStreak;
      } else {
        bestStreak = Math.max(bestStreak, tempStreak);
        tempStreak = 0;
      }
    }
    bestStreak = Math.max(bestStreak, tempStreak);

    // Calculate completion rate
    const totalLogs = habit.logs.length;
    const completedLogs = habit.logs.filter((log: any) => log.status).length;
    const completionRate = totalLogs > 0 
      ? Math.round((completedLogs / totalLogs) * 100) 
      : 0;

    // Calculate goal progress
    const goalProgress = {
      current: completedLogs,
      target: habit.goal.frequency * 4, // Assuming monthly goal
      frequency: habit.goal.frequency
    };
    console.log(goalProgress);

    return NextResponse.json({
      habit: {
        name: habit.habitName,
        emoji: habit.emoji,
        color: habit.color,
        description: habit.description
      },
      weeklyData,
      monthlyData,
      streaks: {
        current: currentStreak,
        best: bestStreak
      },
      completionRate,
      goalProgress,
      totalLogs,
      completedLogs
    });
  } catch (error) {
    console.error('Habit analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch habit analytics' },
      { status: 500 }
    );
  }
} 