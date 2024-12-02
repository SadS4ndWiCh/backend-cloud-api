import { Module } from "@nestjs/common";

import { PrismaModule } from "src/providers/prisma/prisma.module";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

@Module({
    imports: [PrismaModule],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}