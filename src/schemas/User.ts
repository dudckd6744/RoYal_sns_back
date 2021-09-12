/* eslint-disable @typescript-eslint/ban-types */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
    @Prop()
    type: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique:true })
    email: string;

    @Prop({ default: null })
    password: string;

    @Prop({ default: null })
    profile: string;

    @Prop()
    followTo: Array<string>;

    @Prop({default:5})
    point: number;

    @Prop({ default: null })
    deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
