import { CreateProjectDto } from '../dto/createProject.dto';
import { Project } from '../project.entity';

export interface IProjectRepository {
  create(data: CreateProjectDto): Promise<Project>;
  findById(id: string): Promise<Project | null>;
  findAll(): Promise<Project[]>;
  findByName(name: string): Promise<Project | null>;
}
