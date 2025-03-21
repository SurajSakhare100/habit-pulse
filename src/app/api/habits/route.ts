import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import HabitModel from "@/models/Habit";
import type { IHabit } from "@/models/Habit";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();
    const habits = await HabitModel.find({ userId: session.user.id });
    return NextResponse.json(habits);
  } catch (error) {
    console.error("Error in GET /api/habits:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    // Validate goal frequency
    const frequency = body.goal?.frequency;
    if (!Number.isInteger(frequency) || frequency < 1 || frequency > 7) {
      return new NextResponse("Goal frequency must be a whole number between 1 and 7", { status: 400 });
    }

    await dbConnect();

    const newHabit: IHabit = {
      ...body,
      userId: session.user.id,
      logs: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const habit = await HabitModel.create(newHabit);
    return NextResponse.json(habit, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/habits:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}