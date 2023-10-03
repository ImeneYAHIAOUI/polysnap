import { MediaMetaData } from 'src/schema/media.schema';

export interface IMediaService {
  getSignedUrlResponse(mediaMetaData: MediaMetaData): Promise<string>;

  verifyMediaExists(mediaMetaData: MediaMetaData): Promise<boolean>;
}
