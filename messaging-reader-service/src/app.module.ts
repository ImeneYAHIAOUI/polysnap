import { Module } from '@nestjs/common';
import { MessageController } from './controllers/messages.controller';
import { MessageService } from './services/messages.service';
import { MessagesCleanUpService } from './services/messagesCleanUp.service';
import { MessageCleanupController } from './controllers/messagesCleanUp.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Chat } from './entities/chat.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Message, Chat, User]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '/cloudsql/cloud-final-402019:europe-west9:polysnap',
      port: 5432,
      username: 'user',
      password: 'storypassword',
      database: 'message',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      }),
  ],
  controllers: [MessageController, MessageCleanupController],
  providers: [MessageService, MessagesCleanUpService],
})
export class AppModule {}
