import { Injectable } from '@nestjs/common';
import { User } from 'src/schemas/User';

import { DMsRepository } from './dms.repository';
import { CreateDMsDto } from './dto/dms.dto';

@Injectable()
export class DmsService {
    constructor(private dmsRepository: DMsRepository) {}

    createChatRoom(user: User, usersIds: Array<string>) {
        return this.dmsRepository.createChatRoom(user, usersIds);
    }

    leaveChatRoom(user: User, chatRoom_id: string) {
        return this.dmsRepository.leaveChatRoom(user, chatRoom_id);
    }

    getChatRoomDMs(user: User, chatRoom_id: string) {
        return this.dmsRepository.getChatRoomDMs(user, chatRoom_id);
    }

    createDMs(user: User, chatRoom_id: string, createDMsDto: CreateDMsDto) {
        return this.dmsRepository.createDMs(user, chatRoom_id, createDMsDto);
    }

    DeleteDMs(user: User, DMs_id: string) {
        return this.dmsRepository.DeleteDMs(user, DMs_id);
    }
}
