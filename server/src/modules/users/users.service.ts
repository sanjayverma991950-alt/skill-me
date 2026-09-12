import { IUserRepository, userRepository } from './users.repository.js';
import { User, CreateUserDTO, UpdateUserDTO, UserRole } from './users.types.js';
import { NotFoundError, ConflictError } from '../../errors/AppError.js';

export class UsersService {
  constructor(private readonly repository: IUserRepository = userRepository) {}

  public async getAllUsers(filters?: { role?: UserRole; skill?: string; search?: string }): Promise<User[]> {
    return this.repository.findAll(filters);
  }

  public async getUserById(id: string): Promise<User> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new NotFoundError(`User with ID '${id}' was not found.`);
    }
    return user;
  }

  public async createUser(dto: CreateUserDTO): Promise<User> {
    const existing = await this.repository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictError(`A user with email '${dto.email}' already exists.`);
    }
    return this.repository.create(dto);
  }

  public async updateUser(id: string, dto: UpdateUserDTO): Promise<User> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`User with ID '${id}' was not found.`);
    }

    const updated = await this.repository.update(id, dto);
    if (!updated) {
      throw new NotFoundError(`User with ID '${id}' could not be updated.`);
    }

    return updated;
  }

  public async deleteUser(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`User with ID '${id}' was not found.`);
    }
    await this.repository.delete(id);
  }
}

export const usersService = new UsersService();
