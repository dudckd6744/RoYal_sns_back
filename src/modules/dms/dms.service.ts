import { Injectable } from '@nestjs/common';
import { errStatus } from 'src/resStatusDto/resStatus.dto';
import { User } from 'src/schemas/User';

import { DMsRepository } from './dms.repository';
import { CreateDMsDto } from './dto/dms.dto';

@Injectable()
export class DmsService {
    constructor(private dmsRepository: DMsRepository) {}

    async createChatRoom(
        userId: string,
        userIds: Array<string>,
    ): Promise<{ success: true } | errStatus> {
        const newUserIds = userIds.concat(userId.toString());

        const chatRoom = await this.dmsRepository.upsertChatRoom(newUserIds);

        if (chatRoom.leaveInfo?.length > 0) {
            chatRoom.leaveInfo.forEach(async (leaveUser, i) => {
                console.log(leaveUser);
                if (leaveUser.user_id == userId.toString()) {
                    await this.dmsRepository.joinChatRoom(
                        chatRoom._id,
                        leaveUser.userId,
                        leaveUser.leaveDate,
                    );
                }
            });
        }
        return { success: true };
    }

    leaveChatRoom(
        user: User,
        chatRoom_id: string,
    ): Promise<{ success: true } | errStatus> {
        return this.dmsRepository.leaveChatRoom(user, chatRoom_id);
    }

    getChatRoomDMs(user: User, chatRoom_id: string) {
        return this.dmsRepository.getChatRoomDMs(user, chatRoom_id);
    }

    createDMs(user: User, chatRoom_id: string, createDMsDto: CreateDMsDto) {
        return this.dmsRepository.createDMs(user, chatRoom_id, createDMsDto);
    }

    DeleteDMs(
        user: User,
        DMs_id: string,
    ): Promise<{ success: true } | errStatus> {
        return this.dmsRepository.DeleteDMs(user, DMs_id);
    }
}
