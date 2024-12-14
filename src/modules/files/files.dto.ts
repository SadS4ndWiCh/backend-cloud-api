import { IsNotEmpty } from "class-validator";

export class UploadFileDTO {
    @IsNotEmpty()
    folderId: string;
}