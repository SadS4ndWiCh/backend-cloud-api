import { Controller, Get, Param } from "@nestjs/common";

import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
    constructor(private users: UsersService) {}

    @Get(":id")
    async hello(@Param("id") rawUserId: string) {
        const userId = Number(rawUserId);

        return this.users.getUserById(userId);
    }
}