import { Geometry } from '../geometry.entity';

export interface IGeometryRepository {
  create(data: Geometry): Promise<Geometry>;
  findById(id: string): Promise<Geometry | null>;
}
