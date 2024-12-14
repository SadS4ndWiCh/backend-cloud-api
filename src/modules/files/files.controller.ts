import { Body, Controller, Delete, Get, Param, Post, Request, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { AuthGuard } from "../auth/auth.guard";

import { FilesService } from "./files.service";
import { UploadFileDTO } from "./files.dto";

@Controller("files")
export class FilesController {
    constructor(private files: FilesService) {}

    @UseGuards(AuthGuard)
    @Get(":id")
    async retrieveFile(@Request() req, @Param("id") fileId) {
        return this.files.retrieveFile(req.userId, fileId);
    }

    @UseGuards(AuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor("file"))
    async uploadFile(@Request() req, @UploadedFile() file: Express.Multer.File, @Body() body: UploadFileDTO) {
        return this.files.uploadFile(req.userId, file, body);
    }

    @UseGuards(AuthGuard)
    @Delete(":id")
    async deleteFile(@Request() req, @Param("id") fileId: string) {
        return this.files.deleteFile(req.userId, fileId);
    }
}