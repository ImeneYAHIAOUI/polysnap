/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MessageService } from 'src/services/messages.service';

@Controller("messages")
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('unread/:userId')
  async getUnreadMessages(
    @Query('chatName') chatId: string,
    @Param('userId') userId: string,
  ): Promise<any[]> {
    return this.messageService.getUnreadMessages(chatId, userId);
  }

  @Get('from-date/:userId')
  async getAllMessagesFromDate(
    @Query('chatName') chatName: string,
    @Param('userId') userId: string,
    @Query('date') date: string,
  ): Promise<any[]> {
    return this.messageService.getAllMessagesFromDate(chatName, userId, new Date(date));
  }

  @Get('/:userId')
  async getAllMessages(
    @Query('chatName') chatName: string,
    @Query('number') number: number,
    @Param('userId') userId: string,
  ): Promise<any[]> {
    return this.messageService.getAllMessagesByNumbers(chatName, userId, number);
  }



}