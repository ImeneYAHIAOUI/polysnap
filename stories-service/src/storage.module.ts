import { Module } from '@nestjs/common';
import { StorageController } from './controllers/storage.controller';
import { StorageService } from './services/storage.service';

@Module({
  controllers: [StorageController],
  providers: [StorageService],
})
export class StorageModule {}
