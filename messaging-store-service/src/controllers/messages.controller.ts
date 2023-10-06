import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessageService } from 'src/services/messages.service';

@Controller("messages")
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async subscribeToTopic(@Body() requestBody: any) {
    console.log('Received request body:', requestBody);
    this.messageService.subscribeToTopic(requestBody);
    return 'Subscribed to topic';
  }

  @Get('unread/:chatId/:userId')
  async getUnreadMessages(
    @Param('chatId') chatId: string,
    @Param('userId') userId: string,
  ): Promise<any[]> {
    return this.messageService.getUnreadMessages(chatId, userId);
  }

}