import { Module } from '@nestjs/common';
import { EpisodeService } from './episode.service';
import { EpisodeController } from './episode.controller';
import { PrismaService } from 'prisma/prisma.service';
import { EpisodeValidatorService } from 'src/shared/episode-validator.service';

@Module({
  controllers: [EpisodeController],
  providers: [EpisodeService, PrismaService, EpisodeValidatorService],
})
export class EpisodeModule { }
