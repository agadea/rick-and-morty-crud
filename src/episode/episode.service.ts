import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { EpisodeValidatorService } from 'src/shared/episode-validator.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';

@Injectable()
export class EpisodeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly episodeValidatorService: EpisodeValidatorService,
  ) { }

  async create(data: CreateEpisodeDto) {
    await this.episodeValidatorService.validateEpisodeCreation(data);

    return this.prisma.episode.create({
      data,
    });
  }

  async findAll(page: number, limit: number, seasonId?: number) {
    const skip = (page - 1) * limit;

    if (seasonId) {
      await this.episodeValidatorService.validateSubcategory(seasonId);
    }

    const [episodes, count] = await this.prisma.$transaction([
      this.prisma.episode.findMany({
        where: {
          ...(seasonId && { subcategoryId: seasonId }),
        },
        skip,
        take: limit,
        include: {
          status: true,
          subcategory: true,
          participations: {
            include: {
              character: true,
            },
          },
        },
      }),
      this.prisma.episode.count({
        where: {
          ...(seasonId && { subcategoryId: seasonId }),
        },
      }),
    ]);

    const pages = Math.ceil(count / limit);

    const results = episodes.map((episode) => ({
      id: episode.id,
      title: episode.title,
      status: episode.status.name,
      subcategory: episode.subcategory.name,
      participations: episode.participations.map((participation) => ({
        characterName: participation.character.name,
        init: participation.init,
        finish: participation.finish,
      })),
    }));

    return {
      info: {
        count,
        pages,
        next:
          page < pages
            ? `https://localhost:3000/episode?page=${page + 1}`
            : null,
        prev:
          page > 1 ? `https://localhost:3000/episode?page=${page - 1}` : null,
      },
      results,
    };
  }

  async findOne(id: number) {
    const episode = await this.prisma.episode.findUnique({
      where: { id },
      include: {
        status: true,
        subcategory: true,
        participations: {
          include: {
            character: true,
          },
        },
      },
    });

    if (!episode) {
      throw new NotFoundException('Episode not found');
    }

    const result = {
      id: episode.id,
      title: episode.title,
      status: episode.status.name,
      subcategory: episode.subcategory.name,
      participations: episode.participations.map((participation) => ({
        characterName: participation.character.name,
        init: participation.init,
        finish: participation.finish,
      })),
    };

    return result;
  }

  async update(id: number, data: UpdateEpisodeDto) {
    const episode = await this.prisma.episode.findUnique({
      where: { id },
    });

    if (!episode) {
      throw new NotFoundException('Episode not found');
    }

    await this.episodeValidatorService.validateEpisodeUpdate(id, data);

    return this.prisma.episode.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    const episode = await this.prisma.episode.findUnique({
      where: { id },
    });

    if (!episode) {
      throw new NotFoundException('Episode not found');
    }

    if (episode.statusId === 4) {
      throw new ConflictException('Episode is already suspended');
    }

    return this.prisma.episode.update({
      where: { id },
      data: { statusId: 4 },
    });
  }
}
