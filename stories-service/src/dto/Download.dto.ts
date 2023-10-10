import { StoryDto } from './story.dto';

export class DownloadDto {
  downloadUrl: {
    content: Buffer;
    url: string;
  };
  story: StoryDto;
}
