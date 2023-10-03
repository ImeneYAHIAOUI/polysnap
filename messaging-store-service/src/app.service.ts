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
    const [subscription] = await this.pubsub
      .topic('projects/poly-chat-400414/topics/messaging_queue_topic')
      .createSubscription("receiver");

    subscription.on('message', (message) => {
      console.log("receive message "+ message);
      message.ack();
    });
  }
}
