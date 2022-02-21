import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema, User } from 'src/schemas/User';

import { MailerController } from './mailer.controller';
import { AuthMailerService } from './mailer.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MailerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                return {
                    transport: {
                        service: 'Naver',
                        host: 'smtp.naver.com',
                        port: 587,
                        auth: {
                            user: configService.get('EMAIL_ID'),
                            pass: configService.get('EMAIL_PW'),
                        },
                    },
                    template: {
                        dir: process.cwd() + '/template/',
                        adapter: new HandlebarsAdapter(),
                        options: {
                            strict: true,
                        },
                    },
                };
            },
        }),
    ],
    controllers: [MailerController],
    providers: [AuthMailerService, ConfigService],
})
export class AuthMailerModule {}
