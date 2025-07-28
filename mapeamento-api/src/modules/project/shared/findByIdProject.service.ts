import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { Project } from '../Project.entity';
import { IProjectRepository } from '../repositories/IProjectRepository';

export class FindByIdProjectService {
  constructor(
    @Inject('IProjectRepository')
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(id: string): Promise<Project | null> {
    if (!id) {
      throw new BadRequestException('Project ID is required.');
    }

    const project = await this.projectRepository.findById(id);

    if (!project) {
      throw new NotFoundException(`Project does not found.`);
    }

    return project;
  }
}
