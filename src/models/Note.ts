import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  time: {
    type: String,
    required: true,
    default: () => new Date().toLocaleTimeString()
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add index for faster queries
noteSchema.index({ userId: 1, date: -1 });
noteSchema.index({ habitId: 1, date: -1 });

export const Note = mongoose.models.Note || mongoose.model('Note', noteSchema);
