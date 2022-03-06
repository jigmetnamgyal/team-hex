import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';

@Module({
  imports:[],
  providers: [AuthenticationService],
  controllers: [AuthenticationController]
})

export class AuthenticationModule {}
