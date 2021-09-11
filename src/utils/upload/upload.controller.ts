import { Controller, Post, Req, Res } from '@nestjs/common';

import { UploadService } from './upload.service';

@Controller('api')
export class UploadController {
    constructor(private uploadService: UploadService) {}

    @Post('/upload')
    create(@Req() request, @Res() response) {
        return this.uploadService.fileupload(request, response);
    }
}
