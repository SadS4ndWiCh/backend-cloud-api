import { IsNotEmpty, Length } from "class-validator";

export class CreateFolderDTO {
    @IsNotEmpty()
    @Length(1, 64)
    folderName: string;
}

export class UpdateFolderDTO {
    @IsNotEmpty()
    @Length(1, 64)
    folderName: string;
}