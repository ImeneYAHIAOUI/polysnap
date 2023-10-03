// your.service.ts

import { Injectable } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';

@Injectable()
export class AppService {
  private pubsub: PubSub;

  constructor() {
    this.pubsub = new PubSub({
      //projectId: 'poly-chat-400414',
      //keyFilename: 'poly-chat-400414-0e1e2e3f4f5a.json',
    });
  }

  async publishMessage(topicName: string, message: string): Promise<void> {
    message = 'Hello World!';
    const dataBuffer = Buffer.from(message);

    const sent = {
      data: dataBuffer,
    };

    try {
      const messageId = await this.pubsub
        .topic('projects/platinum-factor-367914/topics/message_queue')
        .publishMessage(sent);

      console.log(`Message ${messageId} published.`);

      console.log('Message published successfully.');
    } catch (error) {
      console.error('Error publishing message:', error);
    }
  }
}
