import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRoom, ChatRoomSchema } from 'src/schemas/ChatRoom';
import { DMs, DMsSchema } from 'src/schemas/DMs';
import { User, UserSchema } from 'src/schemas/User';

import { ChatsModule } from '../chats/chats.module';
import { DmsController } from './dms.controller';
import { DMsRepository } from './dms.repository';
import { DmsService } from './dms.service';

@Module({
    imports: [
        ChatsModule,
        MongooseModule.forFeature([{ name: DMs.name, schema: DMsSchema }]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([
            { name: ChatRoom.name, schema: ChatRoomSchema },
        ]),
    ],
    controllers: [DmsController],
    providers: [DmsService, DMsRepository],
})
export class DmsModule {}
