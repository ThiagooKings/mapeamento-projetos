import { IsObject, IsString } from 'class-validator';
import { Circle, MultiPolygon, Point, Polygon } from '../geometry.entity';

export class GeometryDto {
  @IsString()
  type!: string;

  @IsObject()
  coordinateType!: Circle | Point | Polygon | MultiPolygon;
}
