/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MessageService } from 'src/services/messages.service';
import {Datastore} from "@google-cloud/datastore";

@Controller("messages")
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('unread/:chatId/:userId')
  async getUnreadMessages(
    @Param('chatId') chatId: string,
    @Param('userId') userId: string,
  ): Promise<any[]> {
    return this.messageService.getUnreadMessages(chatId, userId);
  }

  @Get('from-date/:chatId/:userId/:date')
  async getAllMessagesFromDate(
    @Param('chatId') chatId: string,
    @Param('userId') userId: string,
    @Param('date') specificDate: string,
  ): Promise<any[]> {
    
    const date = new Date(specificDate);

    return this.messageService.getAllMessagesFromDate(chatId, userId, date);
  }

}