import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Feedback from '@/models/Feedback';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, description } = await req.json();
  
  if (!title || !description) {
    return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
  }

  await dbConnect();

  const feedback = await Feedback.findOneAndUpdate(
    { _id: params.id, userId: session.user.id },
    { 
      title,
      description,
      updatedAt: new Date() 
    },
    { new: true }
  );

  if (!feedback) return NextResponse.json({ error: 'Not found or forbidden' }, { status: 403 });
  return NextResponse.json(feedback);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const result = await Feedback.deleteOne({ _id: params.id, userId: session.user.id });
  if (result.deletedCount === 0) return NextResponse.json({ error: 'Not found or forbidden' }, { status: 403 });

  return NextResponse.json({ success: true });
}