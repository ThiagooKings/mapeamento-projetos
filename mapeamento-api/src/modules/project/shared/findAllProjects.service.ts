import { Inject } from '@nestjs/common';
import { Project } from '../Project.entity';
import { IProjectRepository } from '../repositories/IProjectRepository';

export class FindAllProjectsService {
  constructor(
    @Inject('IProjectRepository')
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(): Promise<Project[]> {
    const projects = await this.projectRepository.findAll();

    return projects;
  }
}
