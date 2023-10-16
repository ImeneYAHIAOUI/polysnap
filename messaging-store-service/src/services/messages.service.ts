/* eslint-disable prettier/prettier */
import { PubSub } from '@google-cloud/pubsub';
import { Injectable, NotFoundException, OnApplicationShutdown, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from 'src/entities/message.save.entity';
import { ChatService } from './chats.service';

@Injectable()
export class MessageService implements OnApplicationShutdown {

  private readonly logger = new Logger(MessageService.name);

  private pubsub: PubSub;

  onApplicationShutdown() {
    this.logger.warn('Intercepting SIGNTERM');
    this.closeDBConnection();
  }

  closeDBConnection() {
    this.logger.log('DB conn closed');
  }

  constructor( @InjectRepository(Message)
  private messageRepository: Repository<Message>,private chatService: ChatService ) {
    this.pubsub = new PubSub();
  }

  async addMessage(message : Message): Promise<Message> {
    message.date = new Date();
    const savedMessage = await this.messageRepository.save(message);
    return savedMessage;
  }

  async getAllMessages(): Promise<Message[]> {
    return this.messageRepository.find();
  }

  async subscribeToTopic(requestBody : any) {
 
    console.log('Subscribing to topic');

    const data = requestBody.message.data;
    const decodedData = Buffer.from(data, 'base64').toString('utf-8');
    const messageData = JSON.parse(decodedData.toString());
    const savedMessage = await this.messageRepository.save(messageData);

    return savedMessage;

  }

}