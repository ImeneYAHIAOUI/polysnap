import { Module } from '@nestjs/common';
import { MessageController } from './controllers/messages.controller';
import { MessageService } from './services/messages.service';

@Module({
  imports: [],
  controllers: [MessageController],
  providers: [MessageService],
})
export class AppModule {}
