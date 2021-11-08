import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema, User } from 'src/schemas/User';

import { AppController } from './app.controller';
import { ConfigModule } from './configs/config/config.module';
import { ConfigService } from './configs/config/config.service';
import { typeORMConfig } from './configs/typeorm.config';
//모듈
import { AuthModule } from './modules/auth/auth.module';
import { BoardModule } from './modules/board/board.module';
//인증
import { AuthTokenMiddleware } from './utils/auth.token.middleware';
import { GoogleStrategy } from './utils/google.auth';
import { KakaoStrategy } from './utils/kakao.auth';
import { AuthMailerModule } from './utils/mailer/mailer.module';
import { UploadModule } from './utils/upload/upload.module';

@Module({
    controllers: [AppController],
    imports: [
        //typeorm의 createConnection와 같은 파라미터를 제공받으며 App 전체에서 접근 가능한 Context의 connection을 주입받습니다.
        TypeOrmModule.forRoot(typeORMConfig),
        ConfigModule,
        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) =>
                await configService.getMongoConfig(),
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        AuthModule,
        BoardModule,
        UploadModule,
        AuthMailerModule,
    ],
    providers: [GoogleStrategy, KakaoStrategy],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthTokenMiddleware)
            .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}
