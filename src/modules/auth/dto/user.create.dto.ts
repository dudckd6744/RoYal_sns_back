import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({ message: '이름이 비어있습니다.' })
    @IsString()
    name: string;

    @IsNotEmpty({ message: '이메일이 비어있습니다.' })
    @IsEmail({}, { message: '이메일 형식으로 입력해주세요!' })
    email: string;

    @IsNotEmpty({ message: '비밀번호가 비어있습니다.' })
    @IsString()
    @MinLength(4, {
        message: '최소 4자 이상 입력하셔야됩니다.',
    })
    @MaxLength(20, {
        message: '최대 20자 이내로 입력하셔야됩니다.',
    })
    @Matches(/^.*(?=.*[0-9])(?=.*[a-zA-Z]).*$/, {
        message: '영문과 숫자가 포함되어 있지않습니다.',
    })
    password: string;

    profile: string;
}

export class LoginUser {
    @IsNotEmpty({ message: '이메일이 비어있습니다.' })
    @IsEmail()
    email: string;

    @IsNotEmpty({ message: '비밀번호가 비어있습니다.' })
    @IsString()
    password: string;
}

export class PasswordUserDto {
    @IsNotEmpty({ message: '비밀번호가 비어있습니다.' })
    @IsEmail()
    password: string;

    @IsNotEmpty({ message: '새로운 비밀번호를 입력해주세요!' })
    @IsString()
    new_password: string;

    @IsNotEmpty({ message: '비밀번호 확인란이 비어있습니다.' })
    @IsString()
    confirm_new_password: string;
}
