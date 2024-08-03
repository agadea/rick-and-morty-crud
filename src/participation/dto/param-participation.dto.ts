import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ParamParticipationDto {
  @ApiProperty({ description: 'Participation ID' })
  @Type(() => Number)
  @IsInt()
  id: number;
}
