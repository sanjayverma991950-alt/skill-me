import { Request, Response, NextFunction } from 'express';
import { skillsService, SkillsService } from './skills.service.js';
import { createSuccessResponse } from '../../types/apiResponse.js';

export class SkillsController {
  constructor(private readonly service: SkillsService = skillsService) {}

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const skills = await this.service.getAllSkills(req.query);
      res.status(200).json(
        createSuccessResponse(skills, 'Skills retrieved successfully', { total: skills.length })
      );
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const skill = await this.service.getSkillById(req.params.id as string);
      res.status(200).json(createSuccessResponse(skill, 'Skill retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const created = await this.service.createSkill(req.body);
      res.status(201).json(createSuccessResponse(created, 'Skill created successfully'));
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updated = await this.service.updateSkill(req.params.id as string, req.body);
      res.status(200).json(createSuccessResponse(updated, 'Skill updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.service.deleteSkill(req.params.id as string);
      res.status(200).json(createSuccessResponse(null, 'Skill deleted successfully'));
    } catch (error) {
      next(error);
    }
  };
}

export const skillsController = new SkillsController();
