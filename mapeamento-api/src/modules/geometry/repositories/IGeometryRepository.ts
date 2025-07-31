import { CreateGeometryDto } from '../dto/CreateGeometry.dto';
import { Geometry } from '../Geometry.entity';

export interface IGeometryRepository {
  create(data: CreateGeometryDto): Promise<Geometry>;
  findById(id: string): Promise<Geometry | null>;
}
