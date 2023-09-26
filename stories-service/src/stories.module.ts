import { Logger, Module } from '@nestjs/common';
import { StoriesController } from './controllers/stories.controller';
import { StoriesService } from './services/stories.service';
import { PrismaModule, loggingMiddleware } from 'nestjs-prisma';

@Module({
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          loggingMiddleware({
            logger: new Logger('PrismaMiddleware'),
            logLevel: 'log',
          }),
        ],
      },
    }),
  ],
  controllers: [StoriesController],
  providers: [
    {
      provide: StoriesService.name,
      useClass: StoriesService,
    },
  ],
  exports: [
    {
      provide: StoriesService.name,
      useClass: StoriesService,
    },
  ],
})
export class StoriesModule {}
