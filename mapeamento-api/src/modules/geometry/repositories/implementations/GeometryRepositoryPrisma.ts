import prismaClient from 'src/prisma';
import {
  Circle,
  Geometry,
  MultiPolygon,
  Point,
  Polygon,
} from '../../geometry.entity';
import { IGeometryRepository } from '../IGeometryRepository';

export class GeometryRepositoryPrisma implements IGeometryRepository {
  async create(data: Geometry): Promise<Geometry> {
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
