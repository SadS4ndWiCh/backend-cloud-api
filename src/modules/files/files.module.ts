import { Module } from "@nestjs/common";

import { PrismaModule } from "src/providers/prisma/prisma.module";
import { LocalBucketModule } from "src/providers/localbucket/localbucket.module";

import { FilesService } from "./files.service";
import { FilesController } from "./files.controller";

@Module({
    imports: [PrismaModule, LocalBucketModule],
    controllers: [FilesController],
    providers: [FilesService],
})
export class FilesModule {}