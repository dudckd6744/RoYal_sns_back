/* eslint-disable @typescript-eslint/ban-types */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Like extends Document {
    @ApiProperty({
        example: 'sdkja12jk12jk2hk',
        description: '유저아이디',
    })
    @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
    userId: string;

    @ApiProperty({
        example: 'sdkja12jk12jk2hk',
        description: '게시글 아이디',
    })
    @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'Board' })
    boardId: string;

    @ApiProperty({
        example: 'sdkja12jk12jk2hk',
        description:
            '댓글 좋아요할시에 parentId 에 댓글 _id 입력, 게시글 좋아요시 null',
    })
    @Prop({ required: true })
    parentId: string;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
