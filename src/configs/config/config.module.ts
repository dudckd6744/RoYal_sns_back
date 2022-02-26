import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MongoConfigService } from './config.service';

@Global()
@Module({
    providers: [MongoConfigService, ConfigService],
    exports: [MongoConfigService],
})
export class MongoConfigModule {}
