/* eslint-disable @typescript-eslint/ban-types */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Like extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
    userId: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'Board' })
    boardId: string;

    @Prop({ required: true })
    parentId: string;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
