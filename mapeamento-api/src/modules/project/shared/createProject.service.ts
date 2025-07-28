import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { IProjectRepository } from '../repositories/IProjectRepository';
import { IGeometryRepository } from 'src/modules/geometry/repositories/IGeometryRepository';

import { Project } from '../Project.entity';
import { CreateProjectRequest } from '../project.controller';
import { IStatusRepository } from 'src/modules/status/repositories/IStatusRepository';

@Injectable()
export class CreateProjectService {
  constructor(
    @Inject('IProjectRepository')
    private readonly projectRepository: IProjectRepository,
    @Inject('IGeometryRepository')
    private readonly geometryRepository: IGeometryRepository,
    @Inject('IStatusRepository')
    private readonly statusRepository: IStatusRepository,
  ) {}

  async execute({
    name,
    responsible,
    status,
    geometry,
  }: CreateProjectRequest): Promise<Project> {
    if (!name || !responsible || !geometry) {
      throw new BadRequestException(
        'Name, responsible, and geometry are required.',
      );
    }

    if (!geometry.type || !geometry.coordinateType) {
      throw new BadRequestException(
        'Geometry type and coordinates are required.',
      );
    }

    if (!geometry.coordinateType.coordinates) {
      throw new BadRequestException('Geometry coordinates are required.');
    }

    if (
      geometry.type === 'Circle' &&
      (!('radius' in geometry.coordinateType) ||
        geometry.coordinateType.radius == null)
    ) {
      throw new BadRequestException('Circle geometry requires a radius.');
    }

    let statusId: string | null;

    if (status) {
      const existingStatus = await this.statusRepository.findByName(status);

      if (!existingStatus) {
        throw new NotFoundException(`Status '${status}' does not found.`);
      }

      statusId = existingStatus.id;
    } else {
      const defaultStatus = await this.statusRepository.findByName('Ativo');

      if (!defaultStatus) {
        throw new NotFoundException('Default status "Ativo" does not found.');
      }
      statusId = defaultStatus.id;
    }

    const existingProject = await this.projectRepository.findByName(name);

    if (existingProject) {
      throw new BadRequestException(
        `Project with name '${name}' already exists.`,
      );
    }

    const createGeometry = await this.geometryRepository.create(geometry);

    if (!createGeometry) {
      throw new BadRequestException(
        'Failed to create geometry for the project.',
      );
    }

    return this.projectRepository.create({
      name,
      responsible,
      statusId,
      geometryId: createGeometry.id,
    });
  }
}
