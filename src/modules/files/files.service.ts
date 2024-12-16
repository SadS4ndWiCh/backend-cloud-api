import { randomBytes } from "node:crypto";

import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    PayloadTooLargeException,
    StreamableFile,
    UnauthorizedException
} from "@nestjs/common";

import { PrismaService } from "src/providers/prisma/prisma.service";
import { LocalBucketService } from "src/providers/localbucket/localbucket.service";

import { FolderVisibility } from "../folders/folders.constant";

import { MoveFileDTO } from "./files.dto";
import { MEGABYTE } from "./files.constant";

@Injectable()
export class FilesService {
    constructor(private prisma: PrismaService, private bucket: LocalBucketService) {}

    async getFile(userId: number, fileId: string, folderId: number) {
        const file = await this.prisma.file.findUnique({
            where: { id: fileId, folder_id: folderId },
            include: {
                folder: true
            }
        });

        if (!file) {
            throw new NotFoundException();
        }

        if (file.folder.visiblity === FolderVisibility.PRIVATE && file.folder.user_id !== userId) {
            throw new UnauthorizedException();
        }

        return file;
    }

    async downloadFile(userId: number, fileId: string, folderId: number) {
        const file = await this.prisma.file.findUnique({
            where: { id: fileId, folder_id: folderId },
            include: {
                folder: true
            }
        });

        if (!file) {
            throw new NotFoundException();
        }

        if (file.folder.visiblity === FolderVisibility.PRIVATE && file.folder.user_id !== userId) {
            throw new UnauthorizedException();
        }

        const fileStream = await this.bucket.streamFile(file.path);
        return new StreamableFile(fileStream);
    }

    async uploadFile(ownerId: number, file: Express.Multer.File, folderId: number) {
        if (file.size > (200 * MEGABYTE)) {
            throw new PayloadTooLargeException("file size must be at least 200MB");
        }

        // TODO: add `owner_id` to file table to improve query
        const [user, folders] = await Promise.all([
            this.prisma.user.findUnique({ where: { id: ownerId } }),
            this.prisma.folder.findMany({
                where: { user_id: ownerId },
                select: { files: { select: { size: true } } }
            })
        ]);

        // TODO: abstract the entire logic to get used storage size
        let usedStorageSize = 0;
        for (let folderIdx = 0; folderIdx < folders.length; folderIdx++) {
            const folder = folders[folderIdx];

            for (let fileIdx = 0; fileIdx < folder.files.length; fileIdx++) {
                const file = folder.files[fileIdx];
                usedStorageSize += file.size;
            }
        }

        if ((usedStorageSize + file.size) > user.storage_limit) {
            throw new ForbiddenException("you will exceed your maximum storage capacity.")
        }

        const folder = await this.prisma.folder.findUnique({ where: { id: folderId } });
        if (!folder) {
            throw new BadRequestException();
        }

        if (folder.user_id !== ownerId) {
            throw new UnauthorizedException();
        }

        const now = Date.now();
        const fileName = `${now}_${file.originalname}`;
        const hashedFileName = await this.bucket.createFile(fileName, file.buffer);
        if (!hashedFileName) {
            throw new InternalServerErrorException();
        }

        const fileId = randomBytes(16).toString("hex");
        return this.prisma.file.create({
            data: {
                id: fileId,
                name: file.originalname,
                size: file.size,
                mimetype: file.mimetype,
                path: hashedFileName,
                folder_id: folder.id,
            }
        });
    }

    async deleteFile(userId: number, fileId: string) {
        const file = await this.prisma.file.findUnique({
            where: { id: fileId },
            include: {
                folder: true
            }
        });

        if (!file) {
            throw new NotFoundException();
        }

        if (file.folder.user_id !== userId) {
            throw new UnauthorizedException();
        }

        try {
            await this.prisma.file.delete({ where: { id: file.id } });
        } catch {
            throw new InternalServerErrorException();
        }

        await this.bucket.deleteFile(file.path);
        return file;
    }

    async moveFileToFolder(userId: number, fileId: string, data: MoveFileDTO) {
        const [file, folder] = await Promise.all([
            this.prisma.file.findUnique({ where: { id: fileId }, include: { folder: true } }),
            this.prisma.folder.findUnique({ where: { id: data.folderId } }),
        ]);

        if (!file || !folder) {
            throw new NotFoundException();
        }

        if (file.folder.user_id !== userId || folder.user_id !== userId) {
            throw new UnauthorizedException();
        }

        return this.prisma.file.update({
            where: { id: fileId },
            data: { folder_id: folder.id }
        });
    }
}