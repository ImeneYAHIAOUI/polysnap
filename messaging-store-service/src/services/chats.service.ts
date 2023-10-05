import { PubSub } from '@google-cloud/pubsub';
import { Injectable } from '@nestjs/common';
import { Datastore } from '@google-cloud/datastore';


@Injectable()
export class ChatService {

  private pubsub: PubSub;
  private readonly datastore: Datastore;

  constructor() {
    this.pubsub = new PubSub();
    this.datastore = new Datastore();
  }

  async createChat(name: string, participants: string[]): Promise<void> {
    const chatEntity = {
      key: this.datastore.key('chat'), 
      data: {
        name : name,
        participants : participants,
      },
    };
    await this.datastore.save(chatEntity);
  }

  async getChatById(id: string): Promise<any | undefined> {
    const key = this.datastore.key(['chat', parseInt(id, 10)]);
    const [entity] = await this.datastore.get(key);
    return entity;
  }

}