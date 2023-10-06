import { Module } from '@nestjs/common';
import { MessageController } from './controllers/messages.controller';
import { ChatController } from './controllers/chats.controller';
import { MessageService } from './services/messages.service';
import { ChatService } from './services/chat.service';

@Module({
  imports: [],
  providers: [MessageService, ChatService],
  controllers: [MessageController, ChatController], // Include your service here
})
export class AppModule {}
