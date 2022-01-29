import { ApiProperty } from '@nestjs/swagger';

export class uploadDto {
    @ApiProperty({
        example: '[...]',
        description: 's3 버킷에 저장된 해당 파일의 주소',
    })
    file_data: Array<string>;
}

export class PostUploadDto {
    @ApiProperty({
        example: '[...]',
        description: 'form-data 로 보내야된다.',
    })
    files: Array<string>;
}
