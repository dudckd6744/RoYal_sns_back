/* eslint-disable @typescript-eslint/ban-types */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { BoardStatus } from 'src/modules/board/utils/board.status.enum';

@Schema({ timestamps: true })
export class Board extends Document {
    @ApiProperty({
        example: 'dklsdjiosdj21kl1',
        required: true,
        description: '작성자 _id',
    })
    @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
    writer: string;

    @ApiProperty({
        example: '홍길동',
        required: true,
        description: '작성자 이름',
    })
    @Prop()
    userName: string;

    @ApiProperty({
        example: '#인생',
        description: '태그',
    })
    @Prop()
    tag: Array<string>;

    @ApiProperty({
        example: '여긴 내용적는곳입니다.',
        required: true,
        description: '내용',
    })
    @IsNotEmpty()
    @Prop({ required: true })
    description: string;

    // 공개 비공개
    @ApiProperty({
        example: 'PRIVATE',
        required: true,
        description: '상태',
    })
    @Prop({ default: 'PUBLIC' })
    status: string;

    //이미지 , 영상
    @ApiProperty({
        example: 'image.png or vidoe.mp4',
        description: '이미지 or 영상',
    })
    @IsNotEmpty()
    @Prop()
    files: Array<string>;
    //이미지,영상 태깅
    // @Prop({ required: true })
    // files_taging: Array<string>;

    //조회수
    @ApiProperty({
        example: 1,
        description: '조회수',
    })
    @Prop({ default: 0 })
    view: number;

    //좋아요 수
    @ApiProperty({
        example: 1,
        description: '좋아요 갯수',
    })
    @Prop({ default: 0 })
    like_count: number;

    //댓글 수
    @ApiProperty({
        example: 1,
        description: '댓글 수',
    })
    @Prop({ default: 0 })
    reply_count: number;

    //좋아요 체크 (공용변수)
    @ApiProperty({
        example: 'true',
        description: '사용자의 좋아요에따른 공용변수',
    })
    @Prop({ default: false })
    IsLike: boolean;

    @Prop({ default: null })
    deletedAt: Date;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
