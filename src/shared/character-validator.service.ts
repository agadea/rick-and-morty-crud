import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCharacterDto } from 'src/character/dto/create-character.dto';
import { UpdateCharacterDto } from '../character/dto/update-character.dto';

@Injectable()
export class CharacterValidatorService {
  constructor(private readonly prisma: PrismaService) { }

  async validateCharacterCreation(data: CreateCharacterDto) {
    const existingCharacter = await this.prisma.character.findFirst({
      where: {
        name: data.name,
        subcategoryId: data.subcategoryId,
        statusId: 1, // Suponiendo que el ID 1 es para "Active"
      },
    });

    if (existingCharacter) {
      throw new ConflictException(
        'Character with this name already exists in the same species and is active',
      );
    }

    await this.validateStatus(data.statusId);
    await this.validateSubcategory(data.subcategoryId);
  }

  async validateCharacterUpdate(id: number, data: UpdateCharacterDto) {
    if (data.name) {
      const existingCharacter = await this.prisma.character.findFirst({
        where: {
          name: data.name,
          subcategoryId: data.subcategoryId,
          NOT: { id },
        },
      });

      if (existingCharacter) {
        throw new ConflictException(
          'Character with this name already exists in the same species and is active',
        );
      }
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

    if (status.statusType.type !== 'CHARACTERS') {
      throw new ConflictException('Status does not belong to CHARACTERS type');
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

    if (subcategory.category.name !== 'SPECIES') {
      throw new ConflictException(
        'Subcategory does not belong to SPECIES category',
      );
    }
  }
}
