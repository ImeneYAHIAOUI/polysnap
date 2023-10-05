import { Module } from '@nestjs/common';
import { MessageController } from './controllers/messages.controller';
import { ChatController } from './controllers/chats.conttoller';
import { MessageService } from './services/messages.service';
import { ChatService } from './services/chats.service';

@Module({
  imports: [],
  controllers: [MessageController, ChatController],
  providers: [MessageService, ChatService],
})
export class AppModule {}