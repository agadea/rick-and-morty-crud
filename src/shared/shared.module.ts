import { Module } from '@nestjs/common';
import { CharacterValidatorService } from './character-validator.service';
import { PrismaService } from 'prisma/prisma.service';
import { EpisodeValidatorService } from './episode-validator.service';
import { ParticipationValidatorService } from './participation-validator.service';

@Module({
  providers: [
    CharacterValidatorService,
    PrismaService,
    EpisodeValidatorService,
    ParticipationValidatorService
  ],
})
export class SharedModule { }
