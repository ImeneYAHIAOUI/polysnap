import { Story } from '../schema/story.schema';
import { CreateStoryDto } from '../dto/create-story.dto';
import { StoryDto } from '../dto/story.dto';

export interface IStoriesInterface {
  searchStories(query: string): Promise<Story[]>;
  createStory(createStoryDto: CreateStoryDto): Promise<StoryDto>;
}
