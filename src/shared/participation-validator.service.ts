import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { secondsToTime, timeToSeconds, validateTimeFormat } from 'src/utils/utils';
import { UpdateParticipationDto } from './../participation/dto/update-participation.dto';
import { CreateParticipationDto } from './../participation/dto/create-participation.dto';

@Injectable()
export class ParticipationValidatorService {
  constructor(private readonly prisma: PrismaService) { }

  async validateParticipationCreation(data: CreateParticipationDto) {
    validateTimeFormat(data.init);
    validateTimeFormat(data.finish);

    const initSeconds = timeToSeconds(data.init);
    const finishSeconds = timeToSeconds(data.finish);

    if (initSeconds >= finishSeconds) {
      throw new ConflictException(
        'Start time cannot be greater than or equal to finish time.',
      );
    }

    const episode = await this.prisma.episode.findUnique({
      where: { id: data.episodeId },
    });

    if (!episode) {
      throw new NotFoundException('Episode not found.');
    }

    const character = await this.prisma.character.findUnique({
      where: { id: data.characterId },
    });

    if (!character) {
      throw new NotFoundException('Character not found.');
    }

    const isOverlapping = await this.checkOverlap(
      data.episodeId,
      data.characterId,
      initSeconds,
      finishSeconds,
    );

    if (isOverlapping) {
      throw new ConflictException(
        'This current character participation time overlaps with another same character participation.',
      );
    }
  }

  async validateParticipationUpdate(id: number, data: UpdateParticipationDto) {
    if (data.init) {
      validateTimeFormat(data.init);
    }

    if (data.finish) {
      validateTimeFormat(data.finish);
    }

    const participation = await this.prisma.participation.findUnique({
      where: { id },
    });

    if (!participation) {
      throw new NotFoundException('Participation not found.');
    }

    const episode = await this.prisma.episode.findUnique({
      where: { id: data.episodeId },
    });

    if (!episode) {
      throw new NotFoundException('Episode not found.');
    }

    const character = await this.prisma.character.findUnique({
      where: { id: data.characterId },
    });

    if (!character) {
      throw new NotFoundException('Character not found.');
    }

    const initSeconds = timeToSeconds(data.init ?? participation.init);
    const finishSeconds = timeToSeconds(data.finish ?? participation.finish);


    if (initSeconds >= finishSeconds) {
      throw new ConflictException(
        'Start time cannot be greater than or equal to finish time.',
      );
    }

    const isOverlapping = await this.checkOverlap(
      participation.episodeId,
      participation.characterId,
      initSeconds,
      finishSeconds,
      id,
    );

    if (isOverlapping) {
      throw new ConflictException(
        'This current character participation time overlaps with another same character participation.',
      );
    }
  }

  private async checkOverlap(
    episodeId: number,
    characterId: number,
    initSeconds: number,
    finishSeconds: number,
    excludeId?: number,
  ) {
    const initTime = secondsToTime(initSeconds);
    const finishTime = secondsToTime(finishSeconds);

    const existingParticipation = await this.prisma.participation.findMany({
      where: {
        episodeId,
        characterId,
        AND: [
          excludeId ? { id: { not: excludeId } } : {},
          {
            OR: [
              {
                init: { lte: finishTime },
                finish: { gte: initTime },
              },
              {
                init: { gte: initTime },
                finish: { lte: finishTime },
              },
            ],
          },
        ],
      },
    });

    return existingParticipation.length > 0;
  }
}
