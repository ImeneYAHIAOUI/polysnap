import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { StoryDto } from '../dto/story.dto';
import { CreateStoryDto } from '../dto/create-story.dto';
import { IStoriesInterface } from '../interfaces/stories.interface';

@Injectable()
export class StoriesService implements IStoriesInterface {
  private readonly logger = new Logger(StoriesService.name);

  constructor(private prisma: PrismaService) {}

  async searchStories(query: string): Promise<StoryDto[] | []> {
    this.logger.log(`Searching for stories with query ${query}`);
    return this.prisma.story.findMany({
      where: {
        OR: [{ title: { contains: query } }, { user: { contains: query } }],
      },
      select: {
        id: true,
        title: true,
        user: true,
        format: true,
        size: true,
        views: true,
        videoUrl: true,
      },
    });
  }

  async createStory(createStoryDto: CreateStoryDto): Promise<StoryDto> {
    this.logger.log(`Creating story ${JSON.stringify(createStoryDto)}`);
    const createdStory = await this.prisma.story.create({
      data: {
        title: createStoryDto.title,
        user: createStoryDto.user,
        format: createStoryDto.format,
        size: createStoryDto.size,
        views: 0,
        videoUrl: createStoryDto.videoUrl,
      },
    });

    return createdStory;
  }
}
