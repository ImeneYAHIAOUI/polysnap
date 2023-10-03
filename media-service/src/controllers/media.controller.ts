import { Body, Controller, Get, Inject, Logger, Post } from '@nestjs/common';
import { IMediaService } from 'src/interfaces/media.interface';
import { MediaMetaData } from 'src/schema/media.schema';

@Controller('/media')
export class MediaController {
  private readonly logger = new Logger(MediaController.name);

  constructor(@Inject() private mediaMetaDataService: IMediaService) {}

  @Get()
  healthCheck(): string {
    return 'Media Service is up and runningS';
  }

  @Post('generate-upload-url')
  async getUploadUrl(@Body() mediaMetaData: MediaMetaData): Promise<string> {
    return this.mediaMetaDataService.getSignedUrlResponse(mediaMetaData);
  }

  @Post('check-existence')
  async checkExistence(@Body() mediaMetaData: MediaMetaData): Promise<boolean> {
    return this.mediaMetaDataService.verifyMediaExists(mediaMetaData);
  }
}
