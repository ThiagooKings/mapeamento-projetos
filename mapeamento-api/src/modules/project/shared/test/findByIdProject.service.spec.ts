import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FindByIdProjectService } from '../findByIdProject.service';
import { Project } from '../../Project.entity';
import { IProjectRepository } from '../../repositories/IProjectRepository';

describe('FindByIdProjectService', () => {
  let service: FindByIdProjectService;
  let projectRepository: jest.Mocked<IProjectRepository>;

  beforeEach(() => {
    projectRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByName: jest.fn(),
    } as unknown as jest.Mocked<IProjectRepository>;

    service = new FindByIdProjectService(projectRepository);
  });

  it('should throw BadRequestException if id is not provided', async () => {
    await expect(service.execute('')).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException if project is not found', async () => {
    projectRepository.findById.mockResolvedValue(null);

    await expect(service.execute('123')).rejects.toThrow(NotFoundException);
  });

  it('should return project if found', async () => {
    const mockProject = {
      id: '123',
      name: 'Projeto Teste',
      responsible: 'User',
      statusId: '1',
      geometryId: '1',
    } as Project;

    projectRepository.findById.mockResolvedValue(mockProject);

    const result = await service.execute('123');

    expect(projectRepository.findById).toHaveBeenCalledWith('123');
    expect(result).toEqual(mockProject);
  });
});
