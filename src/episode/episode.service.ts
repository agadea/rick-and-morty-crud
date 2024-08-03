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
          subcategory: true,
        },
      }),
      this.prisma.episode.count({
        where: {
          ...(seasonId && { subcategoryId: seasonId }),
        },
      }),
    ]);

    const pages = Math.ceil(count / limit);

    return {
      info: {
        count,
        pages,
        next:
          page < pages ? `https://yourapi.com/episode?page=${page + 1}` : null,
        prev: page > 1 ? `https://yourapi.com/episode?page=${page - 1}` : null,
      },
      results: episodes,
    };
  }

  async findOne(id: number) {
    const episode = await this.prisma.episode.findUnique({
      where: { id },
      include: { subcategory: true },
    });

    if (!episode) {
      throw new NotFoundException('Episode not found');
    }

    return episode;
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
