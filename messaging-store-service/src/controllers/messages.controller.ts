/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessageService } from 'src/services/messages.service';
import {Datastore} from "@google-cloud/datastore";

@Controller("messages")
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async subscribeToTopic(@Body() requestBody: any) {
    console.log('Received request body:', requestBody);
    this.messageService.subscribeToTopic(requestBody);
    return 'Subscribed to topic';
  }

}