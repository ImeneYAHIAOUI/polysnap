import { Logger, Module } from '@nestjs/common';
import { UsersController } from './controllers/user.controller';
import { UserService } from './services/user.service';
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
  controllers: [UsersController],
  providers: [
    {
      provide: UserService.name,
      useClass: UserService,
    },
  ],
  exports: [
    {
      provide: UserService.name,
      useClass: UserService,
    },
  ],
})
export class UsersModule {}
