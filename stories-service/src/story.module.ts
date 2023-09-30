import { Module } from '@nestjs/common';
import { StoryController } from './controllers/story.controller';
import { StoryService } from './services/story.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Story } from './enteties/story.entity';

@Module({
  controllers: [StoryController],
  providers: [StoryService],
  imports: [TypeOrmModule.forFeature([Story])],
})
export class StoryModule {}
