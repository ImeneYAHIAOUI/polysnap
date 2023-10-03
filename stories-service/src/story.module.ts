import { Module } from '@nestjs/common';
import { StoryController } from './controllers/story.controller';
import { StoryService } from './services/story.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Story } from './entities/story.entity';
import {StorageService} from "./services/storage.service";

@Module({
  controllers: [StoryController],
  providers: [StoryService, StorageService],
  imports: [TypeOrmModule.forFeature([Story])],
})
export class StoryModule {}
