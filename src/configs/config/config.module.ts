import { Global, Module } from '@nestjs/common';

import { MongoConfigService } from './config.service';

@Global()
@Module({
    providers: [MongoConfigService],
    exports: [MongoConfigService],
})
export class MongoConfigModule {}
