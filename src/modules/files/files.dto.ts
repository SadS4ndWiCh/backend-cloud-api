import { IsNotEmpty } from "class-validator";

export class MoveFileDTO {
    @IsNotEmpty()
    folderId: number;
}