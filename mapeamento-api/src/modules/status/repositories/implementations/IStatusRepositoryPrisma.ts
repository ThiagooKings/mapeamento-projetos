import { PrismaClient } from '@prisma/client';
import { IStatusRepository } from '../IStatusRepository';
import { Status } from '../../Status.entity';

export class IStatusRepositoryPrisma implements IStatusRepository {
  constructor(private prisma: PrismaClient) {}

  async findByName(name: string): Promise<Status | null> {
    const status = await this.prisma.status.findUnique({
      where: { name },
    });
    return status ? ({ id: status.id, name: status.name } as Status) : null;
  }

  async findById(id: string): Promise<Status | null> {
    const status = await this.prisma.status.findUnique({
      where: { id },
    });
    return status ? ({ id: status.id, name: status.name } as Status) : null;
  }
}
