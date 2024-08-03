import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from './../../prisma/prisma.service';

import { CharacterValidatorService } from 'src/shared/character-validator.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';

@Injectable()
export class CharacterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly characterValidatorService: CharacterValidatorService,
  ) { }

  async create(data: CreateCharacterDto) {
    await this.characterValidatorService.validateCharacterCreation(data);

    return this.prisma.character.create({
      data,
    });
  }

  async findAll(
    page: number,
    limit: number,
    typeId?: number,
    speciesId?: number,
  ) {
    const skip = (page - 1) * limit;

    if (typeId) {
      await this.characterValidatorService.validateStatus(typeId);
    }

    if (speciesId) {
      await this.characterValidatorService.validateSubcategory(speciesId);
    }

    const [characters, count] = await this.prisma.$transaction([
      this.prisma.character.findMany({
        where: {
          ...(typeId && { statusId: typeId }),
          ...(speciesId && { subcategoryId: speciesId }),
        },
        skip,
        take: Number(limit),
        include: {
          status: true,
          subcategory: true,
          participations: {
            include: {
              episode: true,
            },
          },
        },
      }),
      this.prisma.character.count({
        where: {
          ...(typeId && { statusId: typeId }),
          ...(speciesId && { subcategoryId: speciesId }),
        },
      }),
    ]);

    const results = characters.map((character) => ({
      id: character.id,
      name: character.name,
      status: character.status.name,
      species: character.subcategory.name,
      participations: character.participations.map((participation) => ({
        episodeTitle: participation.episode.title,
        init: participation.init,
        finish: participation.finish,
      })),
    }));

    const pages = Math.ceil(count / limit);

    return {
      info: {
        count,
        pages,
        current: page,
        next:
          page < pages
            ? `https://localhost:3000/character?page=${page + 1}`
            : null,
        prev:
          page > 1 ? `https://localhost:3000/character?page=${page - 1}` : null,
      },
      results: results,
    };
  }

  async findOne(id: number) {
    const character = await this.prisma.character.findUnique({
      where: { id },
      include: {
        status: true,
        subcategory: true,
        participations: {
          include: {
            episode: true,
          },
        },
      },
    });

    if (!character) {
      throw new NotFoundException('Character not found');
    }

    const result = {
      id: character.id,
      name: character.name,
      status: character.status.name,
      species: character.subcategory.name,
      participations: character.participations.map((participation) => ({
        episodeTitle: participation.episode.title,
        init: participation.init,
        finish: participation.finish,
      })),
    };

    return result;
  }

  async update(id: number, data: UpdateCharacterDto) {
    const character = await this.prisma.character.findUnique({
      where: { id },
    });

    if (!character) {
      throw new NotFoundException('Character not found');
    }

    await this.characterValidatorService.validateCharacterUpdate(id, data);

    return this.prisma.character.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    const character = await this.prisma.character.findUnique({
      where: { id },
    });

    if (!character) {
      throw new NotFoundException('Character not found');
    }

    if (character.statusId === 2) {
      throw new ConflictException('Character is already suspended');
    }

    return this.prisma.character.update({
      where: { id },
      data: { statusId: 2 },
    });
  }
}
