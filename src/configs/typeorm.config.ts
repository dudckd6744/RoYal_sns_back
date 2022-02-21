import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const configService = new ConfigService();

export const typeORMConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: configService.get('DB_HOST'),
    port: 3306,
    username: configService.get('DB_USER'),
    password: configService.get('DB_PW'),
    database: configService.get('DB_NAME'),
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
    autoLoadEntities: true,
    timezone: '+09:00',
    acquireTimeout: 30000,
};
