import { Injectable } from "@nestjs/common";

import { PrismaService } from "src/providers/prisma.service";

@Injectable()
export class UsersService {
    constructor (private prisma: PrismaService) {}

    async getUserById(userId: number) {
        const user = await this.prisma.user.findFirst({
            where: { id: userId }
        });

        return user;
    }
}