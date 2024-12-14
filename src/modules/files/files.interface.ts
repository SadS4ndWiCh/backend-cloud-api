import type { ReadStream } from "node:fs";

export interface BucketService {
    createFile(fileName: string, buffer: Buffer): Promise<string>;
    deleteFile(fileName: string): Promise<void>;
    streamFile(fileName: string): Promise<ReadStream>;
}