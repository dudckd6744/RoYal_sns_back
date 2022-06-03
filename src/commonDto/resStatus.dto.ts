import { ApiProperty } from '@nestjs/swagger';

export class Success {
    @ApiProperty({
        example: 'success',
        required: true,
        description: '성공',
    })
    message: string;
}

export class errStatus {
    @ApiProperty({
        example: 400,
        required: true,
        description: '에러코드',
    })
    statusCode: number;
    @ApiProperty({
        example: 'example',
        required: true,
        description: '상태메세지',
    })
    message: string;
    @ApiProperty({
        example: 'bad request',
        required: true,
        description: '에러 내용',
    })
    error: string;
}
