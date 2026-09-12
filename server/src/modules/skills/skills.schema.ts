import { z } from 'zod';

export const skillLevelEnum = z.enum(['Beginner', 'Intermediate', 'Advanced', 'All Levels']);

export const createSkillSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z
    .string({ required_error: 'Description is required' })
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description cannot exceed 1000 characters'),
  category: z
    .string({ required_error: 'Category is required' })
    .trim()
    .min(2, 'Category must be at least 2 characters'),
  level: skillLevelEnum.default('All Levels'),
  tags: z.array(z.string().trim().min(1)).min(1, 'Provide at least one tag').default(['General']),
  featured: z.boolean().default(false),
});

export const updateSkillSchema = createSkillSchema.partial();

export const getSkillByIdSchema = z.object({
  id: z.string().uuid('Skill ID must be a valid UUID'),
});

export const listSkillsQuerySchema = z.object({
  category: z.string().optional(),
  level: skillLevelEnum.optional(),
  search: z.string().optional(),
  featured: z
    .string()
    .optional()
    .transform((val) => (val === 'true' ? true : val === 'false' ? false : undefined)),
});
