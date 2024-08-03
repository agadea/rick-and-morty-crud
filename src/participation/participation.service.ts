import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ParticipationValidatorService } from './../shared/participation-validator.service';
import { CreateParticipationDto } from './dto/create-participation.dto';
import { UpdateParticipationDto } from './dto/update-participation.dto';

@Injectable()
export class ParticipationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly participationValidatorService: ParticipationValidatorService,
  ) { }

  async create(data: CreateParticipationDto) {
    await this.participationValidatorService.validateParticipationCreation(
      data,
    );

    return this.prisma.participation.create({ data });
  }

  async findAll(
    page: number,
    limit: number,
    episodeId?: number,
    characterId?: number,
    init?: string,
    finish?: string,
  ) {
    const skip = (page - 1) * limit;

    const where: any = {
      ...(characterId && { characterId: characterId }),
      ...(episodeId && { episodeId: episodeId }),
      ...(init && { init: { gte: init } }),
      ...(finish && { finish: { lte: finish } }),
    };

    const [participations, count] = await this.prisma.$transaction([
      this.prisma.participation.findMany({
        skip,
        take: limit,
        where,
        include: {
          character: true,
          episode: true,
        },
      }),
      this.prisma.participation.count({
        where,
      }),
    ]);

    const pages = Math.ceil(count / limit);

    const results = participations.map((participation) => ({
      id: participation.id,
      characterName: participation.character.name,
      episodeTitle: participation.episode.title,
      init: participation.init,
      finish: participation.finish,
    }));

    return {
      info: {
        count,
        pages,
        current: page,
        next:
          page < pages
            ? `https://localhost:3000/participation?page=${page + 1}`
            : null,
        prev:
          page > 1
            ? `https://localhost:3000/participation?page=${page - 1}`
            : null,
      },
      results: results,
    };
  }

  async findOne(id: number) {
    const participation = await this.prisma.participation.findUnique({
      where: { id },
    });
    if (!participation) {
      throw new NotFoundException('Participation not found.');
    }

    return participation;
  }

  async update(id: number, data: UpdateParticipationDto) {
    await this.participationValidatorService.validateParticipationUpdate(
      id,
      data,
    );

    return this.prisma.participation.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    const participation = await this.prisma.participation.findUnique({
      where: { id },
    });
    if (!participation) {
      throw new NotFoundException('Participation not found.');
    }

    return this.prisma.participation.delete({ where: { id } });
  }
}
