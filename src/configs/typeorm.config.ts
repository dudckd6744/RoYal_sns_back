import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { config } from 'dotenv';

config();

export const typeORMConfig: TypeOrmModuleOptions = {
    type: "mysql",
    host: '172.18.0.2',
    port: 3306,
    username: 'test',
    password: 'qwerasdf',
    database: 'bolier',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
    autoLoadEntities: true,
    timezone: '+09:00',
    connectTimeout: 30000,
    acquireTimeout: 30000
}
