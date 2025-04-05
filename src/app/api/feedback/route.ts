
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

  const { content } = await req.json();
  await dbConnect();

  const feedback = await Feedback.create({
    content,
    userId: session.user.id,
  });

  return NextResponse.json(feedback);
}
