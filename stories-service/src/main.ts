import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  try {
    const { PORT } = process.env;

    if (!PORT) {
      throw new Error('PORT environment variable is not defined');
    }

    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({ origin: ['http://localhost:3001'], credentials: true });
    app.useGlobalPipes(new ValidationPipe());
    app.set('trust proxy', 'loopback');

    await app.listen(PORT, () => {
      console.log(`Running on Port ${PORT}`);
      console.log(
        `Running in ${process.env.ENVIRONMENT} mode: ${process.env.ENVIRONMENT_MESSAGE}`,
      );
    });

    const config = new DocumentBuilder()
      .setTitle('Your API')
      .setDescription('API description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);

    // Serve the Swagger UI at /api/docs
    SwaggerModule.setup('api/docs', app, document);
  } catch (err) {
    console.error(err);
    process.exit(1); // Exit with an error code
  }
}

bootstrap();
