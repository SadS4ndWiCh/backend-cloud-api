import { Controller, Delete, Get, Param } from "@nestjs/common";

import { SessionsService } from "./sessions.service";

@Controller("users/:userId/sessions")
export class SessionsController {
    constructor(private sessions: SessionsService) {}

    @Get()
    async getAllSessions(@Param("userId") rawUserId: string) {
        const userId = Number(rawUserId);

        return this.sessions.getAllFromUserId(userId);
    }

    @Get(":sessionId")
    async getById(@Param("sessionId") sessionId: string) {
        return this.sessions.getById(sessionId);
    }

    @Delete()
    async invalidateAllSessions(@Param("userId") rawUserId: string) {
        const userId = Number(rawUserId);

        return this.sessions.deleteAllFromUserId(userId);
    }

    @Delete(":sessionId")
    async invalidateSession(@Param("sessionId") sessionId: string) {
        return this.sessions.deleteById(sessionId);
    }
}