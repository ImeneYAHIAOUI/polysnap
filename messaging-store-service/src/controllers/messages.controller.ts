import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessageService } from 'src/services/messages.service';

@Controller("messages")
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  async subscribeToTopic() {
    console.log("testing subscription");
    this.messageService.subscribeToTopic();
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