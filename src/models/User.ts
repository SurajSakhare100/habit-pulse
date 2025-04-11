import mongoose, { Schema, model, models } from "mongoose";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  image?: string;
  password?: string;
  emailVerified?: Date;
  isVerified?: boolean; // Persisted field
  authProvider: 'email' | 'google'; 
  isPro?: boolean;
  proSince?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: String,
    password: { type: String },
    emailVerified: Date,
    isVerified: { type: Boolean, default: false }, // Stored in DB
    authProvider: {
      type: String,
      required: true,
      enum: ['email', 'google'], 
    },
    isPro: { type: Boolean, default: false },
    proSince: Date,
  },
  {
    timestamps: true,
  }
);

export default models.User || model<IUser>("User", userSchema);
