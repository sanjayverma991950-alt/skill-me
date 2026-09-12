import { z } from 'zod';

export const userRoleEnum = z.enum(['Student', 'Mentor', 'Admin']);

export const createUserSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Invalid email address format'),
  role: userRoleEnum.default('Student'),
  headline: z
    .string({ required_error: 'Headline is required' })
    .trim()
    .min(3, 'Headline must be at least 3 characters')
    .max(100, 'Headline cannot exceed 100 characters'),
  bio: z.string().trim().max(500, 'Bio cannot exceed 500 characters').default(''),
  skillsOffered: z.array(z.string().trim()).default([]),
  skillsWanted: z.array(z.string().trim()).default([]),
});

export const updateUserSchema = createUserSchema.omit({ email: true }).partial();

export const getUserByIdSchema = z.object({
  id: z.string().uuid('User ID must be a valid UUID'),
});

export const listUsersQuerySchema = z.object({
  role: userRoleEnum.optional(),
  skill: z.string().optional(),
  search: z.string().optional(),
});
