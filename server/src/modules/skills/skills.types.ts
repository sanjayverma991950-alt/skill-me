export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export interface Skill {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  level: SkillLevel;
  tags: string[];
  mentorsCount: number;
  studentsCount: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSkillDTO {
  title: string;
  description: string;
  category: string;
  level?: SkillLevel;
  tags?: string[];
  featured?: boolean;
}

export interface UpdateSkillDTO {
  title?: string;
  description?: string;
  category?: string;
  level?: SkillLevel;
  tags?: string[];
  featured?: boolean;
}

export interface SkillFilterQuery {
  category?: string;
  level?: SkillLevel;
  search?: string;
  featured?: boolean;
}
