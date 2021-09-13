/* eslint-disable @typescript-eslint/ban-types */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { BoardStatus } from 'src/modules/board/utils/board.status.enum';

@Schema({ timestamps: true })
export class Board extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
    writer: string;

    @Prop()
    userName: string;

    @Prop()
    tag: Array<string>;

    @Prop({ required: true })
    description: string;
    // 공개 비공개
    @Prop({ default: 'PUBLIC' })
    status: BoardStatus;
    //이미지 , 영상
    @Prop()
    files: Array<string>;
    //이미지,영상 태깅
    // @Prop({ required: true })
    // files_taging: Array<string>;
    //조회수
    @Prop({ default: 0 })
    view: number;
    //좋아요 수
    @Prop({ default: 0 })
    like_count: number;
    //댓글 수
    @Prop({ default: 0 })
    reply_count: number;
    //좋아요 체크 (공용변수)
    @Prop({ default: false })
    IsLike: boolean;

    @Prop({ default: null })
    deletedAt: Date;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
