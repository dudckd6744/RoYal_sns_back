import { Body, Controller, Post } from '@nestjs/common';

import { AuthMailerService } from './mailer.service';

@Controller('/api/mailer')
export class MailerController {
    constructor(private mailerService: AuthMailerService) {}
    @Post('/')
    sendEmail(@Body('email') email: string): Promise<{ message: string }> {
        return this.mailerService.sendEmail(email);
    }
}
