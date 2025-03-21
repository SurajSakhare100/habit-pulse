import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import UserModel from "@/models/User";
import HabitModel, { IHabitLog } from "@/models/Habit";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();

    // Find or create user
    let user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      user = await UserModel.create({
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      });
    }

    // Get user's habits with stats
    const habits = await HabitModel.find({ userId: user._id });
    const habitStats = habits.map(habit => {
      const completedLogs = habit.logs.filter((log: IHabitLog) => log.status).length;
      const totalLogs = habit.logs.length;
      const completionRate = totalLogs > 0 ? (completedLogs / totalLogs) * 100 : 0;

      return {
        _id: habit._id,
        habitName: habit.habitName,
        emoji: habit.emoji,
        color: habit.color,
        completedLogs,
        totalLogs,
        completionRate: Math.round(completionRate),
      };
    });

    return NextResponse.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt,
      },
      stats: {
        totalHabits: habits.length,
        habits: habitStats,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/profile:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    await dbConnect();

    const user = await UserModel.findOneAndUpdate(
      { email: session.user.email },
      { $set: body },
      { new: true }
    );

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error in PUT /api/profile:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
