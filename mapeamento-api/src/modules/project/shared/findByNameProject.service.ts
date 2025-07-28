import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { Project } from '../Project.entity';
import { IProjectRepository } from '../repositories/IProjectRepository';

export class FindByNameProjectService {
  constructor(
    @Inject('IProjectRepository')
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(name: string): Promise<Project | null> {
    if (!name) {
      throw new BadRequestException('Project name is required.');
    }

    const project = await this.projectRepository.findByName(name);

    if (!project) {
      throw new NotFoundException(
        `Project with name '${name}' does not found.`,
      );
    }

    return project;
  }
}
