import { Injectable } from "@nestjs/common";
import { randomBytes } from "node:crypto";

import { PrismaService } from "src/providers/prisma/prisma.service";

import type { CreateUserDTO, LoginUserDTO } from "./auth.dto";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    private async createSession(userId: number) {
        const sessionId = randomBytes(16).toString("hex");
        const expiresAt = new Date(Date.now() + (1000 * 60 * 60 * 24 * 3)); // 3 days

        return this.prisma.session.create({ data: {
            id: sessionId,
            expires_at: expiresAt,
            user_id: userId
        } });
    }

    async createUser(payload: CreateUserDTO) {
        // TODO: hash the password
        const user = await this.prisma.user.create({ data: payload });
        await this.createSession(user.id);

        return user;
    }

    async login(payload: LoginUserDTO) {
        const user = await this.prisma.user.findFirst({ where: { email: payload.email } });
        if (!user) {
            return null;
        }

        // TODO: safe password compare
        if (user.password != payload.password) {
            return null;
        }

        return this.createSession(user.id);
    }
}