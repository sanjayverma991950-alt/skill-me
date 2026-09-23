import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from './users.types.js';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  role: UserRole;
  headline: string;
  bio: string;
  avatarUrl: string;
  skillsOffered: string[];
  skillsWanted: string[];
  rating: number;
  sessionsCompleted: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    role: {
      type: String,
      enum: ['Student', 'Mentor', 'Admin'],
      default: 'Student',
    },
    headline: { type: String, required: true },
    bio: { type: String, default: '' },
    avatarUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    },
    skillsOffered: { type: [String], default: [] },
    skillsWanted: { type: [String], default: [] },
    rating: { type: Number, default: 5.0 },
    sessionsCompleted: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, any>) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        ret.createdAt = ret.createdAt instanceof Date ? ret.createdAt.toISOString() : ret.createdAt;
        ret.updatedAt = ret.updatedAt instanceof Date ? ret.updatedAt.toISOString() : ret.updatedAt;
        return ret;
      },
    },
  }
);

export const UserModel = mongoose.model<IUserDocument>('User', userSchema);
