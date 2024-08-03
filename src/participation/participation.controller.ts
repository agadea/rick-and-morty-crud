import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ParticipationService } from './participation.service';
import { CreateParticipationDto } from './dto/create-participation.dto';
import { UpdateParticipationDto } from './dto/update-participation.dto';
import { QueryParticipationDto } from './dto/query-participation.dto';
import { ParamParticipationDto } from './dto/param-participation.dto';

@ApiTags('participation')
@Controller('participation')
export class ParticipationController {
  constructor(private readonly participationService: ParticipationService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new participation' })
  @ApiResponse({
    status: 201,
    description: 'The participation has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateParticipationDto })
  create(@Body() createParticipationDto: CreateParticipationDto) {
    return this.participationService.create(createParticipationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all participations' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limit of items per page',
  })
  @ApiQuery({
    name: 'characterId',
    required: false,
    description: 'Character ID',
  })
  @ApiQuery({
    name: 'episodeId',
    required: false,
    description: 'Episode ID',
  })
  @ApiQuery({
    name: 'init',
    required: false,
    description: 'Start time',
  })
  @ApiQuery({
    name: 'finish',
    required: false,
    description: 'End time',
  })
  @ApiResponse({ status: 200, description: 'Return all participations.' })
  findAll(@Query() query: QueryParticipationDto) {
    const { page, limit, characterId, episodeId, init, finish } = query;
    return this.participationService.findAll(
      page,
      limit,
      characterId,
      episodeId,
      init,
      finish,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a participation by ID' })
  @ApiParam({ name: 'id', description: 'Participation ID' })
  @ApiResponse({ status: 200, description: 'Return the participation.' })
  @ApiResponse({ status: 404, description: 'Participation not found.' })
  findOne(@Param() param: ParamParticipationDto) {
    return this.participationService.findOne(param.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a participation' })
  @ApiParam({ name: 'id', description: 'Participation ID' })
  @ApiResponse({
    status: 200,
    description: 'The participation has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Participation not found.' })
  @ApiBody({ type: UpdateParticipationDto })
  update(
    @Param() param: ParamParticipationDto,
    @Body() updateParticipationDto: UpdateParticipationDto,
  ) {
    return this.participationService.update(param.id, updateParticipationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a participation' })
  @ApiParam({ name: 'id', description: 'Participation ID' })
  @ApiResponse({
    status: 200,
    description: 'The participation has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Participation not found.' })
  remove(@Param() param: ParamParticipationDto) {
    return this.participationService.delete(param.id);
  }
}
