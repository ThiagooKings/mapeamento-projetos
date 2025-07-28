import { BadRequestException, Inject } from '@nestjs/common';
import { Project } from '../Project.entity';
import { IProjectRepository } from '../repositories/IProjectRepository';

export class FindByNameProjectService {
  constructor(
    @Inject('IProjectRepository')
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(name: string): Promise<Project | null> {
    const project = await this.projectRepository.findByName(name);

    if (!project) {
      throw new BadRequestException(
        `Project with name '${name}' does not exist.`,
      );
    }

    return project;
  }
}
