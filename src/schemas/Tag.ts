/* eslint-disable @typescript-eslint/ban-types */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Tag extends Document {
    @Prop()
    _id: string;

    @Prop()
    tag: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
