import { PubSub } from '@google-cloud/pubsub';
import { Injectable } from '@nestjs/common';


@Injectable()
export class AppService {

  private pubsub: PubSub;

  constructor() {
    const keyFilename = 'src/poly-chat-400414-79a5abb83393.json';

    // Create the Pub/Sub client with the provided key file
    this.pubsub = new PubSub({ keyFilename });

  }

  getHello(): string {
    return 'Hello World!';
  }

  async subscribeToTopic() {

    const subscription = this.pubsub.subscription("receiver");

    let messageCount = 0;
    const messageHandler = (message) => {
      console.log(`Received message ${message}:`);
      messageCount += 1;

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
