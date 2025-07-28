import { Module } from '@nestjs/common';
import { ProjectRepositoryPrisma } from './repositories/implementations/ProjectRepositoryPrisma';
import { CreateProjectService } from './shared/createProject.service';
import { ProjectController } from './project.controller';
import { GeometryRepositoryPrisma } from '../geometry/repositories/implementations/GeometryRepositoryPrisma';
import { StatusRepositoryPrisma } from '../status/repositories/implementations/StatusRepositoryPrisma';
import { FindAllProjectsService } from './shared/findAllProjects.service';

@Module({
  controllers: [ProjectController],
  providers: [
    CreateProjectService,
    FindAllProjectsService,
    {
      provide: 'IProjectRepository',
      useClass: ProjectRepositoryPrisma,
    },
    { provide: 'IGeometryRepository', useClass: GeometryRepositoryPrisma },
    { provide: 'IStatusRepository', useClass: StatusRepositoryPrisma },
  ],
  exports: [CreateProjectService, FindAllProjectsService],
})
export class ProjectModule {}
