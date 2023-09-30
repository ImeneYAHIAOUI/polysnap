import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';


@Controller('messages')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async createMessage(
    @Body() messageData: { topicName: string; message: string },
  ) {
    const { topicName, message } = messageData;
    await this.appService.publishMessage(topicName, message);
    return 'Message published';
  }
}
