import { Injectable, Logger } from '@nestjs/common';
import { StoryDto } from '../dto/story.dto';
import { CreateStoryDto } from '../dto/create-story.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Story } from '../enteties/story.entity';

@Injectable()
export class StoryService {
  private readonly logger = new Logger(StoryService.name);

  constructor(
    @InjectRepository(Story)
    private storiesRepository: Repository<Story>,
  ) {}

  async searchStories(query: string): Promise<StoryDto[] | []> {
    this.logger.log(`Searching for stories with query ${query}`);
    return this.storiesRepository.find({
      where: [
        { title: Like(`%${query}%`) },
        { user: Like(`%${query}%`) }, // Add a comma here
      ],
      select: ['id', 'title', 'user', 'format', 'size', 'views', 'videoUrl'],
    });
  }

  async createStory(createStoryDto: CreateStoryDto): Promise<StoryDto> {
    this.logger.log(`Creating story ${JSON.stringify(createStoryDto)}`);
    const newStory = this.storiesRepository.create({
      title: createStoryDto.title,
      user: createStoryDto.user,
      format: createStoryDto.format,
      size: createStoryDto.size,
      views: 0, // Assuming you initialize views to 0
      videoUrl: createStoryDto.videoUrl,
    });

    const createdStory = await this.storiesRepository.save(newStory);

    return createdStory;
  }
}
