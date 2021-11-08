import { Controller, Get, Req, Res } from '@nestjs/common';

@Controller('')
export class AppController {
    @Get('/healthCheck')
    Health(@Req() req, @Res() res) {
        return res.status(200).json({ message: 'ok' });
    }
}
