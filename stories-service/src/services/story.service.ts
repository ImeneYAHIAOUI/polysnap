import { Injectable, Logger } from '@nestjs/common';
import { StoryDto } from '../dto/story.dto';
import { CreateStoryDto } from '../dto/create-story.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Story } from '../entities/story.entity';
import { StorageService } from './storage.service';
import { UploadDto } from '../dto/upload.dto';
import { Cron } from '@nestjs/schedule';
@Injectable()
export class StoryService {
  private readonly logger = new Logger(StoryService.name);

  constructor(
    @InjectRepository(Story)
    private storiesRepository: Repository<Story>,
    private storageService: StorageService,
  ) {}

  async removeExpiredStories() {
    this.logger.log(`Removing expired stories`);
    const now = new Date();
    const allStories = await this.storiesRepository.find();
    const expiredStories = allStories.filter(story => story.expirationTime < now);
    for (const story of expiredStories) {
      try {
        await this.storageService.delete(story.filename);
        this.logger.log(`Removed expired story: ${story.filename}`);
      } catch (error) {
        this.logger.error(`Error removing story: ${story.filename}`, error.stack);
      }
    }
  }
   // minuit @Cron('0 0 * * * *')
   @Cron('0 * * * * *')
   async handleCron() {
     try {
       this.logger.log('Cron job started');
       await this.removeExpiredStories();
       this.logger.log('Cron job completed successfully');
     } catch (error) {
       this.logger.error(`Error in cron job: ${error.message}`, error.stack);
     }
   }
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
     const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 24);
      newStory.expirationTime = expirationDate;
    const createdStory = await this.storiesRepository.save(newStory);
    const upload: UploadDto = {
      uploadUrl: url,
      story: createdStory,
    };
    return upload;
  }
  async getAllStories(userId: string): Promise<StoryDto[] | []> {
  return this.storiesRepository.find({
    where: { user: userId },
    select: ['id', 'title', 'user', 'filename', 'format', 'size', 'views', 'creationTime', 'expirationTime'],
    order: {
      creationTime: 'ASC',},
  });
}

}
