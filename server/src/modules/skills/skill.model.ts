import mongoose, { Schema, Document } from 'mongoose';
import { SkillLevel } from './skills.types.js';

export interface ISkillDocument extends Document {
  title: string;
  slug: string;
  description: string;
  category: string;
  level: SkillLevel;
  tags: string[];
  mentorsCount: number;
  studentsCount: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const skillSchema = new Schema<ISkillDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'All Levels',
    },
    tags: { type: [String], default: ['General'] },
    mentorsCount: { type: Number, default: 1 },
    studentsCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
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

export const SkillModel = mongoose.model<ISkillDocument>('Skill', skillSchema);
