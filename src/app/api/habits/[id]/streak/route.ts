import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Habit from "@/models/Habit";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();

  const { id } = params;

  try {
    const habit = await Habit.findById(id);
    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    const logs = (habit.logs || [])
      .filter(log => log.status)
      .map(log => {
        const d = new Date(log.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime(); // simplify to timestamp
      })
      .sort((a, b) => a - b); // ascending

    const uniqueDates = Array.from(new Set(logs)); // remove any duplicates

    let maxStreak = 0;
    let currentStreak = 0;
    let tempStreak = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
      const diff = (uniqueDates[i] - uniqueDates[i - 1]) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        tempStreak++;
      } else {
        maxStreak = Math.max(maxStreak, tempStreak);
        tempStreak = 1;
      }
    }
    maxStreak = Math.max(maxStreak, tempStreak);

    // Calculate current streak
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let streakCount = 0;
    let day = today.getTime();

    while (uniqueDates.includes(day)) {
      streakCount++;
      day -= 86400000; // subtract 1 day
    }

    return NextResponse.json({ currentStreak: streakCount, maxStreak });
  } catch (error) {
    console.error("Error fetching streaks:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
