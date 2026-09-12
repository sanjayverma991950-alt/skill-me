import { ISkillRepository, skillRepository } from './skills.repository.js';
import { Skill, CreateSkillDTO, UpdateSkillDTO, SkillFilterQuery } from './skills.types.js';
import { NotFoundError, ConflictError } from '../../errors/AppError.js';

export class SkillsService {
  constructor(private readonly repository: ISkillRepository = skillRepository) {}

  public async getAllSkills(filters?: SkillFilterQuery): Promise<Skill[]> {
    return this.repository.findAll(filters);
  }

  public async getSkillById(id: string): Promise<Skill> {
    const skill = await this.repository.findById(id);
    if (!skill) {
      throw new NotFoundError(`Skill with ID '${id}' was not found.`);
    }
    return skill;
  }

  public async createSkill(dto: CreateSkillDTO): Promise<Skill> {
    const slug = dto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existing = await this.repository.findBySlug(slug);

    if (existing) {
      throw new ConflictError(`A skill with title '${dto.title}' already exists.`);
    }

    return this.repository.create(dto);
  }

  public async updateSkill(id: string, dto: UpdateSkillDTO): Promise<Skill> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Skill with ID '${id}' was not found.`);
    }

    const updated = await this.repository.update(id, dto);
    if (!updated) {
      throw new NotFoundError(`Skill with ID '${id}' could not be updated.`);
    }

    return updated;
  }

  public async deleteSkill(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Skill with ID '${id}' was not found.`);
    }

    await this.repository.delete(id);
  }
}

export const skillsService = new SkillsService();
