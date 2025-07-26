import prismaClient from 'src/prisma';
import { CreateProjectDto } from '../../dto/CreateProject.dto';
import { Project } from '../../Project.entity';
import { IProjectRepository } from '../IProjectRepository';

export class ProjectRepositoryPrisma implements IProjectRepository {
  // Implementation of the methods defined in IProjectRepository
  async create(data: CreateProjectDto): Promise<Project> {
    return prismaClient.project.create({ data });
  }

  async findById(id: string): Promise<Project | null> {
    return prismaClient.project.findUnique({ where: { id } });
  }

  async findAll(): Promise<Project[]> {
    return prismaClient.project.findMany();
  }

  async findByName(name: string): Promise<Project | null> {
    return prismaClient.project.findUnique({ where: { name } });
  }
}
