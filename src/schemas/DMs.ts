/* eslint-disable @typescript-eslint/ban-types */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class DMs extends Document {
    @ApiProperty({
        example: '619a1cde31fa1c593350fe6f',
        description: '채팅방 uid',
    })
    @Prop({
        type: MongooseSchema.Types.ObjectId,
        required: true,
        ref: 'ChatRoom',
    })
    chatRoomId: string;

    @ApiProperty({
        example: 'sdf1cde31fa1c593ssd532sdf',
        description: '메시지 보낸 유저',
    })
    @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
    senderId: string;

    @ApiProperty({
        example: '안녕',
        description: '메세지',
    })
    @IsNotEmpty()
    @Prop()
    comment: string;

    @ApiProperty({
        example: 'img or mp4',
        description: 'img or mp4',
    })
    @Prop()
    files: Array<string>;

    @ApiProperty({
        example: '2022-12-12-22:22',
        description: 'dm 삭제시 생성되는 날짜',
    })
    @Prop({ default: null })
    deletedAt: Date;
}

export const DMsSchema = SchemaFactory.createForClass(DMs);
