import { Request, Response, NextFunction } from 'express';
import { usersService, UsersService } from './users.service.js';
import { createSuccessResponse } from '../../types/apiResponse.js';

export class UsersController {
  constructor(private readonly service: UsersService = usersService) {}

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.service.getAllUsers(req.query as any);
      res.status(200).json(
        createSuccessResponse(users, 'Users retrieved successfully', { total: users.length })
      );
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.service.getUserById(req.params.id as string);
      res.status(200).json(createSuccessResponse(user, 'User retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.service.createUser(req.body);
      res.status(201).json(createSuccessResponse(user, 'User registered successfully'));
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.service.updateUser(req.params.id as string, req.body);
      res.status(200).json(createSuccessResponse(user, 'User profile updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.service.deleteUser(req.params.id as string);
      res.status(200).json(createSuccessResponse(null, 'User profile deleted successfully'));
    } catch (error) {
      next(error);
    }
  };
}

export const usersController = new UsersController();
