import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from 'src/schemas/User';

import { AppController } from './app.controller';
import { MongoConfigModule } from './configs/config/config.module';
import { MongoConfigService } from './configs/config/config.service';
// import { typeORMConfig } from './configs/typeorm.config';
//인증
import { AuthTokenMiddleware } from './middleware/auth.token.middleware';
//모듈
import { AuthModule } from './modules/auth/auth.module';
import { BoardModule } from './modules/board/board.module';
import { ChatsModule } from './modules/chats/chats.module';
import { DmsModule } from './modules/dms/dms.module';
import { AuthMailerModule } from './modules/mailer/mailer.module';
import { UploadModule } from './modules/upload/upload.module';
import { GoogleStrategy } from './utils/oAuth/google.auth';
import { KakaoStrategy } from './utils/oAuth/kakao.auth';

// TODO: test
@Module({
    controllers: [AppController],
    imports: [
        //typeorm의 createConnection와 같은 파라미터를 제공받으며 App 전체에서 접근 가능한 Context의 connection을 주입받습니다.
        // TypeOrmModule.forRoot(typeORMConfig),
        ConfigModule.forRoot({ isGlobal: true }),
        MongoConfigModule,
        MongooseModule.forRootAsync({
            inject: [MongoConfigService],
            useFactory: async (configService: MongoConfigService) =>
                await configService.getMongoConfig(),
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        AuthModule,
        BoardModule,
        UploadModule,
        AuthMailerModule,
        ChatsModule,
        DmsModule,
    ],
    providers: [GoogleStrategy, KakaoStrategy, ConfigService],
    exports: [ConfigService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthTokenMiddleware)
            .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}
