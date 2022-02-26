/* eslint-disable prefer-const */
import { BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatRoom } from 'src/schemas/ChatRoom';
import { DMs } from 'src/schemas/DMs';
import { User } from 'src/schemas/User';

export class DMsRepository {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(DMs.name) private dmsModel: Model<DMs>,
        @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>,
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
        const chatRoom = await this.chatRoomModel.findOne({
            _id: chatRoomId,
            deletedAt: null,
        });
        if (!chatRoom)
            throw new BadRequestException('해당 채팅방은 삭제된 채팅방입니다.');
        return chatRoom;
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

    async findByChatRoomIdDM(chatRoomId: string) {
        return await this.dmsModel
            .find({
                chatRoomId: chatRoomId,
                deletedAt: null,
            })
            .sort({ createdAt: -1 });
    }

    async createDM(
        chatRoomId: string,
        senderId: string,
        comment: string,
        files: Array<string>,
    ): Promise<DMs> {
        return await this.dmsModel.create({
            chatRoomId,
            senderId,
            comment,
            files,
        });
    }

    async findByidDM(userId: string, DMId: string) {
        const DM = await this.dmsModel.findOne({
            senderId: userId,
            _id: DMId,
            deletedAt: null,
        });

        if (!DM)
            throw new BadRequestException('해당 메세지를 찾을수 없습니다.');
        return DM;
    }
}
