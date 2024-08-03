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
import { CharacterService } from './character.service';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { CreateCharacterDto } from './dto/create-character.dto';
import { QueryCharacterDto } from './dto/query-character.dto';
import { ParamCharacterDto } from './dto/param-character.dto';

@ApiTags('character')
@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new character' })
  @ApiResponse({
    status: 201,
    description: 'The character has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateCharacterDto })
  async create(@Body() createCharacterDto: CreateCharacterDto) {
    return this.characterService.create(createCharacterDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all characters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'typeId', required: false, type: Number })
  @ApiQuery({ name: 'speciesId', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Return all characters.' })
  async findAll(@Query() query: QueryCharacterDto) {
    const { page, limit, typeId, speciesId } = query;
    return this.characterService.findAll(page, limit, typeId, speciesId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a character by ID' })
  @ApiParam({ name: 'id', description: 'ID of the character to retrieve' })
  @ApiResponse({ status: 200, description: 'Return the character.' })
  @ApiResponse({ status: 404, description: 'Character not found.' })
  async findOne(@Param() param: ParamCharacterDto) {
    return this.characterService.findOne(param.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing character' })
  @ApiParam({ name: 'id', description: 'ID of the character to update' })
  @ApiResponse({ status: 200, description: 'Return the updated character.' })
  @ApiResponse({ status: 404, description: 'Character not found.' })
  @ApiBody({ type: UpdateCharacterDto })
  async update(
    @Param() param: ParamCharacterDto,
    @Body() updateCharacterDto: UpdateCharacterDto,
  ) {
    return this.characterService.update(param.id, updateCharacterDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a character' })
  @ApiParam({ name: 'id', description: 'ID of the character to delete' })
  @ApiResponse({ status: 200, description: 'Character successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Character not found.' })
  async remove(@Param() param: ParamCharacterDto) {
    return this.characterService.delete(param.id);
  }
}
