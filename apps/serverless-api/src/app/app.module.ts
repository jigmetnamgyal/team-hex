import { Module } from '@nestjs/common';
import {CoreModule} from '@team-hex/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [CoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
