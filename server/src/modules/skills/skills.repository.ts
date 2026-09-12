import { Skill, CreateSkillDTO, UpdateSkillDTO, SkillFilterQuery } from './skills.types.js';

export interface ISkillRepository {
  findAll(filters?: SkillFilterQuery): Promise<Skill[]>;
  findById(id: string): Promise<Skill | null>;
  findBySlug(slug: string): Promise<Skill | null>;
  create(dto: CreateSkillDTO): Promise<Skill>;
  update(id: string, dto: UpdateSkillDTO): Promise<Skill | null>;
  delete(id: string): Promise<boolean>;
}

// Initial seed skills representing realistic full-stack domain entities
const INITIAL_SKILLS: Skill[] = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    title: 'Full-Stack TypeScript & React Architecture',
    slug: 'full-stack-typescript-react-architecture',
    description: 'Master modular system design, enterprise state management, clean architecture, and type-safe API patterns.',
    category: 'Web Development',
    level: 'Advanced',
    tags: ['TypeScript', 'React', 'Architecture', 'Clean Code'],
    mentorsCount: 14,
    studentsCount: 320,
    featured: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'c9a646d3-9c61-4cd7-bf11-c9725f4e7c70',
    title: 'Node.js Microservices & Resilient APIs',
    slug: 'nodejs-microservices-resilient-apis',
    description: 'Build fault-tolerant REST and Event-driven microservices with Docker, Redis caching, and circuit breakers.',
    category: 'Backend Engineering',
    level: 'Intermediate',
    tags: ['Node.js', 'Express', 'Microservices', 'Docker'],
    mentorsCount: 9,
    studentsCount: 215,
    featured: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    title: 'PostgreSQL Database Modeling & Optimization',
    slug: 'postgresql-database-modeling-optimization',
    description: 'Relational schema normalization, complex SQL indexing, query profiling, and ACID transaction safety.',
    category: 'Database Systems',
    level: 'Intermediate',
    tags: ['PostgreSQL', 'SQL', 'Prisma', 'Database Optimization'],
    mentorsCount: 6,
    studentsCount: 180,
    featured: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export class InMemorySkillRepository implements ISkillRepository {
  private skills: Skill[] = [...INITIAL_SKILLS];

  public async findAll(filters?: SkillFilterQuery): Promise<Skill[]> {
    let result = [...this.skills];

    if (filters?.category) {
      const cat = filters.category.toLowerCase();
      result = result.filter((s) => s.category.toLowerCase().includes(cat));
    }

    if (filters?.level) {
      result = result.filter((s) => s.level === filters.level);
    }

    if (filters?.featured !== undefined) {
      result = result.filter((s) => s.featured === filters.featured);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }

  public async findById(id: string): Promise<Skill | null> {
    const found = this.skills.find((s) => s.id === id);
    return found ? { ...found } : null;
  }

  public async findBySlug(slug: string): Promise<Skill | null> {
    const found = this.skills.find((s) => s.slug === slug);
    return found ? { ...found } : null;
  }

  public async create(dto: CreateSkillDTO): Promise<Skill> {
    const id = crypto.randomUUID();
    const slug = dto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const now = new Date().toISOString();

    const newSkill: Skill = {
      id,
      title: dto.title,
      slug,
      description: dto.description,
      category: dto.category,
      level: dto.level || 'All Levels',
      tags: dto.tags || ['General'],
      mentorsCount: 1,
      studentsCount: 0,
      featured: dto.featured ?? false,
      createdAt: now,
      updatedAt: now,
    };

    this.skills.push(newSkill);
    return { ...newSkill };
  }

  public async update(id: string, dto: UpdateSkillDTO): Promise<Skill | null> {
    const index = this.skills.findIndex((s) => s.id === id);
    if (index === -1) return null;

    const existing = this.skills[index];
    const updated: Skill = {
      ...existing,
      ...dto,
      slug: dto.title
        ? dto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : existing.slug,
      updatedAt: new Date().toISOString(),
    };

    this.skills[index] = updated;
    return { ...updated };
  }

  public async delete(id: string): Promise<boolean> {
    const initialLen = this.skills.length;
    this.skills = this.skills.filter((s) => s.id !== id);
    return this.skills.length < initialLen;
  }
}

export const skillRepository = new InMemorySkillRepository();
