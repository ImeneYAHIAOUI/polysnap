import { Injectable } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';

import { MessageDTO } from 'src/entities/message.entity';


@Injectable()
export class MessageService {
  private pubsub: PubSub;

  constructor() {
    this.pubsub = new PubSub({
    });
  }

  async publishMessage(message: MessageDTO): Promise<void> {
    try {
      const topicName = 'projects/cloud-398911/topics/message_queue';
      // Publish the message
      const messageId = await this.pubsub
        .topic(topicName)
        .publishJSON(message);

      console.log(`Message ${messageId} published.`);
      console.log('Message published successfully.');
    } catch (error) {
      console.error('Error publishing message:', error);
    }
  }

}

