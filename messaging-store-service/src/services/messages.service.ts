/* eslint-disable prettier/prettier */
import { PubSub } from '@google-cloud/pubsub';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Datastore } from '@google-cloud/datastore';
import { randomUUID } from 'crypto';


@Injectable()
export class MessageService {

  private pubsub: PubSub;
  private readonly datastore: Datastore;


  constructor() {
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
        expirationDate: message.expirationDate,
      },
    };
    console.log('Sending message to the database');
    await this.datastore.save(chatEntity);
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


  async getUnreadMessages(chatId: string, userId: string): Promise<any[]> {

    const chat = this.checkIfChatExists(chatId);

    if (!chat) {
        throw new NotFoundException(`Chat ${chatId} not found`);
    }

    console.log("getting unread message begin")
    const query = this.datastore
      .createQuery('messages');
  
    const [entities] = await this.datastore.runQuery(query);
    const unreadMessages = entities.filter((entity) => !entity.seenBy.includes(userId) && entity.chatId === chatId);
  
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
    (!entity.expiring || !entity.seenBy.includes(userId)));

  
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