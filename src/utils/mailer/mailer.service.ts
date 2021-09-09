import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/modules/auth/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcryptjs';
import { config } from 'dotenv';

config();

@Injectable()
export class AuthMailerService {
    constructor(private readonly mailerService: MailerService) { }

    async sendEmail(
        email: string
    ): Promise<{message: string}> {
        const user = await User.findOne({email})

        if(!user) throw new BadRequestException('이메일을 다시 확인해주세요')

        const passowrd = Math.random().toString(36).slice(2)

        const salt = await bcrypt.genSalt();
        const hash_password = await bcrypt.hash(passowrd, salt);

        user.password = hash_password
        
        await User.save(user)

        this.mailerService.sendMail({
            to: user.email,
            from: process.env.EMAIL_ID,
            subject: '이메일 인증 요청 메일입니다.',
            html: `<h2>${user.email}님의</h2> <h3> 비밀번호 인증 코드 <b> ${passowrd}</b> 를 입력해주세요.<h3>`, // HTML body content
        })
        return {message: 'success'}
    }
}
