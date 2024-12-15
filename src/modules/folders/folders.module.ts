import { Module } from "@nestjs/common";

import { FoldersService } from "./folders.service";
import { PrismaModule } from "src/providers/prisma/prisma.module";
import { FoldersController } from "./folders.controller";

@Module({
    imports: [PrismaModule],
    controllers: [FoldersController],
    providers: [FoldersService],
})
export class FoldersModule {}