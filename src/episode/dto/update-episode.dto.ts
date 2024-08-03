import { PartialType } from '@nestjs/mapped-types';
import { CreateEpisodeDto } from './create-episode.dto';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEpisodeDto extends PartialType(CreateEpisodeDto) {
  @ApiPropertyOptional({ description: 'Title of the episode' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Status ID of the episode' })
  @IsInt()
  @IsOptional()
  statusId?: number;

  @ApiPropertyOptional({ description: 'Duration of the episode' })
  @IsString()
  @IsOptional()
  duration?: string;

  @ApiPropertyOptional({ description: 'Subcategory ID of the episode' })
  @IsInt()
  @IsOptional()
  subcategoryId?: number;
}
