import { Module } from '@nestjs/common';
import { ProjectRepositoryPrisma } from './repositories/implementations/ProjectRepositoryPrisma';
import { CreateProjectService } from './shared/createProject.service';
import { ProjectController } from './project.controller';
import { GeometryRepositoryPrisma } from '../geometry/repositories/implementations/GeometryRepositoryPrisma';
import { StatusRepositoryPrisma } from '../status/repositories/implementations/StatusRepositoryPrisma';
import { FindAllProjectsService } from './shared/findAllProjects.service';
import { FindByNameProjectService } from './shared/findByNameProject.service';
import { FindByIdProjectService } from './shared/findByIdProject.service';

@Module({
  controllers: [ProjectController],
  providers: [
    CreateProjectService,
    FindAllProjectsService,
    FindByNameProjectService,
    FindByIdProjectService,
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
    FindByIdProjectService,
  ],
})
export class ProjectModule {}
