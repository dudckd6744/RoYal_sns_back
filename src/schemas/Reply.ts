/* eslint-disable @typescript-eslint/ban-types */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Reply extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
    writer: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'Board' })
    boardId: string;

    @Prop()
    parentId: string;

    @Prop({ required: true })
    comment: string;

    @Prop({ default: 0 })
    like_count: number;
    //대댓글 수
    @Prop({ default: 0 })
    reply_count: number;
    //좋아요 체크 (공용변수)
    @Prop({ default: false })
    IsLike: boolean;

    @Prop({ default: null })
    deletedAt: Date;
}

export const ReplySchema = SchemaFactory.createForClass(Reply);
