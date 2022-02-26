import { ApiProperty } from '@nestjs/swagger';

export class emailDto {
    @ApiProperty({
        example: 'test@test.com',
        required: true,
        description: '잃어버린 비밀번호의 이메일',
    })
    email: string;
}
