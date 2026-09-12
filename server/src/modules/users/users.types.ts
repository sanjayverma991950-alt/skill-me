export type UserRole = 'Student' | 'Mentor' | 'Admin';

export interface User {
  id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  role?: UserRole;
  headline: string;
  bio?: string;
  skillsOffered?: string[];
  skillsWanted?: string[];
}

export interface UpdateUserDTO {
  name?: string;
  headline?: string;
  bio?: string;
  skillsOffered?: string[];
  skillsWanted?: string[];
}
