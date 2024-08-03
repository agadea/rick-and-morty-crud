import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCharacterDto {
  @ApiProperty({ description: 'The name of the character' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The status ID of the character' })
  @IsInt()
  @IsNotEmpty()
  statusId: number;

  @ApiProperty({ description: 'The subcategory ID of the character' })
  @IsInt()
  @IsNotEmpty()
  subcategoryId: number;
}
