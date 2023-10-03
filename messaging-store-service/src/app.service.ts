import { PubSub } from '@google-cloud/pubsub';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  private pubsub: PubSub;

  constructor() {
    this.pubsub = new PubSub();
  }

  getHello(): string {
    return 'Hello World!';
  }

  async subscribeToTopic() {
    const subscriptionName = 'receiver';
    const subscription = this.pubsub.subscription(subscriptionName);

    let messageCount = 0;
    const messageHandler = (message) => {
      console.log(`Received message ${message.id}:`);
      messageCount += 1;

      // Log the content of the message
      console.log('Message Content:', message.data.toString());

      // "Ack" (acknowledge receipt of) the message
      message.ack();
    };

    subscription.on('message', messageHandler);

    setTimeout(() => {
      subscription.removeListener('message', messageHandler);
      console.log(`${messageCount} message(s) received.`);
    }, 5 * 1000);
  }
}
