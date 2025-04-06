import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true,
  },
  date: {
    type: String, // format: 'YYYY-MM-DD'
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  updatedAt: { type: Date, default: Date.now },
});

NoteSchema.index({ habitId: 1, date: 1 }, { unique: true });

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
