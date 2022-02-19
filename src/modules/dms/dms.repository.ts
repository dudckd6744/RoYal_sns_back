/* eslint-disable prefer-const */
import { BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { errStatus } from 'src/resStatusDto/resStatus.dto';
import { ChatRoom } from 'src/schemas/ChatRoom';
import { DMs } from 'src/schemas/DMs';
import { User } from 'src/schemas/User';

import { ChatsGateway } from '../chats/chats.gateway';
import { CreateDMsDto } from './dto/dms.dto';

export class DMsRepository {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(DMs.name) private dmsModel: Model<DMs>,
        @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>,
        private readonly chatGateway: ChatsGateway,
    ) {}

    async upsertChatRoom(userIds: Array<string>, deleteAt): Promise<ChatRoom> {
        return await this.chatRoomModel.findOneAndUpdate(
            {
                usersIds: userIds,
                deletedAt: deleteAt,
            },
            { usersIds: userIds },
            { upsert: true, new: true },
        );
    }

    async joinChatRoom(chatRoomId: string, userId: string, leaveDate: string) {
        return await this.chatRoomModel.findOneAndUpdate(
            { _id: chatRoomId },
            {
                $pull: {
                    leaveInfo: {
                        userId: userId,
                        leaveDate: leaveDate,
                    },
                },
            },
            { multi: true },
        );
    }

    async findByIdChatRoom(chatRoomId: string): Promise<ChatRoom> {
        return await this.chatRoomModel.findById(chatRoomId);
    }

    async leaveChatRoom(
        chatRoomId: string,
        leaveData: { [key: string]: string | Date },
    ) {
        return await this.chatRoomModel.findOneAndUpdate(
            { _id: chatRoomId },
            { $push: { leaveInfo: leaveData } },
        );
    }

    async getChatRoomDMs(user: User, chatRoom_id: string) {
        const chatRoom = await this.chatRoomModel.findOne({ _id: chatRoom_id });
        let leave_user = null;
        let leave_user_date = null;
        let result = {};
        let all_DMs_data = [];
        chatRoom.leaveInfo.forEach(async (leave_user_data) => {
            if (leave_user_data.user_id == user._id.toString()) {
                leave_user = leave_user_data.user_id;
                leave_user_date = leave_user_data.leaveDate;
            }
        });
        const DMs = await this.dmsModel.find({
            chatRoomId: chatRoom._id,
        });
        if (!leave_user) {
            result['DMs'] = DMs;
            result['success'] = true;
            return result;
        }

        DMs.forEach((DMs_data) => {
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
        user: User,
        chatRoom_id: string,
        createDMsDto: CreateDMsDto,
    ) {
        const comment = createDMsDto.comment;
        const files = createDMsDto.files ? createDMsDto.files : null;

        const socket_room_id = await this.chatRoomModel.findOne({
            _id: chatRoom_id,
        });

        const ChatRoom_dms = await this.dmsModel.create({
            chatRoomId: chatRoom_id,
            senderId: user._id,
            comment,
            files,
        });

        const new_commnet = await this.dmsModel.findOne({
            _id: ChatRoom_dms._id,
        });

        this.chatGateway.server.to(`${socket_room_id}`).emit('dm', new_commnet);
    }

    async DeleteDMs(
        user: User,
        DMs_id: string,
    ): Promise<{ success: true } | errStatus> {
        const deleteDMs = await this.dmsModel.findByIdAndUpdate(DMs_id, {
            deletedAt: new Date(),
        });

        if (!deleteDMs) {
            throw new BadRequestException('메세지 삭제에 실패 하였습니다.');
        }
        return { success: true };
    }
}
