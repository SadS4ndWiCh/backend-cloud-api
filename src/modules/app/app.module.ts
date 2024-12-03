import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [UsersModule, AuthModule, SessionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
