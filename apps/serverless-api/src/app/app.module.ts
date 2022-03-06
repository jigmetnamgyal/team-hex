import { Module } from '@nestjs/common';
import { CoreModule } from '@team-hex/core';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [CoreModule, AuthenticationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
