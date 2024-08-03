import { Module } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharacterController } from './character.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { CharacterValidatorService } from 'src/shared/character-validator.service';

@Module({
  controllers: [CharacterController],
  providers: [CharacterService, PrismaService, CharacterValidatorService],
})
export class CharacterModule { }
