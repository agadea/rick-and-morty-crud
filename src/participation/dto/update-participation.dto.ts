import { PartialType } from '@nestjs/mapped-types';
import { CreateParticipationDto } from './create-participation.dto';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateParticipationDto extends PartialType(
  CreateParticipationDto,
) {
  @ApiPropertyOptional({ description: 'Character ID' })
  @IsOptional()
  @IsInt()
  characterId?: number;

  @ApiPropertyOptional({ description: 'Episode ID' })
  @IsOptional()
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
