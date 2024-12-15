import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { SessionsModule } from '../sessions/sessions.module';
import { FilesModule } from '../files/files.module';
import { FoldersModule } from '../folders/folders.module';

@Module({
  imports: [UsersModule, AuthModule, SessionsModule, FilesModule, FoldersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
