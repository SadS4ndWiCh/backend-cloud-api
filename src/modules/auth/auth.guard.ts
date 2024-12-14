import type { Session } from "@prisma/client";
import type { CanActivate, ExecutionContext } from "@nestjs/common";

import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";

import { PrismaService } from "src/providers/prisma/prisma.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private prisma: PrismaService) {}

    async canActivate(ctx: ExecutionContext) {
        const request = ctx.switchToHttp().getRequest();
        const sessionId = this.extractSessionId(request);
        if (!sessionId) {
            throw new UnauthorizedException();
        }

        let session: Session;

        try {
            session = await this.prisma.session.findUnique({ where: { id: sessionId } });
        } catch {
            throw new InternalServerErrorException();
        }

        if (!session) {
            throw new UnauthorizedException();
        }

        const now = new Date();
        if (session.expires_at < now) {
            throw new UnauthorizedException();
        }

        request["userId"] = session.user_id;

        return true;
    }

    private extractSessionId(request: any) {
        console.log(request.headers);
        return request.headers["x-session-id"];
    }
}