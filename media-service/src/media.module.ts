import { Logger, Module } from '@nestjs/common';
import { MediaController } from './controllers/media.controller';
import { MediaService } from './services/media.service';

@Module({
  imports: [],
  controllers: [MediaController],
  providers: [MediaService, Logger],
  exports: [MediaService],
})
export class MediaModule {}
