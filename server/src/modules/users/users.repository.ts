import { User, CreateUserDTO, UpdateUserDTO, UserRole } from './users.types.js';

export interface IUserRepository {
  findAll(filters?: { role?: UserRole; skill?: string; search?: string }): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(dto: CreateUserDTO): Promise<User>;
  update(id: string, dto: UpdateUserDTO): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}

const INITIAL_USERS: User[] = [
  {
    id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    role: 'Mentor',
    headline: 'Senior Full-Stack Architect @ FinTech | React & Node Specialist',
    bio: 'Passionate about building scalable distributed systems and mentoring ambitious developers.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    skillsOffered: ['React', 'TypeScript', 'Node.js', 'System Design'],
    skillsWanted: ['Rust', 'WebAssembly'],
    rating: 4.9,
    sessionsCompleted: 42,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    role: 'Mentor',
    headline: 'Cloud Systems Engineer & Open Source Contributor',
    bio: 'Helping engineers conquer backend concurrency, Docker containerization, and PostgreSQL.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    skillsOffered: ['PostgreSQL', 'Docker', 'Go', 'Express'],
    skillsWanted: ['GraphQL', 'Kubernetes'],
    rating: 4.8,
    sessionsCompleted: 28,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [...INITIAL_USERS];

  public async findAll(filters?: { role?: UserRole; skill?: string; search?: string }): Promise<User[]> {
    let result = [...this.users];

    if (filters?.role) {
      result = result.filter((u) => u.role === filters.role);
    }

    if (filters?.skill) {
      const q = filters.skill.toLowerCase();
      result = result.filter((u) =>
        u.skillsOffered.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.headline.toLowerCase().includes(q) ||
          u.bio.toLowerCase().includes(q)
      );
    }

    return result;
  }

  public async findById(id: string): Promise<User | null> {
    const found = this.users.find((u) => u.id === id);
    return found ? { ...found } : null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const found = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    return found ? { ...found } : null;
  }

  public async create(dto: CreateUserDTO): Promise<User> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const newUser: User = {
      id,
      name: dto.name,
      email: dto.email,
      role: dto.role || 'Student',
      headline: dto.headline,
      bio: dto.bio || '',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(dto.name)}`,
      skillsOffered: dto.skillsOffered || [],
      skillsWanted: dto.skillsWanted || [],
      rating: 5.0,
      sessionsCompleted: 0,
      createdAt: now,
      updatedAt: now,
    };

    this.users.push(newUser);
    return { ...newUser };
  }

  public async update(id: string, dto: UpdateUserDTO): Promise<User | null> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    const existing = this.users[index];
    const updated: User = {
      ...existing,
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    this.users[index] = updated;
    return { ...updated };
  }

  public async delete(id: string): Promise<boolean> {
    const len = this.users.length;
    this.users = this.users.filter((u) => u.id !== id);
    return this.users.length < len;
  }
}

export const userRepository = new InMemoryUserRepository();
