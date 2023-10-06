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


}