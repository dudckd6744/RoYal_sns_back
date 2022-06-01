import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User';
import { pipe } from 'src/utils/pipe.fp';
import { randomInt, randomReturnPassword } from 'src/utils/randomValue';

@Injectable()
export class AuthMailerService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) {}

    async sendEmail(email: string) {
        const user = await this.userModel.findOne({ email });

        if (!user) throw new BadRequestException('이메일을 다시 확인해주세요');

        const passowrd = await pipe(randomInt, randomReturnPassword)(4);

        const salt = await bcrypt.genSalt();
        const hash_password = await bcrypt.hash(passowrd, salt);

        user.password = hash_password;

        await user.save();

        this.mailerService.sendMail({
            to: user.email,
            from: this.configService.get('EMAIL_ID'),
            subject: '이메일 인증 요청 메일입니다.',
            html: `<h2>${user.email}님의</h2> <h3> 비밀번호 인증 코드 <b> ${passowrd}</b> 를 입력해주세요.<h3>`, // HTML body content
        });
        return { success: true };
    }
}
