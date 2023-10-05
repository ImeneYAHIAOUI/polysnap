import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { StoryService } from '../services/story.service';
import { CreateStoryDto } from '../dto/create-story.dto';
import { StoryDto } from '../dto/story.dto';
import {UploadDto} from "../dto/upload.dto";

@Controller('story')
export class StoryController {
  private readonly logger = new Logger(StoryController.name);

  constructor(private readonly storyService: StoryService) {}

  @Get()
  async hello() {
    return 'Hello from story controller';
  }

  @Get('search')
  async searchStories(@Query('query') query: string) {
    this.logger.log(`Received search request for ${query}`);
    if (!query)
      throw new HttpException('Provide a valid query', HttpStatus.BAD_REQUEST);

    return this.storyService.searchStories(query);
  }

  @Post()
  async createStory(@Body() createStoryDto: CreateStoryDto): Promise<UploadDto> {
    this.logger.log(`Creating a new story`);
    return this.storyService.createStory(createStoryDto);
  }
  @Get('all')
  async getAllStories(@Query('userId')userId : string): Promise<StoryDto[]> {
    this.logger.log(`Getting all stories`);
    return this.storyService.getAllStories(userId);
  }
}
