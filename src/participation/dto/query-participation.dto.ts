import { IsOptional, IsInt, IsString, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class QueryParticipationDto {
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
    description: 'Limit of items per page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 5;

  @ApiPropertyOptional({ description: 'Character ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  characterId?: number;

  @ApiPropertyOptional({ description: 'Episode ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  episodeId?: number;

  @ApiPropertyOptional({ description: 'Initial timestamp' })
  @IsOptional()
  @IsString()
  init?: string;

  @ApiPropertyOptional({ description: 'Finish timestamp' })
  @IsOptional()
  @IsString()
  finish?: string;
}
