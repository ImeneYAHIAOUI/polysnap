import {
  Body,
  Controller,
  Get,
  Param,
  Query,
  Post,
  Put,
  Logger,
  HttpCode,
  Delete,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';

import { StoriesService } from '../services/stories.service';
import { StoryDto } from '../dto/story.dto';
import { CreateStoryDto } from '../dto/create-story.dto';
import {IStoriesInterface} from "../interfaces/stories.interface";

@Controller('/stories')
export class StoriesController {
  private readonly logger = new Logger(StoriesController.name);
  constructor(
    @Inject(StoriesService.name)
    private readonly storiesService: IStoriesInterface,
  ) {}

  @Get('search')
  async searchStories(@Query('query') query: string) {
    this.logger.log(`Received search request for ${query}`);
    if (!query)
      throw new HttpException('Provide a valid query', HttpStatus.BAD_REQUEST);

    return this.storiesService.searchStories(query);
  }

  @Post()
  async createStory(@Body() createStoryDto: CreateStoryDto): Promise<StoryDto> {
    this.logger.log(`Creating a new story`);
    return this.storiesService.createStory(createStoryDto);
  }
}