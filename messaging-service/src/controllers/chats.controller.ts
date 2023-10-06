import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Chat } from 'src/entities/chat.entity';
import { ChatService } from 'src/services/chat.service';

@Controller("chats")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}


  @Post()
  async createChat(@Body() chatData: Chat) {
    await this.chatService.createChat(chatData.name, chatData.participants);
    return 'Chat created successfully';
  }


}