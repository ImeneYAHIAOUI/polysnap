import { Injectable, Logger } from '@nestjs/common';
import { StoryDto } from '../dto/story.dto';
import { CreateStoryDto } from '../dto/create-story.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, MoreThanOrEqual } from 'typeorm';
import { Story } from '../entities/story.entity';
import { StorageService } from './storage.service';
import { UploadDto } from '../dto/upload.dto';

import { DownloadDto } from '../dto/Download.dto';
import { UsersProxyService } from './users-service-proxy/user-service-proxy.service';
import { SaveStoryDto } from '../dto/saveStory.dto';

@Injectable()
export class StoryService {
  private readonly logger = new Logger(StoryService.name);
  constructor(
    @InjectRepository(Story)
    private storiesRepository: Repository<Story>,
    private storageService: StorageService,
    private readonly usersProxyService: UsersProxyService,
  ) {}
async emptyStoriesDB(): Promise<void> {
  await this.storiesRepository.clear();
}
async removeExpiredStories(): Promise<void> {
  const now = new Date();
  const allStories = await this.storiesRepository.find();
  const expiredStories = allStories.filter(
    (story) => !story.isRemoved && story.expirationTime < now,
  );

  for (const story of expiredStories) {
    this.logger.log(`Removing expired stories`);
    try {
      await this.storageService.delete(story.filename);
      story.isRemoved = true;
      await this.storiesRepository.save(story);
      this.logger.log(`Removed expired story: ${story.filename}`);
    } catch (error) {
      this.logger.error(`Error removing story: ${story.filename}`, error.stack);
    }
  }
}


  async searchStories(query: string): Promise<StoryDto[] | []> {
    this.logger.log(`Searching for stories with query ${query}`);
    return this.storiesRepository.find({
      where: [{ title: Like(`%${query}%`) }],
      select: ['id', 'title', 'userId', 'filename', 'format'],
    });
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

  async saveStory(saveStoryDto: SaveStoryDto) {
    const newStory = this.storiesRepository.create({
      title: saveStoryDto.title,
      userId: saveStoryDto.userId,
      filename: saveStoryDto.filename,
      format: saveStoryDto.format,
    });
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 24);
    newStory.expirationTime = expirationDate;
    const createdStory = await this.storiesRepository.save(newStory);
    return createdStory;
  }

  async createStory(createStoryDto: CreateStoryDto): Promise<UploadDto> {
    this.logger.log(`Creating story ${JSON.stringify(createStoryDto)}`);
    const url = await this.storageService.generate(createStoryDto.filename);
    return {
      uploadUrl: url,
    };
  }
}
