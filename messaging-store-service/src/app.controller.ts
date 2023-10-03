import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('subscribe')
  async subscribeToTopic() {
    console.log("testing subscription");
    this.appService.subscribeToTopic();

    return 'Subscribed to topic';
  }

}
