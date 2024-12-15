import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";

import { PrismaService } from "src/providers/prisma/prisma.service";
import { CreateFolderDTO, UpdateFolderDTO } from "./folders.dto";

@Injectable()
export class FoldersService {
    constructor(private prisma: PrismaService) {}

    async createFolder(userId: number, data: CreateFolderDTO) {
        return this.prisma.folder.create({
            data: {
                name: data.folderName,
                user_id: userId
            }
        });
    }

    async getFolder(userId: number, folderId: number) {
        const folder = await this.prisma.folder.findUnique({ where: { id: folderId } });
        if (!folder) {
            throw new NotFoundException();
        }

        if (folder.user_id !== userId) {
            throw new UnauthorizedException();
        } 

        return folder;
    }

    async updateFolder(userId: number, folderId: number, data: UpdateFolderDTO) {
        const folder = await this.prisma.folder.findUnique({ where: { id: folderId } });
        if (!folder) {
            throw new NotFoundException();
        }

        if (folder.user_id !== userId) {
            throw new UnauthorizedException();
        }

        return this.prisma.folder.update({
            where: { id: folderId },
            data: { name: data.folderName }
        });
    }

    async deleteFolder(userId: number, folderId: number) {
        const folder = await this.prisma.folder.findUnique({ where: { id: folderId } });
        if (!folder) {
            throw new NotFoundException();
        }

        if (folder.user_id !== userId) {
            throw new UnauthorizedException();
        }

        return this.prisma.folder.delete({
            where: { id: folderId }
        });
    }
}