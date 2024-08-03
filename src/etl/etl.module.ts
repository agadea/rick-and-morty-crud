import { Module } from '@nestjs/common';
import { EtlService } from './etl.service';
import { EtlController } from './etl.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [EtlController],
  providers: [EtlService, PrismaService],
})
export class EtlModule { }
