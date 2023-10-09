/* eslint-disable prettier/prettier */
import { PubSub } from '@google-cloud/pubsub';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Datastore } from '@google-cloud/datastore';
import { randomUUID } from 'crypto';
import { addMinutes } from 'date-fns';


@Injectable()
export class MessageService {

  private pubsub: PubSub;
  private readonly datastore: Datastore;


  constructor() {
    this.pubsub = new PubSub();
    this.datastore = new Datastore();
  }

  async checkIfChatExists(chatId: string): Promise<boolean> {
    const chats = this.datastore.createQuery('chat')
    const [chatEntities] = await this.datastore.runQuery(chats);
    const chat = chatEntities.find((entity) => entity.name === chatId);
    if (!chat) {
      throw new NotFoundException(`Chat ${chatId} not found`);
    }
    return true;
  }

  async getMessages() {
    const messages = this.datastore.createQuery('messages');
    const [messageEntities] = await this.datastore.runQuery(messages);
    return messageEntities;
}

  async getUnreadMessages(chatId: string, userId: string): Promise<any[]> {

    const chat = this.checkIfChatExists(chatId);

    if (!chat) {
        throw new NotFoundException(`Chat ${chatId} not found`);
    }

    console.log("getting unread message begin")

    const query = this.datastore
    .createQuery('messages');

  const [entities] = await this.datastore.runQuery(query);
    const unreadMessages = entities.filter((entity) => {
      if (!entity.seenBy.includes(userId) && entity.chatId === chatId) {
        
        if (entity.timeToExpire != null && entity.timeToExpire !== 0) {
          if (addMinutes( entity.date, entity.expirationTime) > new Date()) {
            return true;
          }
        } else {
          return true;
        }
      }
      return false;
    });
    
    console.log("getting unread message end filtering")

    for (const message of unreadMessages) {
        console.log("messages "+ message.toString())
      await this.updateMessage(message, userId);
    }
    return unreadMessages;
  }

  async getAllMessagesFromDate(chatId: string, userId: string, specificDate : Date): Promise<any[]> {

    const chat = this.checkIfChatExists(chatId);

    if (!chat) {
      throw new NotFoundException(`Chat ${chatId} not found`);
    }

    console.log("getting all messages begin from date "+ specificDate)
    const query = this.datastore
    .createQuery('messages');

  const [entities] = await this.datastore.runQuery(query);
    const filteredMessages = entities.filter(entity => new Date(entity.date) >= specificDate && 
    (!entity.expiring || !entity.seenBy.includes(userId) ) ||
     (( entity.expirationTime != null || entity.expirationTime != 0) && 
      addMinutes( entity.date, entity.expirationTime) > new Date()) );

  
    console.log("getting unread message end filtering")

    for (const message of filteredMessages) {
        console.log("messages "+ message.toString())
      await this.updateMessage(message, userId);
    }
    return filteredMessages;
  }

  
  async updateMessage(message: any, userId: string): Promise<void> {
    console.log("getting unread message begin updating")
    // Update the entity to mark it as seen by the user
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