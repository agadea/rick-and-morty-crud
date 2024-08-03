import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { CharacterModule } from './character/character.module';
import { EtlModule } from './etl/etl.module';
import { EpisodeModule } from './episode/episode.module';
import { ParticipationModule } from './participation/participation.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    CharacterModule,
    EtlModule,
    PrismaModule,
    EpisodeModule,
    ParticipationModule,
    SharedModule,
  ],
})
export class AppModule { }
