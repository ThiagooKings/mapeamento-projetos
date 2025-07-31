import { Project } from '../../Project.entity';
import { IProjectRepository } from '../../repositories/IProjectRepository';
import { FindAllProjectsService } from '../findAllProjects.service';

describe('FindAllProjectsService', () => {
  let service: FindAllProjectsService;
  let projectRepository: jest.Mocked<IProjectRepository>;

  beforeEach(() => {
    projectRepository = {
      findAll: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
    } as unknown as jest.Mocked<IProjectRepository>;

    service = new FindAllProjectsService(projectRepository);
  });

  it('should return all projects', async () => {
    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'Projeto 1',
        responsible: '',
        statusId: '1',
        geometryId: '1',
      } as Project,
      {
        id: '2',
        name: 'Projeto 2',
        responsible: '',
        statusId: '2',
        geometryId: '2',
      } as Project,
    ];
    projectRepository.findAll.mockResolvedValue(mockProjects);

    const result = await service.execute();

    expect(projectRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockProjects);
  });

  it('should return empty array if no projects found', async () => {
    projectRepository.findAll.mockResolvedValue([]);

    const result = await service.execute();

    expect(projectRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
