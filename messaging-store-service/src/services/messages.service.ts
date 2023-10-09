/* eslint-disable prettier/prettier */
import { PubSub } from '@google-cloud/pubsub';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Datastore } from '@google-cloud/datastore';
import { randomUUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';




@Injectable()
export class MessageService {

  private pubsub: PubSub;
  private readonly datastore: Datastore;


  constructor( @InjectRepository(User)
  private usersRepository: Repository<User>) {
    this.pubsub = new PubSub();
    this.datastore = new Datastore();
  }

  async subscribeToTopic(requestBody : any) {
 
    console.log('Message Content:', requestBody);

    const data = requestBody.message.data;
    const decodedData = Buffer.from(data, 'base64').toString('utf-8');
    const messageData = JSON.parse(decodedData.toString());
    await this.sendMessage(messageData);
}

  async sendMessage(message) {
    const bool = await this.checkIfChatExists(message.chatId);
    if(!bool) return;
    const chatEntity = {
      key: this.datastore.key('messages'),
      data: {
        id: randomUUID(),
        chatId: message.chatId,
        sender: message.sender,
        content: message.content,
        attachment: message.attachment,
        expiring: message.expiring,
        seenBy: [],
        date: Date.now(),
        expirationTime: message.expirationTime
      }
    };
    console.log('Sending message to the database');
    await this.datastore.save(chatEntity);
  }

  async checkIfUserExists(userId: number): Promise<boolean> {
    const user = await this.usersRepository.findOne({where: { id: userId },});
    if (!user) {
      console.log(`User id ${userId} not found`);
      return false;
    }
    return true;
  }



  async checkIfChatExists(chatId: string): Promise<boolean> {
    const chats = this.datastore.createQuery('chat')
    const [chatEntities] = await this.datastore.runQuery(chats);
    const chat = chatEntities.find((entity) => entity.name === chatId);
    if (!chat) {
      console.log(`Chat ${chatId} not found`);
      return false;
    }
    return true;
  }
  
  async updateMessage(message: any, userId: string): Promise<void> {
    console.log("getting unread message begin updating")
    if (!message.seenBy) {
      message.seenBy = [];
    }
    if(!message.seenBy.includes(userId)) {
        message.seenBy.push(userId);
    }
  
    // Save the updated entity back to the datastore
    await this.datastore.save({
        key: message[this.datastore.KEY],
      data: message,
    });
    console.log("getting unread message end updating")

  }


  async deleteMessage(messageId: string): Promise<void> {

    const query = this.datastore.createQuery('messages');
    const [entities] = await this.datastore.runQuery(query);
    const messageToDelete = entities.find((entity) => entity.id === messageId);
  
    if (!messageToDelete) {
      throw new NotFoundException(`Message ${messageId} not found`);
    }
  
    await this.datastore.delete(messageToDelete[this.datastore.KEY]);

  }

}