/* eslint-disable @typescript-eslint/no-empty-function */
import { config } from 'dotenv';

config();

export class ConfigService {
    constructor() {}

    public async getMongoConfig() {
        return {
            uri: process.env.MONGO_DB,
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        };
    }
}
