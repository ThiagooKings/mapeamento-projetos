import { Inject, Injectable } from '@nestjs/common';
import { IProjectRepository } from '../repositories/IProjectRepository';
import { IGeometryRepository } from 'src/modules/geometry/repositories/IGeometryRepository';

import { Project } from '../Project.entity';
import { CreateProjectRequest } from '../project.controller';

@Injectable()
export class CreateProjectService {
  constructor(
    @Inject('IProjectRepository')
    private readonly projectRepository: IProjectRepository,
    @Inject('IGeometryRepository')
    private readonly geometryRepository: IGeometryRepository,
  ) {}

  async create({
    name,
    responsible,
    statusId,
    geometry,
  }: CreateProjectRequest): Promise<Project> {
    const createGeometry = await this.geometryRepository.create(geometry);

    return this.projectRepository.create({
      name,
      responsible,
      statusId,
      geometryId: createGeometry.id,
    });
  }
}
