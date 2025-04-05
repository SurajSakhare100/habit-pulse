import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Feedback from "@/models/Feedback";
import FeedbackVote from "@/models/FeedbackVote"; // new

export async function POST(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const feedbackId = params.id;

  try {
    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
    }

    const existingVote = await FeedbackVote.findOne({ feedbackId, userId });

    if (existingVote) {
      // Remove vote
      await existingVote.deleteOne();
      feedback.upvotes = Math.max(feedback.upvotes - 1, 0);
    } else {
      // Add vote
      await FeedbackVote.create({ feedbackId, userId });
      feedback.upvotes += 1;
    }

    await feedback.save();

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Upvote error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
