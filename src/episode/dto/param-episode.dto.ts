import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ParamEpisodeDto {
  @ApiProperty({ description: 'The ID of the Episode' })
  @Type(() => Number)
  @IsInt()
  id: number;
}
