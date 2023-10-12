import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from 'src/entities/chat.entity';

@Injectable()
export class ChatService {
  constructor(@InjectRepository(Chat) private chatRepository: Repository<Chat>) {}

  async findChatByName(name: string): Promise<Boolean> {
    const chat = await this.chatRepository.findOne({ where: { name: name } });
    if (!chat) {
      return false;
    }
    return true;
  }

  async addChat(chatData: Chat): Promise<Chat> {
    const chatExists = await this.findChatByName(chatData.name);
    if (chatExists) {
      return null;
    }
    const newChat = this.chatRepository.create(chatData);
    return this.chatRepository.save(newChat);
  }

  async findAllChats(): Promise<Chat[]> {
    return this.chatRepository.find();
  }

  async deleteAllChats(): Promise<void> {
    await this.chatRepository.delete({}); // Deletes all chat entities
  }

  async findChatById(id: number): Promise<Chat> {
    const chat = await this.chatRepository.findOne({ where: { id: id } });
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }
    return chat;
  }

  async deleteChatById(id: number): Promise<void> {
    const chat = await this.chatRepository.findOne({ where: { id: id } });
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }
    await this.chatRepository.remove(chat);
  }
}
