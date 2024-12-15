import { IsNotEmpty, Length } from "class-validator";

export class CreateFolderDTO {
    @IsNotEmpty()
    @Length(1, 64)
    folderName: string;

    visibility: number;
}

export class UpdateFolderDTO {
    @IsNotEmpty()
    @Length(1, 64)
    folderName: string;

    visibility: number;
}