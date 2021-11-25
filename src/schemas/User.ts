/* eslint-disable @typescript-eslint/ban-types */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
    @ApiProperty({
        example: 'null',
        description: '자사회원인지 oAuth 회원인지',
    })
    @Prop()
    type: string;

    @ApiProperty({
        example: '홍길동',
        required: true,
        description: '사용자 이름',
    })
    @IsNotEmpty({ message: '이름이 비어있습니다.' })
    @IsString()
    @Prop({ required: true })
    name: string;

    @ApiProperty({
        example: '010-1111-1111',
        required: true,
        description: '사용자 폰번호',
    })
    @IsNotEmpty({ message: '핸드폰 번호를 입력해주세요!' })
    @IsString()
    @Prop({ required: true })
    phone: string;

    @ApiProperty({
        example: 'test@test.com',
        required: true,
        description: '사용자 이메일',
    })
    @IsNotEmpty({ message: '이메일이 비어있습니다.' })
    @IsEmail({}, { message: '이메일 형식으로 입력해주세요!' })
    @Matches(
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
        {
            message: '이메일 형식에 맞게 입력해 주셔야됩니다.',
        },
    )
    @Prop({ required: true, unique: true })
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
    @Prop({ default: null })
    password: string;

    @ApiProperty({
        example: '홍길동.jpg',
        required: false,
        description: '사용자 이미지',
    })
    @Prop({ default: null })
    profile: string;

    @ApiProperty({
        example: '619a1cde31fa1c593350fe6f',
        description: '나를 팔로우한 유저 _id',
    })
    @Prop()
    follower: Array<string>;

    @ApiProperty({
        example: '619a1cde31fa1c593350fe6f',
        description: '내가 팔로잉한 유저 _id',
    })
    @Prop()
    following: Array<string>;

    @ApiProperty({
        example: '안녕하세용',
        description: '자기소개',
    })
    @Prop()
    description: string;

    // 1개당 5000원 결제수단
    @ApiProperty({
        example: '200',
        description: '로얄 갯수 (결제수단)',
    })
    @Prop({ default: 5 })
    royal: number;

    // 등급 지정 ex) 1% 3% 5% 10%
    @ApiProperty({
        example: '1%',
        description: '내 경제력 백분률',
    })
    @Prop({ default: null })
    status: string;

    @ApiProperty({
        example: 'true',
        description: '서류 통과했는지,,',
    })
    @Prop({ default: false })
    isActive: boolean;

    @Prop({ default: null })
    deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
