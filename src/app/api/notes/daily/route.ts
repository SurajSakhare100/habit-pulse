import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import { Note } from '@/models/Note';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const habitId = searchParams.get('habitId');
    const date = searchParams.get('date');

    if (!habitId) {
      return NextResponse.json({ error: 'habitId is required' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const notes = await Note.find({ 
      habitId,
      userId: user._id,
      ...(date ? { date: new Date(date) } : {})
    }).sort({ date: -1 });

    return NextResponse.json(notes);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const habitId = searchParams.get('habitId');
    const date = searchParams.get('date');

    if (!habitId || !date) {
      return NextResponse.json({ error: 'habitId and date are required' }, { status: 400 });
    }

    const { content } = await request.json();
    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // Prevent future date entries
    const now = new Date();
    const inputDate = new Date(date);
    if (inputDate > now) {
      return NextResponse.json({ error: 'Cannot add notes for future dates' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const existing = await Note.findOne({ 
      habitId, 
      date: inputDate,
      userId: user._id 
    });
    
    if (existing) {
      return NextResponse.json({ error: 'Note already exists' }, { status: 409 });
    }

    const newNote = await Note.create({
      title: `Note for ${new Date(date).toLocaleDateString()}`,
      content,
      date: inputDate,
      userId: user._id,
      habitId
    });

    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const habitId = searchParams.get('habitId');
    const date = searchParams.get('date');

    if (!habitId || !date) {
      return NextResponse.json({ error: 'habitId and date are required' }, { status: 400 });
    }

    const { content } = await request.json();
    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updated = await Note.findOneAndUpdate(
      { 
        habitId, 
        date: new Date(date),
        userId: user._id 
      },
      { 
        content,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const habitId = searchParams.get('habitId');
    const date = searchParams.get('date');

    if (!habitId || !date) {
      return NextResponse.json({ error: 'habitId and date are required' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const deleted = await Note.findOneAndDelete({ 
      habitId, 
      date: new Date(date),
      userId: user._id 
    });

    if (!deleted) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
