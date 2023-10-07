/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Datastore } from '@google-cloud/datastore';
import { MessageService } from './messages.service';


@Injectable()
export class MessagesCleanUpService{


    private readonly datastore: Datastore;

    constructor(private readonly messageService: MessageService) {
        this.datastore = new Datastore();

    }

    async getChats() {
        const chats = this.datastore.createQuery('chat');
        const [chatEntities] = await this.datastore.runQuery(chats);
        return chatEntities;
    }

    async getMessages() {
        const messages = this.datastore.createQuery('messages');
        const [messageEntities] = await this.datastore.runQuery(messages);
        return messageEntities;
    }


    async cleanUpMessages(): Promise<void> {
        
        const messages = await this.getMessages();
        for (const message of messages) {
            if (message.expirationDate) {
                const messageDate = new Date(message.expirationDate);
                const currentDate = new Date();
                if (currentDate >= messageDate) {
                    await this.messageService.deleteMessage(message.id);
                }
            }
        }
        
    }
}