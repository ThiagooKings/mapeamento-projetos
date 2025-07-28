import { Status } from '../Status.entity';

export interface IStatusRepository {
  findByName(name: string): Promise<Status | null>;
  findById(id: string): Promise<Status | null>;
}
