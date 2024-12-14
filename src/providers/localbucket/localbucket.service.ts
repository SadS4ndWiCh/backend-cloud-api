import type { ReadStream } from "node:fs";

import { join } from "node:path";
import { hash } from "node:crypto";
import { createReadStream } from "node:fs";
import { rm, writeFile } from "node:fs/promises";

import { Injectable } from "@nestjs/common";

import { BucketService } from "src/modules/files/files.interface";

@Injectable()
export class LocalBucketService implements BucketService {
    private baseUrl = "bucket";

    private hash(str: string) {
        return hash("sha1", str);
    }

    async createFile(fileName: string, buffer: Buffer): Promise<string> {
        const hashedFileName = this.hash(fileName);
        const filePath = join(this.baseUrl, hashedFileName);

        try {
            await writeFile(filePath, buffer);
        } catch {
            return null;
        }

        return hashedFileName;
    }

    async deleteFile(hashedFileName: string): Promise<void> {
        const filePath = join(this.baseUrl, hashedFileName);

        return rm(filePath);
    }

    async streamFile(hashedFileName: string): Promise<ReadStream> {
        const filePath = join(this.baseUrl, hashedFileName);

        return createReadStream(filePath);
    }

}