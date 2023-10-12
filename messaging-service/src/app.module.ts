import { Module } from '@nestjs/common';
import { MessageController } from './controllers/messages.controller';
import { ChatController } from './controllers/chats.controller';
import { MessageService } from './services/messages.service';
import { ChatService } from './services/chat.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';

@Module({
  imports: [ HttpModule,
    TypeOrmModule.forFeature([Chat]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '/cloudsql/cloud-398911:us-central1:polysnap',
      port: 5432,
      username: 'user',
      password: 'storypassword',
      database: 'message',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),],
  providers: [MessageService, ChatService],
  controllers: [MessageController, ChatController], // Include your service here
})
export class AppModule {}
