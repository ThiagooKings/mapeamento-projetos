import prismaClient from 'src/prisma';
import { CreateProjectDto } from '../../dto/CreateProject.dto';
import { Project } from '../../Project.entity';
import { IProjectRepository } from '../IProjectRepository';

export class ProjectRepositoryPrisma implements IProjectRepository {
  async create(data: CreateProjectDto): Promise<Project> {
    return prismaClient.project.create({
      data,
      include: { geometry: true, status: true },
    });
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
