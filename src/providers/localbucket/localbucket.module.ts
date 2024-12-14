import { Module } from "@nestjs/common";

import { LocalBucketService } from "./localbucket.service";

@Module({
    providers: [LocalBucketService],
    exports: [LocalBucketService]
})
export class LocalBucketModule {}