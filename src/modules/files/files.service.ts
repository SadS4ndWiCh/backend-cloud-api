import { randomBytes } from "node:crypto";

import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    StreamableFile,
    UnauthorizedException
} from "@nestjs/common";

import { PrismaService } from "src/providers/prisma/prisma.service";
import { LocalBucketService } from "src/providers/localbucket/localbucket.service";

import { UploadFileDTO } from "./files.dto";
import { MEGABYTE } from "./files.constant";

@Injectable()
export class FilesService {
    constructor(private prisma: PrismaService, private bucket: LocalBucketService) {}

    async retrieveFile(userId: number, fileId: string) {
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

        const fileStream = await this.bucket.streamFile(file.file_path);
        return new StreamableFile(fileStream);
    }

    async uploadFile(ownerId: number, file: Express.Multer.File, data: UploadFileDTO) {
        if (file.size > (200 * MEGABYTE)) {
            throw new BadRequestException("file size must be at least 200MB");
        }

        const folder = await this.prisma.folder.findUnique({ where: { id: Number(data.folderId) } });
        if (!folder) {
            throw new BadRequestException();
        }

        if (folder.user_id !== ownerId) {
            throw new UnauthorizedException();
        }

        const now = Date.now();
        const fileName = `${now}_${file.filename}`;
        const hashedFileName = await this.bucket.createFile(fileName, file.buffer);
        if (!hashedFileName) {
            throw new InternalServerErrorException();
        }

        const fileId = randomBytes(16).toString("hex");
        return this.prisma.file.create({
            data: {
                id: fileId,
                file_path: hashedFileName,
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

        await this.bucket.deleteFile(file.file_path);
        return file;
    }
}