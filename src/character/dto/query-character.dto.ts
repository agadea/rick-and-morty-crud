import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, Min, IsInt, Max } from 'class-validator';

export class QueryCharacterDto {
  @ApiPropertyOptional({ default: 1, minimum: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    default: 5,
    minimum: 1,
    maximum: 100,
    description: 'Limit number',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 5;

  @ApiPropertyOptional({ description: 'Status Type ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  typeId?: number;

  @ApiPropertyOptional({ description: 'Species ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  speciesId?: number;
}
