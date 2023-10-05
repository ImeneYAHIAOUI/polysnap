import { Controller, Post, Get } from '@nestjs/common';
import { AppService } from './app.service';


@Controller('messages')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async createMessage() {
    await this.appService.publishMessage(
      'projects/platinum-factor-367914/topics/message_queue',
      'Hello World!');
    
      return 'Message published';
  }

  @Get('test')
  async test() {
      return 'test';
  }
}