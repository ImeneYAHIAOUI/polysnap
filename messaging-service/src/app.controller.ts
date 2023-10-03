import { Controller, Post, Get } from '@nestjs/common';
import { AppService } from './app.service';


@Controller('messages')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async createMessage() {
    await this.appService.publishMessage(
      'projects/poly-chat-400414/topics/messaging_queue_topic',
      'Hello World!');
    
      return 'Message published';
  }

  @Get('test')
  async test() {
      return 'test';
  }
}
