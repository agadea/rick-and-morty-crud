import { Module } from '@nestjs/common';
import { ParticipationService } from './participation.service';
import { ParticipationController } from './participation.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ParticipationValidatorService } from 'src/shared/participation-validator.service';

@Module({
  controllers: [ParticipationController],
  providers: [
    ParticipationService,
    PrismaService,
    ParticipationValidatorService,
  ],
})
export class ParticipationModule { }
