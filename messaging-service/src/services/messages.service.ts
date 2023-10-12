/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';
import Redis from 'ioredis';
import { MessageDTO } from 'src/entities/message.entity';


@Injectable()
export class MessageService {
  private pubsub: PubSub;
  private redisClient: Redis;
  chatService: any;
  


  constructor() {
    this.pubsub = new PubSub({
    });

    this.redisClient = new Redis({
      host:"bsz2lvjajppi8cmo9frh-redis.services.clever-cloud.com",
      port: 3154,
      password: "7xFUkj6zetIM7P1oPhs",
    });
  }


async getAllMessagesFromRedis(): Promise<MessageDTO[]> {
  try {
    // Get all keys from Redis
    const keys = await this.redisClient.keys('*');
    
    // Create an array to store the parsed messages
    const messages: MessageDTO[] = [];

    // Fetch the values for each key, parse the JSON, and create MessageDTO objects
    for (const key of keys) {
      const value = await this.redisClient.get(key);
      if (value) {
        const parsedValue = JSON.parse(value);
        if (parsedValue) {
          // Ensure the parsed data matches the structure of MessageDTO
          const messageDTO: MessageDTO = {
            chatId: parsedValue.chatId,
            senderId: parsedValue.senderId,
            content: parsedValue.content,
            attachment: parsedValue.attachment,
            expiring: parsedValue.expiring,
            expirationTime: parsedValue.expirationTime,
            date: new Date(),
          };
          messages.push(messageDTO);
        }
      }
    }

    return messages;
  } catch (error) {
    console.error('Error getting messages from Redis:', error);
    throw error;
  }
}


  

  async publishMessage(message: MessageDTO): Promise<void> {
    try {
      const topicName = 'projects/cloud-398911/topics/message_queue';
      
      const timestamp = new Date().getTime(); 
      const random = Math.random().toString(36).substring(2, 10); 

      const uniqueKey = `${timestamp}-${random}`;
      await this.redisClient.set(uniqueKey, JSON.stringify(message));
  

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

