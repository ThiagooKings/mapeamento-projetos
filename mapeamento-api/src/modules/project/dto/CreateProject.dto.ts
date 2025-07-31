import { IsString } from 'class-validator';
export class CreateProjectDto {
  @IsString()
  name!: string;

  @IsString()
  responsible!: string;

  @IsString()
  statusId!: string;

  @IsString()
  geometryId!: string;
}
