import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Feedback from '@/models/Feedback';

export async function GET() {
  await dbConnect();
  const feedbacks = await Feedback.find().sort({ upvotes: -1 });
  return NextResponse.json(feedbacks);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, description } = await req.json();
  
  if (!title || !description) {
    return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
  }

  await dbConnect();

  const feedback = await Feedback.create({
    title,
    description,
    userId: session.user.id,
  });

  return NextResponse.json(feedback);
}
