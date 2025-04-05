// models/FeedbackVote.ts

import mongoose from "mongoose";

const FeedbackVoteSchema = new mongoose.Schema({
  feedbackId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Feedback",
  },
  userId: {
    type: String, // or ObjectId if your users are stored that way
    required: true,
  },
});

FeedbackVoteSchema.index({ feedbackId: 1, userId: 1 }, { unique: true }); // Prevent duplicate votes

export default mongoose.models.FeedbackVote || mongoose.model("FeedbackVote", FeedbackVoteSchema);
export type FeedbackVote = {
  feedbackId: string;
  userId: string;
};