/* eslint-disable @typescript-eslint/ban-types */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Reply extends Document {
    @ApiProperty({
        example: 'asfs7fs8f7sf8s',
        required: true,
        description: '작성자 _id',
    })
    @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
    writer: string;

    @ApiProperty({
        example: '2hj2h2hu2hk2j',
        required: true,
        description: '게시글 _id',
    })
    @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'Board' })
    boardId: string;

    @ApiProperty({
        example: 'dklsdjiosdj21kl1',
        description: '게시글의 댓글이면 null 이고 댓글의 댓글이면 댓글 _id',
    })
    @Prop()
    parentId: string;

    @ApiProperty({
        example: '댓글 적는곳',
        required: true,
        description: '댓글',
    })
    @IsNotEmpty()
    @Prop({ required: true })
    comment: string;

    @ApiProperty({
        example: 1,
        description: '좋아요 수',
    })
    @Prop({ default: 0 })
    like_count: number;

    //대댓글 수
    @ApiProperty({
        example: 1,
        description: '대댓글 수',
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

export const ReplySchema = SchemaFactory.createForClass(Reply);
