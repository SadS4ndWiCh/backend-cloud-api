import { Module } from "@nestjs/common";

import { PrismaModule } from "src/providers/prisma/prisma.module";

import { SessionsService } from "./sessions.service";
import { SessionsController } from "./sessions.controller";

@Module({
    imports: [PrismaModule],
    providers: [SessionsService],
    controllers: [SessionsController],
})
export class SessionsModule {}