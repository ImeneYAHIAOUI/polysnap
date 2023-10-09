import { PubSub } from '@google-cloud/pubsub';
import { Injectable } from '@nestjs/common';
import { Datastore } from '@google-cloud/datastore';
import { Chat } from 'src/entities/chat.entity';


@Injectable()
export class ChatService {

  private pubsub: PubSub;
  private readonly datastore: Datastore;

  constructor() {
    this.pubsub = new PubSub();
    this.datastore = new Datastore();
  }

  async createChat(name: string, participants: string[]): Promise<void> {
   // check if particiapnts are in db
    const chatEntity = {
      key: this.datastore.key('chat'), 
      data: {
        name : name,
        participants : participants,
      },
    };
    await this.datastore.save(chatEntity);


  }

  async getChatForUser(idUser: string): Promise<Chat[]> {
    const chatEntities = await this.getChats();
    const chatEntitiesResult = chatEntities.filter((entity) =>
      entity.participants.includes(idUser)
    );
    return chatEntitiesResult;
  }

  
  async getChats(): Promise<Chat[]> {
    const chatsQuery = this.datastore.createQuery('chat');
    const [chatEntities] = await this.datastore.runQuery(chatsQuery);
    const chats = chatEntities.map((entity) => ({
      id: entity.id,
      name: entity.name,
      participants: entity.participants,
    }));
    return chats;
  }


}