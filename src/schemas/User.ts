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
    // 1개당 5000원 결제수단
    @Prop({default:5})
    royal: number;
    // 등급 지정 ex) 1% 3% 5% 10%
    @Prop({ default: null })
    status: string;

    @Prop({default:false})
    isActive: boolean;

    @Prop({ default: null })
    deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
