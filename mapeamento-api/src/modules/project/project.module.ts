import { Module } from '@nestjs/common';
import { ProjectRepositoryPrisma } from './repositories/implementations/ProjectRepositoryPrisma';
import { CreateProjectService } from './shared/createProject.service';
import { ProjectController } from './project.controller';
import { GeometryRepositoryPrisma } from '../geometry/repositories/implementations/GeometryRepositoryPrisma';

@Module({
  controllers: [ProjectController],
  providers: [
    CreateProjectService,
    {
      provide: 'IProjectRepository',
      useClass: ProjectRepositoryPrisma,
    },
    { provide: 'IGeometryRepository', useClass: GeometryRepositoryPrisma },
  ],
  exports: [CreateProjectService],
})
export class ProjectModule {}
