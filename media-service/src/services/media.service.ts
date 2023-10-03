import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IMediaService } from 'src/interfaces/media.interface';
import { MediaMetaData } from 'src/schema/media.schema';
import { MediaNotFoundException } from 'src/exceptions/MediaNotFound';

@Injectable()
export class MediaService implements IMediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    @InjectRepository(MediaMetaData)
    private mediaMetaDataRepository: Repository<MediaMetaData>,
  ) {}

  async getSignedUrlResponse(mediaMetaData: MediaMetaData): Promise<string> {
    this.logger.log(
      `Getting signed URL to upload ${JSON.stringify(mediaMetaData)}`,
    );
    const storage = new Storage();

    const options = {
      version: 'v4' as const,
      action: 'write' as const,
      expires: Date.now() + 60 * 60 * 1000, // 5 minutes
      contentType: 'application/octet-stream',
    };

    const { filename, filetype, uploaderId, extension, expirationdate } =
      mediaMetaData;

    const path = `/media/${filetype}/${filename}.${extension}`;

    // Get a v4 signed URL for uploading file
    const [url] = await storage
      .bucket(process.env.GCLOUD_STORAGE_MEDIA_BUCKET)
      .file(path)
      .getSignedUrl(options);

    url &&
      (await this.mediaMetaDataRepository.create({
        filename,
        filetype,
        uploaderId,
        extension,
        expirationdate,
      }));

    return url;
  }

  async verifyMediaExists(mediaMetaData: MediaMetaData): Promise<boolean> {
    this.logger.log(`Verifying media ${JSON.stringify(mediaMetaData)} exists`);
    const { filename, filetype, uploaderId, extension, expirationdate } =
      mediaMetaData;
    const res = await this.mediaMetaDataRepository.findOne({
      filename,
      filetype,
      uploaderId,
      extension,
      expirationdate,
    });
    if (!res) {
      this.logger.error(`Media ${JSON.stringify(mediaMetaData)} not found`);
      throw new MediaNotFoundException();
    }
    return true;
  }
}
