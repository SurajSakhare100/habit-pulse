// src/app/api/habits/week-completion/route.js
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import HabitModel from '@/models/Habit';

interface Log {
  date: string;
  status: boolean;
}

interface Habit {
  userId: string;
  logs: Log[];
}

interface DayData {
  completed: number;
  total: number;
}

interface WeekDay {
  date: string;
  day: string;
  dayNum: number;
  completionRate: number;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await dbConnect();
    const habits = await HabitModel.find({ userId: session.user.id }).lean();
    if (!habits.length) {
      return NextResponse.json(getEmptyWeek(), { status: 200 });
    }

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    // Aggregate logs by date
    const logsByDate: Record<string, DayData> = {};
    habits.forEach((habit) => {
      if (habit.logs) {
        habit.logs.forEach((log:any) => {
          const logDate = log.date.split('T')[0]; 
          logsByDate[logDate] = logsByDate[logDate] || { completed: 0, total: 0 };
          logsByDate[logDate].total += 1;
          if (log.status) logsByDate[logDate].completed += 1;
        });
      }
    });

    // Build week data
    const weekData: WeekDay[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      const dayData = logsByDate[dateStr] || { completed: 0, total: habits.length };
      const completionRate = dayData.total > 0 ? (dayData.completed / dayData.total) * 100 : 0;

      weekData.push({
        date: dateStr,
        day: date.toLocaleDateString('en-US', {  timeZone: 'Asia/Kolkata', 
          weekday: 'short'}).toUpperCase(),
        dayNum: date.getDate(),
        completionRate: Math.round(completionRate),
      });
    }

    return NextResponse.json(weekData, { status: 200 });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

function getEmptyWeek(): WeekDay[] {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()+1);
  startOfWeek.setHours(0, 0, 0, 0);

  const days: WeekDay[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    days.push({
      date: dateStr,
      day: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      dayNum: date.getDate(),
      completionRate: 0,
    });
  }
  return days;
}
