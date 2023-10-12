import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addMinutes } from 'date-fns';
import { Message } from 'src/entities/message.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class MessageService {
  private readonly messageRepository: Repository<Message>;

  constructor(@InjectRepository(Message) messageRepository: Repository<Message>,
  @InjectRepository(User) userRepository: Repository<User>,
  ) {
    this.messageRepository = messageRepository;
  }

  async findAll(): Promise<Message[]> {
    return this.messageRepository.find({
      order: {
        date: 'ASC'
      }
    });
  }

  async getUnreadMessages(chatId: number, userId: number): Promise<any[]> {
    console.log("getting unread message begin");

    let entities = await this.findAll();
  
    const unreadMessages = entities.filter((entity) => {
      if (!entity.seenBy.includes(userId) && entity.chatId == chatId) {
        if (entity.expirationTime != null && entity.expirationTime != 0) {
          if (addMinutes( entity.date, entity.expirationTime) > new Date()) {
            return true;
          }
        } else {
          return true;
        }
      }
      return false;
    });
    
    console.log("getting unread message end filtering" + unreadMessages.length)

    for (const message of unreadMessages) {
      console.log("messages " + message.toString());
      await this.updateMessage(message, userId);
    }
    console.log("ENDDD")
  
    return unreadMessages;
  }

  async getAllMessagesFromDate(chatId: number, userId: number, specificDate: Date): Promise<any[]> {
  
    console.log("getting all messages begin from date " + specificDate);

    let entities = await this.findAll();
    
    const filteredMessages = entities.filter(entity => new Date(entity.date) >= specificDate
    && entity.chatId == chatId && (
      (!entity.expiring || !entity.seenBy.includes(userId) ) ||
       (( entity.expirationTime != null || entity.expirationTime != 0) && 
        addMinutes(entity.date, entity.expirationTime) > new Date()) ) );
  
      console.log("getting unread message end filtering")

    console.log("getting all messages end filtering");
  
    for (const message of filteredMessages) {
      console.log("messages " + message.toString());
      await this.updateMessage(message, userId);
    }
  
    return filteredMessages;
  }

  
  async getAllMessagesByNumbers(chatId: number, userId: number, n: number): Promise<any[]> {
    console.log("getting all messages begin from date");
  
    let entities = await this.findAll();

    const filteredMessages = entities.filter(entity => ( entity.chatId == chatId && (
      (!entity.expiring || !entity.seenBy.includes(userId)) ||
      ((entity.expirationTime != null || entity.expirationTime != 0) &&
          addMinutes(entity.date, entity.expirationTime) > new Date()))
  ));

  const firstMessages = filteredMessages.slice(0, n);
  
    console.log("getting all messages end filtering");
  
    for (const message of firstMessages) {
      console.log("messages " + message.toString());
      await this.updateMessage(message, userId);
    }
  
    return firstMessages;
  }
  

  async updateMessage(message: any, userId: number): Promise<void> {
    console.log("getting unread message begin updating");
  
    if (!message.seenBy) {
      message.seenBy = [];
    }
      if (!message.seenBy.includes(userId)) {
      message.seenBy.push(userId);
    }
      await this.messageRepository.save(message);
  
    console.log("getting unread message end updating");
  }
  

  async deleteMessage(messageId: number): Promise<void> {
    const messageToDelete = await this.messageRepository.findOne({where: {id: messageId}});
  
    if (!messageToDelete) {
      throw new NotFoundException(`Message ${messageId} not found`);
    }
  
    await this.messageRepository.remove(messageToDelete);
  }
  

}