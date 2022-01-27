/* eslint-disable @typescript-eslint/ban-types */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class ChatRoom extends Document {
    @ApiProperty({
        example: ['asdqwe12', 'adszcx212'],
        description: '채팅방 내 유저 id들',
    })
    @Prop({ required: true })
    usersIds: Array<string>;

    @ApiProperty({
        example: [{ user_id: 'adsfqer123', leaveDate: '2011-11-11-12:00' }],
        description: '채팅방 내 나간 유저 정보',
    })
    @Prop({ type: Array })
    leaveInfo: any;

    @ApiProperty({
        example: '2022-12-12-22:22',
        description: '채팅방 다 나갔을때',
    })
    @Prop({ default: null })
    deletedAt: Date;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
