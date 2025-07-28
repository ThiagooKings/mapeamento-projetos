import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateProjectService } from './shared/createProject.service';
import { Project } from './Project.entity';
import { CreateGeometryDto } from '../geometry/dto/CreateGeometry.dto';
import { FindAllProjectsService } from './shared/findAllProjects.service';
import { FindByNameProjectService } from './shared/findByNameProject.service';

export type CreateProjectRequest = {
  name: string;
  responsible: string;
  status?: string;
  geometry: CreateGeometryDto;
};

@Controller('projects')
export class ProjectController {
  constructor(
    private readonly createProjectService: CreateProjectService,
    private readonly findAllProjectService: FindAllProjectsService,
    private readonly findProjectByNameService: FindByNameProjectService,
  ) {}

  @Post()
  async create(@Body() data: CreateProjectRequest): Promise<Project> {
    return this.createProjectService.execute(data);
  }

  @Get()
  async findAll(): Promise<Project[]> {
    return this.findAllProjectService.execute();
  }

  @Get('finByName')
  async findByName(@Query('name') name?: string): Promise<Project | null> {
    return this.findProjectByNameService.execute(name);
  }
}
