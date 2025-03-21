import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import HabitModel, { IHabitLog } from "@/models/Habit";

export async function GET(
  request: NextRequest,
  { params }: { params: { id?: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();
    const id = await params.id;
    const habit = await HabitModel.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!habit) {
      return new NextResponse("Habit not found", { status: 404 });
    }

    return NextResponse.json(habit);
  } catch (error) {
    console.error("Error in GET /api/habits/[id]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id?: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    // Validate goal frequency if it's being updated
    if (body.goal?.frequency !== undefined) {
      const frequency = body.goal.frequency;
      if (!Number.isInteger(frequency) || frequency < 1 || frequency > 7) {
        return new NextResponse("Goal frequency must be a whole number between 1 and 7", { status: 400 });
      }
    }

    await dbConnect();
    const id = await params.id;

    const habit = await HabitModel.findOneAndUpdate(
      {
        _id: id,
        userId: session.user.id,
      },
      { $set: { ...body, updatedAt: new Date() } },
      { new: true }
    );

    if (!habit) {
      return new NextResponse("Habit not found", { status: 404 });
    }

    return NextResponse.json(habit);
  } catch (error) {
    console.error("Error in PUT /api/habits/[id]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id?: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { date, status } = await request.json();
    await dbConnect();
    const id = await params.id;

    const habit = await HabitModel.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!habit) {
      return new NextResponse("Habit not found", { status: 404 });
    }

    // Update or add the log entry
    const existingLogIndex = habit.logs.findIndex((log: IHabitLog) => log.date === date);
    if (existingLogIndex !== -1) {
      habit.logs[existingLogIndex].status = status;
    } else {
      habit.logs.push({ date, status });
    }

    await HabitModel.updateOne({ _id: id, userId: session.user.id }, { $set: { logs: habit.logs } });

    return NextResponse.json(habit);
  } catch (error) {
    console.error("Error in POST /api/habits/[id]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id?: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();
    const id = await params.id;
    const habit = await HabitModel.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!habit) {
      return new NextResponse("Habit not found", { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error in DELETE /api/habits/[id]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}