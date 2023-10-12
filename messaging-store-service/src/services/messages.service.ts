/* eslint-disable prettier/prettier */
import { PubSub } from '@google-cloud/pubsub';
import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from 'src/entities/message.save.entity';
import { ChatService } from './chats.service';

@Injectable()
export class MessageService {

  private pubsub: PubSub;


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
 
    console.log('Message Content:', requestBody);

    const data = requestBody.message.data;
    const decodedData = Buffer.from(data, 'base64').toString('utf-8');
    const messageData = JSON.parse(decodedData.toString());

    const chatId = messageData.chatId;
    const chatExists = await this.chatService.findChatById(chatId);
  
    if (!chatExists) {
      throw new NotFoundException(`Chat with id ${chatId} not found`);
    }
  
    const savedMessage = await this.messageRepository.save(messageData);
    return savedMessage;

}


  async checkIfUserExists(userId: number): Promise<boolean> {

    const usersUrl = "https://users-dot-cloud-398911.lm.r.appspot.com/users/lookup?id=" + userId;
    const response = await fetch(usersUrl);
    const data = await response.json();
    if (!data) {
      console.log(`User id ${userId} not found`);
      return false;
    }
    return true;
  }



}