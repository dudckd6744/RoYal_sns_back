import { BadRequestException, Injectable } from '@nestjs/common';
import { errStatus } from 'src/resStatusDto/resStatus.dto';
import { User } from 'src/schemas/User';

import { ChatsGateway } from '../chats/chats.gateway';
import { DMsRepository } from './dms.repository';
import { CreateDMsDto } from './dto/dms.dto';

@Injectable()
export class DmsService {
    constructor(
        private dmsRepository: DMsRepository,
        private readonly chatGateway: ChatsGateway,
    ) {}

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

    async getChatRoomDMs(userId: string, chatRoomId: string) {
        const chatRoom = await this.dmsRepository.findByIdChatRoom(chatRoomId);

        let leave_user;
        let leave_user_date;
        const result = {};
        const all_DMs_data = [];

        chatRoom?.leaveInfo?.forEach(async (leaveUserData) => {
            if (leaveUserData.user_id == userId) {
                leave_user = leaveUserData.user_id;
                leave_user_date = leaveUserData.leaveDate;
            }
        });

        const chatRoomDMs = await this.dmsRepository.findByChatRoomIdDM(
            chatRoomId,
        );
        if (!leave_user) {
            result['DMs'] = chatRoomDMs;
            result['success'] = true;
            return result;
        }

        chatRoomDMs.forEach((DMs_data) => {
            if (DMs_data['createdAt'] > chatRoom.deletedAt) {
                if (DMs_data['createdAt'] > leave_user_date)
                    all_DMs_data.push(DMs_data);
            }
        });
        result['DMs'] = all_DMs_data;
        result['success'] = true;
        return result;
    }

    async createDMs(
        userId: string,
        chatRoomId: string,
        createDMsDto: CreateDMsDto,
    ) {
        const comment = createDMsDto.comment;
        const files = createDMsDto.files ?? null;

        const socketChatRoomId = await this.dmsRepository.findByIdChatRoom(
            chatRoomId,
        );
        console.log(socketChatRoomId);
        const DM = this.dmsRepository.createDM(
            chatRoomId,
            userId,
            comment,
            files,
        );

        await this.chatGateway.server.to(`${socketChatRoomId}`).emit('dm', DM);
    }

    async DeleteDMs(
        userId: string,
        DMId: string,
    ): Promise<{ success: true } | errStatus> {
        const DM = await this.dmsRepository.findByidDM(userId, DMId);

        DM.deletedAt = new Date();

        DM.save();

        return { success: true };
    }
}
