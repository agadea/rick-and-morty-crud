import { PartialType } from '@nestjs/mapped-types';
import { CreateCharacterDto } from './create-character.dto';
import { IsOptional, IsString, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCharacterDto extends PartialType(CreateCharacterDto) {
  @ApiPropertyOptional({ description: 'The name of the character' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'The status ID of the character' })
  @IsOptional()
  @IsInt()
  statusId?: number;

  @ApiPropertyOptional({ description: 'The subcategory ID of the character' })
  @IsOptional()
  @IsInt()
  subcategoryId?: number;
}
