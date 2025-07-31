import prismaClient from 'src/prisma';
import {
  Circle,
  Geometry,
  MultiPolygon,
  Point,
  Polygon,
} from '../../Geometry.entity';
import { IGeometryRepository } from '../IGeometryRepository';
import { CreateGeometryDto } from '../../dto/CreateGeometry.dto';

export class GeometryRepositoryPrisma implements IGeometryRepository {
  async create(data: CreateGeometryDto): Promise<Geometry> {
    const created = await prismaClient.geometry.create({ data });

    return {
      ...created,
      coordinateType: created.coordinateType as
        | Circle
        | Point
        | Polygon
        | MultiPolygon,
    };
  }

  async findById(id: string): Promise<Geometry | null> {
    const found = await prismaClient.geometry.findUnique({ where: { id } });

    if (!found) return null;

    return {
      ...found,
      coordinateType: found.coordinateType as
        | Circle
        | Point
        | Polygon
        | MultiPolygon,
    } as Geometry;
  }
}
