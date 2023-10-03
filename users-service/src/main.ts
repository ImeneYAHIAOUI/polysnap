import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // Ajout

const HOST = '0.0.0.0';
const PORT = Number(process.env.PORT) || 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Votre API')
    .setDescription('Description de votre API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT, HOST).then(() => {
    console.log(
      `** Nest Live Development Server is listening on ${HOST}:${PORT}, open your browser on http://localhost:${PORT}/ **`,
    );
  });
}

bootstrap();
