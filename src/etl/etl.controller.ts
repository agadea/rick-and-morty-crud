import { Controller, Get } from '@nestjs/common';
import { EtlService } from './etl.service';

@Controller('etl')
export class EtlController {
  constructor(private readonly etlService: EtlService) { }

  @Get('run')
  async runETL() {
    await this.etlService.runETL();
    return { message: 'ETL process completed successfully' };
  }
  @Get('run-participations')
  async runParticipations() {
    await this.etlService.runParticipations();
    return { message: 'Participations process completed successfully' };
  }
}
