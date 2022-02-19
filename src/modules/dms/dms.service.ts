import { BadRequestException, Injectable } from '@nestjs/common';
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
        const newUserIds = [userId];
        const deleteAt = null;

        const chatRoom = await this.dmsRepository.upsertChatRoom(
            newUserIds,
            deleteAt,
        );

        if (chatRoom.leaveInfo?.length > 0) {
            chatRoom.leaveInfo.forEach(async (leaveUser, i) => {
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

    async leaveChatRoom(
        userId: string,
        chatRoomId: string,
    ): Promise<{ success: true } | errStatus> {
        const leaveDate = new Date();

        const leaveData = {
            user_id: userId,
            leaveDate: leaveDate,
        };
        const chatRoom = await this.dmsRepository.findByIdChatRoom(chatRoomId);

        chatRoom.leaveInfo?.forEach((leaveUser) => {
            if (leaveUser.user_id == userId)
                throw new BadRequestException('이미 나간 채팅방 입니다.');
        });

        await this.dmsRepository.leaveChatRoom(chatRoomId, leaveData);

        let leaveStatus = 0;
        let count = 0;
        chatRoom.usersIds?.forEach((leave_user) => {
            count++;
            if (leave_user == userId) {
                leaveStatus++;
            }
        });

        if (count == leaveStatus) {
            chatRoom.deletedAt = new Date();
            chatRoom.save();
        }

        return { success: true };
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
