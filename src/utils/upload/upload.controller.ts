import { Controller, Post, Req, Res } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { errStatus } from 'src/modules/auth/dto/user.create.dto';

import { PostUploadDto, uploadDto } from './upload.dto';
import { UploadService } from './upload.service';

@ApiTags('upload')
@Controller('api')
export class UploadController {
    constructor(private uploadService: UploadService) {}

    @ApiOkResponse({ description: 'success', type: uploadDto })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '이미지 or 영상업로드하기' })
    @ApiBody({ type: PostUploadDto })
    @Post('/upload')
    create(@Req() request, @Res() response) {
        return this.uploadService.fileupload(request, response);
    }
}
