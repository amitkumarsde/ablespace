import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ResourceDto {
  @IsString()
  @MaxLength(120)
  label: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  url?: string;
}
