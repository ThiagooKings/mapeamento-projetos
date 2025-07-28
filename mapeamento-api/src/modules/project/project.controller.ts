import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateProjectService } from './shared/createProject.service';
import { Project } from './Project.entity';
import { CreateGeometryDto } from '../geometry/dto/CreateGeometry.dto';
import { FindAllProjectsService } from './shared/findAllProjects.service';
import { FindByNameProjectService } from './shared/findByNameProject.service';
import { FindByIdProjectService } from './shared/findByIdProject.service';

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
    private readonly findByIdProjectService: FindByIdProjectService,
  ) {}

  @Post()
  async create(@Body() data: CreateProjectRequest): Promise<Project> {
    return this.createProjectService.execute(data);
  }

  @Get()
  async findAll(): Promise<Project[]> {
    return this.findAllProjectService.execute();
  }

  @Get('findByName')
  async findByName(@Query('name') name?: string): Promise<Project | null> {
    return this.findProjectByNameService.execute(name);
  }

  @Get('findById/:id')
  async findById(@Param('id') id: string): Promise<Project | null> {
    return this.findByIdProjectService.execute(id);
  }
}
