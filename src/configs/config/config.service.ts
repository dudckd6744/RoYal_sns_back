/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongoConfigService {
    constructor(private readonly configService: ConfigService) {}

    public async getMongoConfig() {
        return {
            uri: this.configService.get('MONGO_DB'),
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        };
    }
}
