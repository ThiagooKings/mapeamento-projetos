import { IStatusRepository } from '../IStatusRepository';
import { Status } from '../../Status.entity';
import prismaClient from 'src/prisma';

export class StatusRepositoryPrisma implements IStatusRepository {
  async findByName(name: string): Promise<Status | null> {
    const status = await prismaClient.status.findUnique({
      where: { name },
    });
    return status ? ({ id: status.id, name: status.name } as Status) : null;
  }
}
