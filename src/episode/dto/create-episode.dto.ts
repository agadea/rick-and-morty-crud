import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEpisodeDto {
  @ApiProperty({ description: 'Title of the episode' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Status ID of the episode' })
  @IsInt()
  @IsNotEmpty()
  statusId: number;

  @ApiProperty({ description: 'Duration of the episode' })
  @IsString()
  @IsNotEmpty()
  duration: string;

  @ApiProperty({ description: 'Subcategory ID of the episode' })
  @IsInt()
  @IsNotEmpty()
  subcategoryId: number;
}
