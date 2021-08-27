import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { config } from 'dotenv';

config();

export const typeORMConfig: TypeOrmModuleOptions = {
    type: "mysql",
    host: '172.18.0.2',
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
    autoLoadEntities: true,
    timezone: '+09:00',
    connectTimeout: 300000,
    acquireTimeout: 300000
}
