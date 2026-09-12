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

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Mentor' | 'Admin';
  headline: string;
  bio: string;
  avatarUrl: string;
  skillsOffered: string[];
  skillsWanted: string[];
  rating: number;
  sessionsCompleted: number;
}

export interface SystemHealth {
  status: string;
  service: string;
  environment: string;
  version: string;
  uptimeSeconds: number;
  timestamp: string;
  system: {
    nodeVersion: string;
    platform: string;
    memoryRssMb: number;
    memoryHeapUsedMb: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: Record<string, any>;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}
