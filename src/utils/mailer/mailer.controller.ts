import { Body, Controller, Post } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiOkResponse,
    ApiOperation,
    ApiProperty,
    ApiTags,
} from '@nestjs/swagger';
import { errStatus, Success } from 'src/modules/auth/dto/user.create.dto';

import { emailDto } from './mailer.dto';
import { AuthMailerService } from './mailer.service';

@ApiTags('maile')
@Controller('/api/mailer')
export class MailerController {
    constructor(private mailerService: AuthMailerService) {}

    @ApiOkResponse({ description: 'success', type: Success })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '이메일 인증하기' })
    @ApiBody({ type: emailDto })
    @Post('/')
    sendEmail(@Body('email') email: string) {
        return this.mailerService.sendEmail(email);
    }
}
