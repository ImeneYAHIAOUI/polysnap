import { Injectable, Logger } from '@nestjs/common';
import { StoryDto } from '../dto/story.dto';
import { CreateStoryDto } from '../dto/create-story.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Story } from '../entities/story.entity';
import { StorageService } from './storage.service';
import { UploadDto } from '../dto/upload.dto';

@Injectable()
export class StoryService {
  private readonly logger = new Logger(StoryService.name);

  constructor(
    @InjectRepository(Story)
    private storiesRepository: Repository<Story>,
    private storageService: StorageService,
  ) {}

  async searchStories(query: string): Promise<StoryDto[] | []> {
    this.logger.log(`Searching for stories with query ${query}`);
    return this.storiesRepository.find({
      where: [
        { title: Like(`%${query}%`) },
        { user: Like(`%${query}%`) }, // Add a comma here
      ],
      select: ['id', 'title', 'user', 'filename', 'format', 'size', 'views'],
    });
  }

  async createStory(createStoryDto: CreateStoryDto): Promise<UploadDto> {
    this.logger.log(`Creating story ${JSON.stringify(createStoryDto)}`);

    const url = await this.storageService.generate(createStoryDto.filename);
    const newStory = this.storiesRepository.create({
      title: createStoryDto.title,
      user: createStoryDto.user,
      filename: createStoryDto.filename,
      format: createStoryDto.format,
      size: createStoryDto.size,
      views: 0, // Assuming you initialize views to 0
    });

    const createdStory = await this.storiesRepository.save(newStory);
    const upload: UploadDto = {
      uploadUrl: url,
      story: createdStory,
    };
    return upload;
  }
}
