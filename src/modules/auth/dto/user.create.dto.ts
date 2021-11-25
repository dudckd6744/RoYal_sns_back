import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/schemas/User';

export class CreateUserDto extends PickType(User, [
    'name',
    'email',
    'password',
    'phone',
    'profile',
] as const) {}

export class LoginUser extends PickType(User, ['email', 'password'] as const) {}

export class PasswordUserDto {
    @ApiProperty({
        example: '!@qwer1234',
        required: true,
        description: '사용자 기존 비밀번호',
    })
    @IsNotEmpty({ message: '비밀번호가 비어있습니다.' })
    @IsEmail()
    password: string;

    @ApiProperty({
        example: '!@asdf0983',
        required: true,
        description: '사용자 바꿀 비밀번호',
    })
    @IsNotEmpty({ message: '새로운 비밀번호를 입력해주세요!' })
    @IsString()
    new_password: string;

    @ApiProperty({
        example: '!@asdf0983',
        required: true,
        description: '사용자 바꿀 비밀번호 확인',
    })
    @IsNotEmpty({ message: '비밀번호 확인란이 비어있습니다.' })
    @IsString()
    confirm_new_password: string;
}

// Swagger API

export class otherIdDto {
    @ApiProperty({
        example: 'aajsdhfisdhfksdfkshfkjsfkudshk223n1jk21j2',
        required: true,
        description: '팔로우할 유저 id or 언팔로우할 유저 id',
    })
    othersId: string;
}

export class tokenSuccess {
    @ApiProperty({
        example: 'aajsdhfisdhfksdfkshfkjsfkudshk223n1jk21j2',
        required: true,
        description: '성공',
    })
    token: string;
}
