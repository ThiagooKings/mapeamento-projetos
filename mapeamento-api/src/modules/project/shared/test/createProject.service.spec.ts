import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateProjectService } from '../createProject.service';
import { IProjectRepository } from '../../repositories/IProjectRepository';
import { IGeometryRepository } from 'src/modules/geometry/repositories/IGeometryRepository';
import { IStatusRepository } from 'src/modules/status/repositories/IStatusRepository';
import { Project } from '../../Project.entity';

describe('CreateProjectService', () => {
  let service: CreateProjectService;
  let projectRepository: jest.Mocked<IProjectRepository>;
  let geometryRepository: jest.Mocked<IGeometryRepository>;
  let statusRepository: jest.Mocked<IStatusRepository>;

  beforeEach(() => {
    projectRepository = {
      findByName: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    };
    geometryRepository = {
      create: jest.fn(),
      findById: jest.fn(),
    };
    statusRepository = {
      findByName: jest.fn(),
    };

    service = new CreateProjectService(
      projectRepository,
      geometryRepository,
      statusRepository,
    );
  });

  it('should throw BadRequestException if required fields are missing', async () => {
    await expect(
      service.execute({ name: '', responsible: '', geometry: null }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if geometry type or coordinates are missing', async () => {
    await expect(
      service.execute({
        name: 'Test',
        responsible: 'User',
        geometry: { type: '', coordinateType: null },
      }),
    ).rejects.toThrow(BadRequestException);

    await expect(
      service.execute({
        name: 'Test',
        responsible: 'User',
        geometry: { type: 'Point', coordinateType: { coordinates: undefined } },
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if circle geometry does not have radius', async () => {
    await expect(
      service.execute({
        name: 'Test',
        responsible: 'User',
        geometry: { type: 'Circle', coordinateType: { coordinates: [1, 2] } },
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException if status does not exist', async () => {
    statusRepository.findByName.mockResolvedValue(null);

    await expect(
      service.execute({
        name: 'Test',
        responsible: 'User',
        status: 'Inexistente',
        geometry: { type: 'Point', coordinateType: { coordinates: [1, 2] } },
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should use default status if status is not provided', async () => {
    statusRepository.findByName.mockResolvedValueOnce({
      id: 'default-id',
      name: 'Ativo',
    });
    projectRepository.findByName.mockResolvedValue(null);
    geometryRepository.create.mockResolvedValue({
      id: 'geom-id',
      type: 'Point',
      coordinateType: { coordinates: [1, 2] },
    });
    projectRepository.create.mockResolvedValue({
      id: 'proj-id',
      name: 'Test',
      responsible: 'User',
      statusId: 'status-id',
      geometryId: 'geom-id',
    } as Project);

    const result = await service.execute({
      name: 'Test',
      responsible: 'User',
      geometry: { type: 'Point', coordinateType: { coordinates: [1, 2] } },
    });

    expect(result.id).toEqual('proj-id');
    expect(statusRepository.findByName).toHaveBeenCalledWith('Ativo');
  });

  it('should throw BadRequestException if project name already exists', async () => {
    statusRepository.findByName.mockResolvedValue({
      id: 'status-id',
      name: 'Ativo',
    });
    projectRepository.findByName.mockResolvedValue({
      id: 'existing-id',
      name: 'Existing Project',
      responsible: 'Existing User',
      statusId: 'status-id',
      geometryId: 'geometry-id',
    } as Project);

    await expect(
      service.execute({
        name: 'Test',
        responsible: 'User',
        geometry: { type: 'Point', coordinateType: { coordinates: [1, 2] } },
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if geometry creation fails', async () => {
    statusRepository.findByName.mockResolvedValue({
      id: 'status-id',
      name: 'Ativo',
    });
    projectRepository.findByName.mockResolvedValue(null);
    geometryRepository.create.mockResolvedValue(null);

    await expect(
      service.execute({
        name: 'Test',
        responsible: 'User',
        geometry: { type: 'Point', coordinateType: { coordinates: [1, 2] } },
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should create project successfully', async () => {
    statusRepository.findByName.mockResolvedValue({
      id: 'status-id',
      name: 'Ativo',
    });
    projectRepository.findByName.mockResolvedValue(null);
    geometryRepository.create.mockResolvedValue({
      id: 'geom-id',
      type: 'Point',
      coordinateType: { coordinates: [1, 2] },
    });
    projectRepository.create.mockResolvedValue({
      id: 'proj-id',
      name: 'Test',
      responsible: 'User',
      statusId: 'status-id',
      geometryId: 'geom-id',
    } as Project);

    const result = await service.execute({
      name: 'Test',
      responsible: 'User',
      geometry: { type: 'Point', coordinateType: { coordinates: [1, 2] } },
    });

    expect(result.id).toEqual('proj-id');
    expect(projectRepository.create).toHaveBeenCalledWith({
      name: 'Test',
      responsible: 'User',
      statusId: 'status-id',
      geometryId: 'geom-id',
    });
  });
});
