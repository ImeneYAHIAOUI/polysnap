import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChatService } from 'src/services/chats.service';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}


  @Post()
  async createChat(@Body() chatData: { name: string, participants: string[] }) {
    await this.chatService.createChat(chatData.name, chatData.participants);
    return 'Chat created successfully';
  }

}
