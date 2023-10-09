/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Datastore } from '@google-cloud/datastore';
import { MessageService } from './messages.service';
import { Chat } from 'src/entities/chat.entity';
import { addMinutes } from 'date-fns';


@Injectable()
export class MessagesCleanUpService{


    private readonly datastore: Datastore;

    constructor(private readonly messageService: MessageService) {
        this.datastore = new Datastore();

    }

    async getChats() : Promise<Chat[]> {
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
        console.log(messages);

        for (const message of messages) {

            if (message.expiring) {
                if(message.expirationTime != null || message.expirationTime != 0){
                    //const expirationDate = message.expirationTime+ message.date;
                    const expirationDate = addMinutes( message.date, message.expirationTime);

                    console.log("expirationDate" + expirationDate);
                    

                    console.log("message id" + message.id);
                    const currentDate = new Date();
                    console.log("currentDate" + currentDate);
                    if (currentDate >= expirationDate) {
                        console.log("Deleting message " + message.id);
                        await this.messageService.deleteMessage(message.id);
                }
            }else{
                console.log("Deleting message SEEN  " + message.id);
                this.cleanAllReadenMessages(message);
            }
        }
        
    }
}

async cleanAllReadenMessages(message : any)   {
        const participants = await this.getChatParticipantsByName(message.chatId);
        const seenBy = message.seenBy;
        if (seenBy.length === participants.length -1 ) {
            console.log("Deleting message " + message.id);
            this.messageService.deleteMessage(message.id);
        }

        throw new Error('Function not implemented.');
    }


    async getChatParticipantsByName(chatId: string) : Promise<string[]>{
        const chatEntities = this.getChats();
        const chatEntity = (await chatEntities).find((entity) => entity.name === chatId);
        return chatEntity.participants;
    }
}
