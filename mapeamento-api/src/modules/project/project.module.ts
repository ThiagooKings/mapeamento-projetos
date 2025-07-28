import { Module } from '@nestjs/common';
import { ProjectRepositoryPrisma } from './repositories/implementations/ProjectRepositoryPrisma';
import { CreateProjectService } from './shared/createProject.service';
import { ProjectController } from './project.controller';
import { GeometryRepositoryPrisma } from '../geometry/repositories/implementations/GeometryRepositoryPrisma';
import { StatusRepositoryPrisma } from '../status/repositories/implementations/StatusRepositoryPrisma';
import { FindAllProjectsService } from './shared/findAllProjects.service';
import { FindByNameProjectService } from './shared/findByNameProject.service';

@Module({
  controllers: [ProjectController],
  providers: [
    CreateProjectService,
    FindAllProjectsService,
    FindByNameProjectService,
    {
      provide: 'IProjectRepository',
      useClass: ProjectRepositoryPrisma,
    },
    { provide: 'IGeometryRepository', useClass: GeometryRepositoryPrisma },
    { provide: 'IStatusRepository', useClass: StatusRepositoryPrisma },
  ],
  exports: [
    CreateProjectService,
    FindAllProjectsService,
    FindByNameProjectService,
  ],
})
export class ProjectModule {}
