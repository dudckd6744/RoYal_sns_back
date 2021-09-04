
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';

config();

export const typeORMConfig: TypeOrmModuleOptions = {
    type: "mysql",
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
    autoLoadEntities: true,
    timezone: '+09:00',
    acquireTimeout: 30000,
}


// host: 'process.env.DB_HOST',
// port: 3306,
// username: 'process.env.DB_USER',
// password: 'process.env.DB_PW',
// database: 'process.env.DB_HOST',




// host: 'database-1.cyv7cj2693bb.ap-northeast-2.rds.amazonaws.com',
// port: 3306,
// username: 'user',
// password: 'djajsl11',
// database: 'bolier',