/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MessageController } from './controllers/messages.controller';
import { MessageService } from './services/messages.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Message } from './entities/message.save.entity';
import { Chat } from './entities/chat.entity';
import { ChatService } from './services/chats.service';

@Module({
  
  imports: [ HttpModule,
    TypeOrmModule.forFeature([Message, Chat]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '/cloudsql/cloud-final-402019:europe-west9:polysnap',
      port: 5432,
      username: 'user',
      password: 'storypassword',
      database: 'message',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),],
  controllers: [MessageController],
  providers: [MessageService, ChatService]
})
export class AppModule {
  
}
