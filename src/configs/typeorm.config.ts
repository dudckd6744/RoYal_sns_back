import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { config } from 'dotenv';

config();

export const typeORMConfig: TypeOrmModuleOptions = {
    type: "mysql",
    host: 'database-1.cyv7cj2693bb.ap-northeast-2.rds.amazonaws.com',
    port: 3306,
    username: 'user',
    password: 'djajsl11',
    database: 'bolier',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
    autoLoadEntities: true,
    timezone: '+09:00',
    // connectTimeout: 30000,
    // acquireTimeout: 30000
}
