import { IsObject, IsString } from 'class-validator';
import { Circle, MultiPolygon, Point, Polygon } from '../Geometry.entity';

export class CreateGeometryDto {
  @IsString()
  type!: string;

  @IsObject()
  coordinateType!: Circle | Point | Polygon | MultiPolygon;
}
