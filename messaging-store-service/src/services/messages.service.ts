import { PubSub } from '@google-cloud/pubsub';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Datastore } from '@google-cloud/datastore';


@Injectable()
export class MessageService {

  private pubsub: PubSub;
  private readonly datastore: Datastore;

  constructor() {
    this.pubsub = new PubSub();
    this.datastore = new Datastore();
  }

  async subscribeToTopic() {
    const subscriptionName = 'receiver';
    const subscription = this.pubsub.subscription(subscriptionName);

    let messageCount = 0;
    const messageHandler = async (message) => {
      console.log(`Received message ${message.id}:`);
      messageCount += 1;

      console.log('Message Content:', message.data.toString());
      const messageData = JSON.parse(message.data.toString());
      await this.sendMessage(messageData);
      // "Ack" (acknowledge receipt of) the message
      message.ack();
    };

    subscription.on('message', messageHandler);

    setTimeout(() => {
      subscription.removeListener('message', messageHandler);
      console.log(`${messageCount} message(s) received.`);
    }, 5 * 1000);

  }

  async sendMessage(message) {
    const chatEntity = {
      key: this.datastore.key('messages'),
      data: {
        chatId: message.chatId,
        sender: message.sender,
        content: message.content,
        attachment: message.attachment,
        expiring: message.expiring,
        seenBy : [],
      },
    };
    console.log("Sending message to the database");
    await this.datastore.save(chatEntity);
  }

  async getUnreadMessages(chatId: string, userId: string): Promise<any[]> {

    console.log("getting unread message begin")
    const query = this.datastore
      .createQuery('messages');
  
    const [entities] = await this.datastore.runQuery(query);
    const unreadMessages = entities.filter((entity) => !entity.seenBy.includes(userId) && entity.chatId === chatId);
  
    console.log("getting unread message end filtering")

    // Update all the unread messages to mark them as seen by the user
    for (const message of unreadMessages) {
        console.log("messages "+ message.toString())
      await this.updateMessage(message, userId);
    }

  
    return unreadMessages;
  }
  
  async updateMessage(message: any, userId: string): Promise<void> {
    console.log("getting unread message begin updating")
    // Update the entity to mark it as seen by the user
    if (!message.seenBy) {
      message.seenBy = [];
    }
    message.seenBy.push(userId);
  
    // Save the updated entity back to the datastore
    await this.datastore.save({
        key: message[this.datastore.KEY],
      data: message,
    });
    console.log("getting unread message end updating")

  }

}