import {
  Controller,
  Get,
  Query,
  Logger,
} from '@nestjs/common';

import { StorageService } from '../services/storage.service';

@Controller('storage')
export class StorageController {
  private readonly logger = new Logger(StorageController.name);

  constructor(private readonly storageService: StorageService) {}
  @Get('uploadUrl')
  async getUploadUrl(@Query('fileName') fileName: string): Promise<string> {
    try {
      this.logger.log(`Attempting to generate upload URL for file: ${fileName}`);
      const url = await this.storageService.generate(fileName);
      this.logger.log(`Successfully generated upload URL for file: ${fileName}`, url);
      return url;
    } catch (error) {
      this.logger.error(`Error generating upload URL for file: ${fileName}`, error);
    }
  }
  @Get('download')
  async download(@Query('fileName') fileName: string): Promise<{ content: Buffer, url: string }> {
    try {
      this.logger.log('Attempting to download file:', fileName);
      const { content, url } = await this.storageService.download(fileName);
      this.logger.log('File downloaded successfully:', fileName);
      return { content, url };
    } catch (error) {
      if (error instanceof FileNotFoundError) {
        this.logger.error('File not found:', error);
      } else {
        this.logger.error('Error during file download:', error);
      }
    }
  }




}
