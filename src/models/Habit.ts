import mongoose, { Schema, model, models } from 'mongoose';
import type { IUser } from './User';

export interface IHabitLog {
  date: string;
  status: boolean;
}

export interface IHabit {
  _id?: string;
  userId: mongoose.Types.ObjectId;
  user?: IUser;
  habitName: string;
  emoji: string;
  color: string;
  description?: string;
  goal: {
    frequency: number;  // times per week (1-7)
  };
  logs: IHabitLog[];
  createdAt: Date;
  updatedAt: Date;
}

const habitSchema = new Schema<IHabit>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    habitName: { type: String, required: true },
    emoji: { type: String, default: "✨" },
    color: { type: String, default: "#22c55e" },
    description: { type: String },
    goal: {
      frequency: { 
        type: Number, 
        default: 7,
        min: [1, 'Goal frequency must be at least 1'],
        max: [7, 'Goal frequency cannot exceed 7'],
        validate: {
          validator: Number.isInteger,
          message: 'Goal frequency must be a whole number'
        }
      },
    },
    logs: [
      {
        date: { type: String, required: true },
        status: { type: Boolean, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create compound index for userId and habitName
habitSchema.index({ userId: 1, habitName: 1 }, { unique: true });

export default models.Habit || model<IHabit>("Habit", habitSchema);