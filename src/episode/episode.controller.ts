import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EpisodeService } from './episode.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { QueryEpisodeDto } from './dto/query-episode.dto';
import { ParamEpisodeDto } from './dto/param-episode.dto';

@ApiTags('episode')
@Controller('episode')
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new episode' })
  @ApiResponse({
    status: 201,
    description: 'The episode has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateEpisodeDto })
  async create(@Body() createEpisodeDto: CreateEpisodeDto) {
    return this.episodeService.create(createEpisodeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all episodes' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'seasonId', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Return all episodes.' })
  async findAll(@Query() query: QueryEpisodeDto) {
    const { page, limit, seasonId } = query;
    return this.episodeService.findAll(page, limit, seasonId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an episode by ID' })
  @ApiParam({ name: 'id', description: 'ID of the episode to retrieve' })
  @ApiResponse({ status: 200, description: 'Return the episode.' })
  @ApiResponse({ status: 404, description: 'Episode not found.' })
  async findOne(@Param() param: ParamEpisodeDto) {
    return this.episodeService.findOne(param.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing episode' })
  @ApiParam({ name: 'id', description: 'ID of the episode to update' })
  @ApiResponse({
    status: 200,
    description: 'The episode has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Episode not found.' })
  @ApiBody({ type: UpdateEpisodeDto })
  async update(
    @Param() param: ParamEpisodeDto,
    @Body() updateEpisodeDto: UpdateEpisodeDto,
  ) {
    return this.episodeService.update(param.id, updateEpisodeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an episode' })
  @ApiParam({ name: 'id', description: 'ID of the episode to delete' })
  @ApiResponse({
    status: 200,
    description: 'The episode has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Episode not found.' })
  async remove(@Param() param: ParamEpisodeDto) {
    return this.episodeService.delete(param.id);
  }
}
