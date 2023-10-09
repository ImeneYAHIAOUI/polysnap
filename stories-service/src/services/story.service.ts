import { Injectable, Logger } from '@nestjs/common';
import { StoryDto } from '../dto/story.dto';
import { CreateStoryDto } from '../dto/create-story.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, MoreThanOrEqual } from 'typeorm';
import { Story } from '../entities/story.entity';
import { StorageService } from './storage.service';
import { UploadDto } from '../dto/upload.dto';
import { Cron } from '@nestjs/schedule';
import { DownloadDto } from '../dto/Download.dto';
import { UsersProxyService } from './users-service-proxy/user-service-proxy.service';

@Injectable()
export class StoryService {
  private readonly logger = new Logger(StoryService.name);

  constructor(
    @InjectRepository(Story)
    private storiesRepository: Repository<Story>,
    private storageService: StorageService,
    private readonly usersProxyService: UsersProxyService,
  ) {}

  async removeExpiredStories() {
    this.logger.log(`Removing expired stories`);
    const now = new Date();
    const allStories = await this.storiesRepository.find();
    const expiredStories = allStories.filter(
      (story) => story.expirationTime < now,
    );
    for (const story of expiredStories) {
      try {
        await this.storageService.delete(story.filename);
        this.logger.log(`Removed expired story: ${story.filename}`);
      } catch (error) {
        this.logger.error(
          `Error removing story: ${story.filename}`,
          error.stack,
        );
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
      where: [{ title: Like(`%${query}%`) }],
      select: ['id', 'title', 'userId', 'filename', 'format', 'views'],
    });
  }

  async createStory(createStoryDto: CreateStoryDto): Promise<UploadDto> {
    this.logger.log(`Creating story ${JSON.stringify(createStoryDto)}`);

    const url = await this.storageService.generate(createStoryDto.filename);
    const newStory = this.storiesRepository.create({
      title: createStoryDto.title,
      userId: createStoryDto.userId,
      filename: createStoryDto.filename,
      format: createStoryDto.format,
      views: 0, // Assuming you initialize views to 0
    });
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 24);
    newStory.expirationTime = expirationDate;
    const createdStory = await this.storiesRepository.save(newStory);
    return {
      uploadUrl: url,
      story: createdStory,
    };
  }

  async getAllStories(userId: number): Promise<StoryDto[] | []> {
    return this.storiesRepository.find({
      where: { userId: userId },
      select: [
        'id',
        'title',
        'userId',
        'filename',
        'format',
        'views',
        'creationTime',
        'expirationTime',
      ],
      order: {
        creationTime: 'ASC',
      },
    });
  }

  async getAllStoriesForContact(userId: number): Promise<DownloadDto[] | []> {
    const contactList = await this.usersProxyService.getContactOfUser(userId);
    const currentDateTime = new Date();
    currentDateTime.setMilliseconds(0);
    const storyList = await this.storiesRepository.find({
      where: [
        { userId: userId, expirationTime: MoreThanOrEqual(currentDateTime) },
      ],
    });
    const storiesDownload: DownloadDto[] = [];
    for (const story of storyList) {
      const url = await this.storageService.download(
        story.filename,
        userId,
        userId,
      );
      const download: DownloadDto = {
        downloadUrl: url,
        story: story,
      };
      storiesDownload.push(download);
    }

    for (const contact of contactList) {
      const stories = await this.storiesRepository.find({
        where: [
          {
            userId: contact.id,
            expirationTime: MoreThanOrEqual(currentDateTime),
          },
        ],
      });
      for (const story of stories) {
        console.log(story.expirationTime, currentDateTime);
        const url = await this.storageService.download(
          story.filename,
          userId,
          contact.id,
        );
        const download: DownloadDto = {
          downloadUrl: url,
          story: story,
        };
        storiesDownload.push(download);
      }
    }

    return storiesDownload;
  }
}
