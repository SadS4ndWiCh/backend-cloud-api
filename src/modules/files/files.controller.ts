import { Body, Controller, Delete, Get, Param, Post, Request, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { AuthGuard } from "../auth/auth.guard";

import { FilesService } from "./files.service";
import { MoveFileDTO } from "./files.dto";

@Controller("folders/:folderId/files")
export class FilesController {
    constructor(private files: FilesService) {}

    @UseGuards(AuthGuard)
    @Get(":fileId")
    async getFile(@Request() req, @Param("fileId") fileId: string, @Param("folderId") folderId: string) {
        return this.files.getFile(req.userId, fileId, Number(folderId));
    }

    @UseGuards(AuthGuard)
    @Get(":fileId/download")
    async downloadFile(@Request() req, @Param("fileId") fileId: string, @Param("folderId") folderId: string) {
        return this.files.downloadFile(req.userId, fileId, Number(folderId));
    }

    @UseGuards(AuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor("file"))
    async uploadFile(@Request() req, @UploadedFile() file: Express.Multer.File, @Param("folderId") folderId: string) {
        return this.files.uploadFile(req.userId, file, Number(folderId));
    }

    @UseGuards(AuthGuard)
    @Delete(":fileId")
    async deleteFile(@Request() req, @Param("fileId") fileId: string) {
        return this.files.deleteFile(req.userId, fileId);
    }

    @UseGuards(AuthGuard)
    @Post(":fileId/move")
    async moveFileToFolder(@Request() req, @Param("fileId") fileId: string, @Body() body: MoveFileDTO) {
        return this.files.moveFileToFolder(req.userId, fileId, body);
    }
}