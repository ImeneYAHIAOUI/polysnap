import { Module } from '@nestjs/common';
import { AppService } from './app.service';

@Module({
  imports: [],
  providers: [AppService], // Include your service here
})
export class AppModule {}
