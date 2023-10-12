/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MessageService } from 'src/services/messages.service';

@Controller("messages")
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('unread')
  async getUnreadMessages(
    @Query('chatId') chatId: number,
    @Query('userId') userId: number,
  ): Promise<any[]> {
    return this.messageService.getUnreadMessages(chatId, userId);
  }

  @Get()
  async get(
  ): Promise<any[]> {
    return this.messageService.findAll();
  }

  @Get('from-date')
  async getAllMessagesFromDate(
    @Query('chatId') chatId: number,
    @Query('userId') userId: number,
    @Query('date') date: number,
  ): Promise<any[]> {
    return this.messageService.getAllMessagesFromDate(chatId, userId, new Date(date));
  }

  @Get('/:userId')
  async getAllMessages(
    @Query('chatId') chatId: number,
    @Query('number') number: number,
    @Param('userId') userId: number,
  ): Promise<any[]> {
    return this.messageService.getAllMessagesByNumbers(chatId, userId, number);
  }



}