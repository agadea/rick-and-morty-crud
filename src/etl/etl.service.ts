import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class EtlService {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * The `runETL` function in TypeScript asynchronously executes three tasks related to creating status
   * and types, processing characters, and processing episodes.
   */
  async runETL() {
    await this.createStatusAndTypes();
    await this.processCharacters();
    await this.processEpisodes();
  }

  /**
   * The function `createStatusAndTypes` creates status types for characters and episodes, along with
   * corresponding statuses.
   */
  async createStatusAndTypes() {
    const characterStatusType = await this.prisma.statusType.create({
      data: {
        type: 'CHARACTERS',
      },
    });

    const episodeStatusType = await this.prisma.statusType.create({
      data: {
        type: 'EPISODES',
      },
    });

    await this.prisma.status.create({
      data: {
        name: 'ACTIVE',
        statusTypeId: characterStatusType.id,
      },
    });

    await this.prisma.status.create({
      data: {
        name: 'SUSPENDED',
        statusTypeId: characterStatusType.id,
      },
    });

    await this.prisma.status.create({
      data: {
        name: 'ACTIVE',
        statusTypeId: episodeStatusType.id,
      },
    });

    await this.prisma.status.create({
      data: {
        name: 'CANCELLED',
        statusTypeId: episodeStatusType.id,
      },
    });
  }

  /**
   * The function `processCharacters` asynchronously fetches and processes character data from the Rick
   * and Morty API in a paginated manner.
   */
  async processCharacters() {
    const baseUrl = 'https://rickandmortyapi.com/api/character';
    let nextPage: string | null = baseUrl;

    while (nextPage) {
      const response = await axios.get(nextPage);
      const characters = response.data.results;

      for (const character of characters) {
        try {
          await this.processCharacter(character);
        } catch (error) {
          console.error(
            `Error processing character ${character.name}: ${error.message}`,
          );
        }
      }

      nextPage = response.data.info.next;
    }
  }

  /**
   * The function `processEpisodes` asynchronously fetches and processes episodes from the Rick and Morty
   * API in a paginated manner.
   */
  async processEpisodes() {
    const baseUrl = 'https://rickandmortyapi.com/api/episode';
    let nextPage: string | null = baseUrl;

    while (nextPage) {
      const response = await axios.get(nextPage);
      const episodes = response.data.results;

      for (const episode of episodes) {
        try {
          await this.processEpisode(episode);
        } catch (error) {
          console.error(
            `Error processing episode ${episode.name}: ${error.message}`,
          );
        }
      }

      nextPage = response.data.info.next;
    }
  }

  /**
   * The `runParticipations` function asynchronously creates participations.
   */
  async runParticipations() {
    await this.createParticipations();
  }

  /**
   * The function `processCharacter` in TypeScript upserts category, subcategory, and character data
   * based on the input character object.
   * @param {any} character - The `processCharacter` method you provided seems to be handling the
   * processing of a character object. It interacts with a database using Prisma to upsert records
   * related to categories, subcategories, and characters.
   */
  private async processCharacter(character: any) {
    const category = await this.prisma.category.upsert({
      where: { name: 'SPECIES' },
      update: {},
      create: { name: 'SPECIES' },
    });

    // Crear o encontrar la subcategoría (especie)
    const subcategory = await this.prisma.subcategory.upsert({
      where: { name: character.species, categoryId: category.id },
      update: {},
      create: { name: character.species, categoryId: category.id },
    });

    await this.prisma.character.upsert({
      where: { id: character.id },
      update: {
        statusId: 1,
        subcategoryId: subcategory.id,
        updatedAt: character.updatedAt,
      },
      create: {
        name: character.name,
        statusId: 1,
        subcategoryId: subcategory.id,
        createdAt: character.createdAt,
        updatedAt: character.updatedAt,
      },
    });
  }

  /**
   * The function `processEpisode` processes episode data by extracting season information, generating
   * random duration, and upserting episode records in a database.
   * @param {any} episode - The `processEpisode` function you provided seems to be processing an episode
   * object. The `episode` parameter is an object containing information about the episode, such as its
   * name, episode number, createdAt, updatedAt, and id.
   */
  private async processEpisode(episode: any) {
    const category = await this.prisma.category.upsert({
      where: { name: 'SEASON' },
      update: {},
      create: { name: 'SEASON' },
    });

    const episodeMatch = episode.episode.match(/S(\d+)E(\d+)/);
    if (!episodeMatch) {
      throw new Error(`Invalid episode format: ${episode.episode}`);
    }
    const seasonNumber = parseInt(episodeMatch[1], 10);

    const subcategory = await this.prisma.subcategory.upsert({
      where: { name: `Season ${seasonNumber}`, categoryId: category.id },
      update: {},
      create: { name: `Season ${seasonNumber}`, categoryId: category.id },
    });

    const randomDuration = Math.floor(Math.random() * (60 - 20 + 1)) + 20;
    const minutes = Math.floor(randomDuration);
    const seconds = Math.floor((randomDuration - minutes) * 60);
    const formattedDuration = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    await this.prisma.episode.upsert({
      where: { id: episode.id },
      update: {
        statusId: 1,
        subcategoryId: subcategory.id,
        updatedAt: episode.updatedAt,
      },
      create: {
        title: episode.name,
        duration: formattedDuration,
        statusId: 1,
        subcategoryId: subcategory.id,
        createdAt: episode.createdAt,
        updatedAt: episode.updatedAt,
      },
    });
  }

  /**
   * The function `createParticipations` asynchronously generates participation data for episodes by
   * randomly selecting characters and creating batches of participations.
   */
  private async createParticipations() {
    const episodes = await this.prisma.episode.findMany({
      where: { statusId: 1 },
    });

    const characters = await this.prisma.character.findMany({
      where: { statusId: 1 },
      select: { id: true },
    });

    const characterIds = characters.map((character) => character.id);

    const batchSize = 50;
    let participationCount = 0;

    for (const episode of episodes) {
      const participationData = [];

      const randomCharacterIds = this.getRandomElements(characterIds, 5);

      for (const randomCharacterId of randomCharacterIds) {
        const initMinutes = Math.floor(Math.random() * 30);
        const initSeconds = Math.floor(Math.random() * 60);
        const durationMinutes = Math.floor(Math.random() * 10) + 1;
        const finishMinutes = initMinutes + durationMinutes;

        const formattedInit = `${String(initMinutes).padStart(2, '0')}:${String(initSeconds).padStart(2, '0')}`;
        const formattedFinish = `${String(finishMinutes).padStart(2, '0')}:${String(initSeconds).padStart(2, '0')}`;

        participationData.push({
          characterId: randomCharacterId,
          episodeId: episode.id,
          init: formattedInit,
          finish: formattedFinish,
        });
      }

      for (let i = 0; i < participationData.length; i += batchSize) {
        const batch = participationData.slice(i, i + batchSize);
        await this.prisma.participation.createMany({
          data: batch,
        });
        participationCount += batch.length;
      }
    }

    console.log(`Created ${participationCount} participations.`);
  }

  /**
   * The function getRandomElements takes an array of numbers and returns a specified number of
   * randomly selected elements from the array.
   * @param {number[]} arr - An array of numbers from which random elements will be selected.
   * @param {number} count - The `count` parameter specifies the number of random elements you want to
   * select from the array.
   * @returns An array of random elements from the input array `arr` with a length specified by the
   * `count` parameter.
   */
  private getRandomElements(arr: number[], count: number): number[] {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}
