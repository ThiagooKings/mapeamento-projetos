import { CreateProjectDto } from '../dto/CreateProject.dto';
import { Project } from '../Project.entity';

export interface IProjectRepository {
  create(data: CreateProjectDto): Promise<Project>;
  findById(id: string): Promise<Project | null>;
  findAll(): Promise<Project[]>;
  findByName(name: string): Promise<Project | null>;
}
