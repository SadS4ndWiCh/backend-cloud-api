import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";

import { AuthGuard } from "../auth/auth.guard";

import { FoldersService } from "./folders.service";
import { CreateFolderDTO, UpdateFolderDTO } from "./folders.dto";

@Controller("folders")
export class FoldersController {
    constructor(private folders: FoldersService) {}

    @UseGuards(AuthGuard)
    @Get(":folderId")
    async getFolder(@Request() req, @Param("folderId") folderId: string) {
        return this.folders.getFolder(req.userId, Number(folderId));
    }

    @UseGuards(AuthGuard)
    @Post()
    async createFolder(@Request() req, @Body() body: CreateFolderDTO) {
        return this.folders.createFolder(req.userId, body);
    }

    @UseGuards(AuthGuard)
    @Delete(":folderId")
    async deleteFolder(@Request() req, @Param("folderId") folderId: string) {
        return this.folders.deleteFolder(req.userId, Number(folderId));
    }

    @UseGuards(AuthGuard)
    @Patch(":folderId")
    async updateFolder(@Request() req, @Param("folderId") folderId: string, @Body() body: UpdateFolderDTO) {
        return this.folders.updateFolder(req.userId, Number(folderId), body);
    }
}