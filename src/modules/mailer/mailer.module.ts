import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { UserSchema, User } from 'src/schemas/User';

// import { UserRepository } from 'src/modules/auth/user.repository';
import { MailerController } from './mailer.controller';
import { AuthMailerService } from './mailer.service';

config();

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MailerModule.forRoot({
            transport: {
                service: 'Naver',
                host: 'smtp.naver.com',
                port: 587,
                auth: {
                    user: process.env.EMAIL_ID,
                    pass: process.env.EMAIL_PW,
                },
            },
            template: {
                dir: process.cwd() + '/template/',
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
    ],
    controllers: [MailerController],
    providers: [AuthMailerService],
})
export class AuthMailerModule {}
