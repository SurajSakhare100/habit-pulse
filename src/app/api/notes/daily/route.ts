import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Note from '@/models/Note';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const habitId = searchParams.get('habitId');
    const date = searchParams.get('date');

    if (!habitId) {
      return NextResponse.json({ error: 'habitId and date are required' }, { status: 400 });
    }

    await dbConnect();
    const note = await Note.find({ habitId });
    return NextResponse.json(note || null);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const existing = await Note.findOne({ habitId, date });
    if (existing) {
      return NextResponse.json({ error: 'Note already exists' }, { status: 409 });
    }

    const newNote = await Note.create({ habitId, date, content });
    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const habitId = searchParams.get('habitId');
    const date = searchParams.get('date');

    if (!habitId || !date) {
      return NextResponse.json({ error: 'habitId and date are required' }, { status: 400 });
    }

    const { updatedContent } = await request.json();
    if (!updatedContent) {
      return NextResponse.json({ error: 'updatedContent is required' }, { status: 400 });
    }

    await dbConnect();
    const updated = await Note.findOneAndUpdate(
      { habitId, date },
      { content: updatedContent, updatedAt: new Date() },
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
    const { searchParams } = new URL(request.url);
    const habitId = searchParams.get('habitId');
    const date = searchParams.get('date');

    if (!habitId || !date) {
      return NextResponse.json({ error: 'habitId and date are required' }, { status: 400 });
    }

    await dbConnect();
    await Note.findOneAndDelete({ habitId, date });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
