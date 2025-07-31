import prismaClient from 'src/prisma';

import { Project } from '../../Project.entity';
import { IProjectRepository } from '../IProjectRepository';
import { CreateProjectDto } from '../../dto/CreateProject.dto';

export class ProjectRepositoryPrisma implements IProjectRepository {
  async create(data: CreateProjectDto): Promise<Project> {
    return prismaClient.project.create({
      data,
      include: { geometry: true, status: true },
    });
  }

  async findById(id: string): Promise<Project | null> {
    return prismaClient.project.findUnique({
      where: { id },
      include: { geometry: true, status: true },
    });
  }

  async findAll(): Promise<Project[]> {
    return prismaClient.project.findMany({
      include: { geometry: true, status: true },
    });
  }

  async findByName(name: string): Promise<Project | null> {
    return prismaClient.project.findUnique({
      where: { name },
      include: { geometry: true, status: true },
    });
  }
}
