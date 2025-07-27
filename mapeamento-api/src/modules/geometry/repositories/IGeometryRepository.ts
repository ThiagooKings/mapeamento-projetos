import { CreateGeometryDto } from '../dto/CreateGeometry.dto';
import { Geometry } from '../geometry.entity';

export interface IGeometryRepository {
  create(data: CreateGeometryDto): Promise<Geometry>;
  findById(id: string): Promise<Geometry | null>;
}
