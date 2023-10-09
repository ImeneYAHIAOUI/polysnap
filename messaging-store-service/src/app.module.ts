/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MessageController } from './controllers/messages.controller';
import { MessageService } from './services/messages.service';

import { MessagesCleanUpService } from './services/messagesCleanUp.service';
import { MessageCleanupController } from './controllers/messagesCleanUp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';


@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.POSTGRESQL_ADDON_HOST,
    port: 5432,
    username: process.env.POSTGRESQL_ADDON_USER,
    password: process.env.POSTGRESQL_ADDON_PASSWORD,
    database: process.env.POSTGRESQL_ADDON_DB,
    entities: [join(__dirname, '**/**.entity{.ts,.js}')],
    synchronize: true,
  })],
  controllers: [MessageController, MessageCleanupController],
  providers: [MessageService, MessagesCleanUpService],
})
export class AppModule {
  
}
