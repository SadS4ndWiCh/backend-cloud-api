import { IsEmail, Length } from "class-validator";

export class CreateUserDTO {
    @Length(2, 64)
    full_name: string;

    @IsEmail()
    email: string;

    @Length(2, 64)
    password: string;
}

export class LoginUserDTO {
    @IsEmail()
    email: string;

    @Length(2, 64)
    password: string;
}