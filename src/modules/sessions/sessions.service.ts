import { Injectable } from "@nestjs/common";

import { PrismaService } from "src/providers/prisma/prisma.service";

@Injectable()
export class SessionsService {
    constructor(private prisma: PrismaService) {}

    async getAllFromUserId(userId: number) {
        return this.prisma.session.findMany({ where: { user_id: userId } });
    }

    async getById(sessionId: string) {
        return this.prisma.session.findFirst({ where: { id: sessionId } });
    }

    async deleteById(sessionId: string) {
        return this.prisma.session.delete({ where: { id: sessionId } });
    }

    async deleteAllFromUserId(userId: number) {
        return this.prisma.session.deleteMany({ where: { user_id: userId } });
    }
}