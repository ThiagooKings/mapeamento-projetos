import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FindByNameProjectService } from '../findByNameProject.service';
import { IProjectRepository } from '../../repositories/IProjectRepository';
import { Project } from '../../Project.entity';

describe('FindByNameProjectService', () => {
  let service: FindByNameProjectService;
  let projectRepository: jest.Mocked<IProjectRepository>;

  beforeEach(() => {
    projectRepository = {
      findByName: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    } as unknown as jest.Mocked<IProjectRepository>;

    service = new FindByNameProjectService(projectRepository);
  });

  it('should throw BadRequestException if name is not provided', async () => {
    await expect(service.execute('')).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException if project is not found', async () => {
    projectRepository.findByName.mockResolvedValue(null);

    await expect(service.execute('Projeto Inexistente')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should return project if found', async () => {
    const mockProject = {
      id: '1',
      name: 'Projeto Teste',
      responsible: 'User',
      statusId: '1',
      geometryId: '1',
    } as Project;

    projectRepository.findByName.mockResolvedValue(mockProject);

    const result = await service.execute('Projeto Teste');

    expect(projectRepository.findByName).toHaveBeenCalledWith('Projeto Teste');
    expect(result).toEqual(mockProject);
  });
});
