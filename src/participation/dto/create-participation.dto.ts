import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateParticipationDto {
  @ApiProperty({ description: 'Character ID' })
  @IsInt()
  @IsNotEmpty()
  characterId: number;

  @ApiProperty({ description: 'Episode ID' })
  @IsInt()
  @IsNotEmpty()
  episodeId: number;

  @ApiProperty({ description: 'Initial timestamp' })
  @IsString()
  @IsNotEmpty()
  init: string;

  @ApiProperty({ description: 'Finish timestamp' })
  @IsString()
  @IsNotEmpty()
  finish: string;
}
