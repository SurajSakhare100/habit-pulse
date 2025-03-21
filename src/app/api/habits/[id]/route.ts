import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import HabitModel from "@/models/Habit";

interface RouteParams {
  params: { id: string };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }


    await dbConnect();
    const { id } = params;
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
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    await dbConnect();
    const { id } = params;

    const habit = await HabitModel.findOneAndUpdate(
      {
        _id: id,
        userId: session.user.id,
      },
      { $set: body },
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
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { date, status } = await request.json();
    await dbConnect();
    const { id } = params;

    const habit = await HabitModel.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!habit) {
      return new NextResponse("Habit not found", { status: 404 });
    }

    const existingLogIndex = habit.logs.findIndex((log: { date: string }) => log.date === date);
    if (existingLogIndex !== -1) {
      habit.logs[existingLogIndex].status = !habit.logs[existingLogIndex].status;
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
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();
    const { id } = params;
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