/* eslint-disable @typescript-eslint/no-empty-function */

export class MongoConfigService {
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
