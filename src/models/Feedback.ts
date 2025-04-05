import mongoose, { Schema, model, models } from 'mongoose';

const FeedbackSchema = new Schema({
  content: { type: String, required: true },
  userId: { type: String, required: true },
  upvotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Feedback = models.Feedback || model('Feedback', FeedbackSchema);
export default Feedback;