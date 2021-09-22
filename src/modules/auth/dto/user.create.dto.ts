import { ApiBody, ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        example: '홍길동',
        required: true,
        description: '사용자 이름',
    })
    @IsNotEmpty({ message: '이름이 비어있습니다.' })
    @IsString()
    name: string;

    @ApiProperty({
        example: 'test@test.com',
        required: true,
        description: '사용자 이메일',
    })
    @IsNotEmpty({ message: '이메일이 비어있습니다.' })
    @IsEmail({}, { message: '이메일 형식으로 입력해주세요!' })
    email: string;

    @ApiProperty({
        example: '!@qwer1234',
        required: true,
        description: '사용자 비밀번호',
    })
    @IsNotEmpty({ message: '비밀번호가 비어있습니다.' })
    @IsString()
    @Matches(
        /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/,
        {
            message:
                '최소 8자 ~ 16자 이내에 영문과 숫자 특수문자가 가 포함되어 있지않습니다.',
        },
    )
    password: string;

    @ApiProperty({
        example: '홍길동.jpg',
        required: false,
        description: '사용자 이미지',
    })
    profile: string;
}

export class LoginUser {
    @ApiProperty({
        example: 'test@test.com',
        required: true,
        description: '사용자 이메일',
    })
    @IsNotEmpty({ message: '이메일이 비어있습니다.' })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: '!@qwer1234',
        required: true,
        description: '사용자 비밀번호',
    })
    @IsNotEmpty({ message: '비밀번호가 비어있습니다.' })
    @IsString()
    password: string;
}

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
