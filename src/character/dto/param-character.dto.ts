import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ParamCharacterDto {
  @ApiProperty({ description: 'The ID of the character' })
  @Type(() => Number)
  @IsInt()
  id: number;
}
