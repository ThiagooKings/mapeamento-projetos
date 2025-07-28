import { Body, Controller, Post } from '@nestjs/common';
import { CreateProjectService } from './shared/createProject.service';
import { Project } from './Project.entity';
import { CreateGeometryDto } from '../geometry/dto/CreateGeometry.dto';

export type CreateProjectRequest = {
  name: string;
  responsible: string;
  status?: string;
  geometry: CreateGeometryDto;
};

@Controller('projects')
export class ProjectController {
  constructor(private readonly createProjectService: CreateProjectService) {}

  @Post()
  async create(@Body() data: CreateProjectRequest): Promise<Project> {
    return this.createProjectService.create(data);
  }
}
