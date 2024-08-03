import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateEpisodeDto } from './../episode/dto/create-episode.dto';
import { UpdateEpisodeDto } from './../episode/dto/update-episode.dto';
import { validateTimeFormat } from 'src/utils/utils';

@Injectable()
export class EpisodeValidatorService {
  constructor(private readonly prisma: PrismaService) { }

  async validateEpisodeCreation(data: CreateEpisodeDto) {
    const existingEpisode = await this.prisma.episode.findFirst({
      where: {
        title: data.title,
        subcategoryId: data.subcategoryId,
      },
    });

    if (existingEpisode) {
      throw new ConflictException(
        'Episode with this name already exists in the same season.',
      );
    }

    await this.validateStatus(data.statusId);
    await this.validateSubcategory(data.subcategoryId);

    validateTimeFormat(data.duration);
  }

  async validateEpisodeUpdate(id: number, data: UpdateEpisodeDto) {
    if (data.title) {
      const existingEpisode = await this.prisma.episode.findFirst({
        where: {
          title: data.title,
          subcategoryId: data.subcategoryId,
          NOT: { id },
        },
      });

      if (existingEpisode) {
        throw new ConflictException(
          'Episode with this title already exists in the same season',
        );
      }
    }

    if (data.statusId) {
      await this.validateStatus(data.statusId);
    }

    if (data.subcategoryId) {
      await this.validateSubcategory(data.subcategoryId);
    }
  }

  async validateStatus(statusId: number) {
    const status = await this.prisma.status.findUnique({
      where: { id: Number(statusId) },
      include: { statusType: true },
    });

    if (!status) {
      throw new NotFoundException('Status not found');
    }

    if (status.statusType.type !== 'EPISODES') {
      throw new ConflictException('Status does not belong to EPISODES type');
    }
  }

  async validateSubcategory(subcategoryId: number) {
    const subcategory = await this.prisma.subcategory.findUnique({
      where: { id: Number(subcategoryId) },
      include: { category: true },
    });

    if (!subcategory) {
      throw new NotFoundException('Subcategory not found');
    }

    if (subcategory.category.name !== 'SEASON') {
      throw new ConflictException(
        'Subcategory does not belong to SEASON category',
      );
    }
  }
}
