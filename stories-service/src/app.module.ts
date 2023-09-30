import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { StoryModule } from './story.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [join(__dirname, '**/**.entity{.ts,.js}')],
      synchronize: true,
    }),
    StoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
