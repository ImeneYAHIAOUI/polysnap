import { Module } from '@nestjs/common';
import { StoriesModule } from './stories.module';
import { StorageModule } from './storage.module';

@Module({
  imports: [StoriesModule,StorageModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
