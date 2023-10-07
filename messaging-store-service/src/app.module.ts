import { Module } from '@nestjs/common';
import { MessageController } from './controllers/messages.controller';
import { MessageService } from './services/messages.service';
import { MessagesCleanUpService } from './services/messagesCleanUp.service';
import { MessageCleanupController } from './controllers/messagesCleanUp.controller';

@Module({
  imports: [],
  controllers: [MessageController, MessageCleanupController],
  providers: [MessageService, MessagesCleanUpService],
})
export class AppModule {}
