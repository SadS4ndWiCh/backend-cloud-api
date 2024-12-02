import { Body, Controller, Post } from "@nestjs/common";

import { AuthService } from "./auth.service";
import type { CreateUserDTO, LoginUserDTO } from "./auth.dto";

@Controller("auth")
export class AuthController {
    constructor (private auth: AuthService) {}

    @Post("register")
    async register(@Body() body: CreateUserDTO) {
        return this.auth.createUser(body);
    }

    @Post("login")
    async login(@Body() body: LoginUserDTO) {
        return this.auth.login(body);
    }
}