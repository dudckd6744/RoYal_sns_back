import { BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { errStatus } from 'src/resStatusDto/resStatus.dto';
import { Board } from 'src/schemas/Board';
import { Like } from 'src/schemas/Like';
import { Reply } from 'src/schemas/Reply';
import { Tag } from 'src/schemas/Tag';
import { User } from 'src/schemas/User';
import { BulkWriteOpResultObject } from 'typeorm';

import {
    CreateBoardDto,
    CreateReplyDto,
    GetBoardsDto,
    IBulkWriteTag,
} from './dto/board.dto';
import { BoardStatus } from './utils/board.status.enum';

export class BoardRepository {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Reply.name) private replyModel: Model<Reply>,
        @InjectModel(Board.name) private boardModel: Model<Board>,
        @InjectModel(Like.name) private likeModel: Model<Like>,
        @InjectModel(Tag.name) private tagModel: Model<Tag>,
    ) {}

    async findByIdUser(userId: string): Promise<User> {
        return await this.userModel.findOne({ _id: userId });
    }

    createBoard(
        user: User,
        createBoardDto: CreateBoardDto,
        status: BoardStatus,
    ): Promise<Board> {
        const { description, files, tag } = createBoardDto;

        return this.boardModel.create({
            writer: user._id,
            userName: user.name,
            description,
            status,
            files,
            tag,
        });
    }

    upsertTag(tagData): Promise<BulkWriteOpResultObject> {
        return this.tagModel.bulkWrite(tagData);
    }
    // NOTE: 팔로우한 사용자의 게시글 || 자신의 게시글 가져오기
    async getFollowBoard(user: User): Promise<Board[]> {
        return await this.boardModel
            .find({ deletedAt: null })
            .find({
                $or: [
                    {
                        writer: { $in: user.following },
                        status: 'PUBLIC',
                    },
                    { writer: user._id },
                ],
            })
            .select(
                'description view like_count tag reply_count status IsLike files createdAt',
            )
            .sort({ createdAt: -1 })
            .populate('writer', 'name profile');
    }

    async likeBoard(userId: string, boardIds: Array<string>): Promise<Like[]> {
        return await this.likeModel.find({
            userId,
            boardId: { $in: boardIds },
        });
    }

    async getUserInfo(userId: string): Promise<User> {
        return await this.userModel
            .findOne({ _id: userId })
            .select(
                'name phone email profile follower following royal status isActive createdAt',
            );
    }

    async getMyBoards(userId: string): Promise<Board[]> {
        return await this.boardModel
            .find({ writer: userId, deletedAt: null })
            .select(
                'description view like_count tag reply_count status IsLike files createdAt',
            )
            .sort({ createdAt: -1 })
            .populate('writer', 'name profile');
    }

    async getOtherBoards(userId: string): Promise<Board[]> {
        return await this.boardModel
            .find({ writer: userId, status: 'PUBLIC', deletedAt: null })
            .select(
                'description view like_count tag reply_count status IsLike files createdAt',
            )
            .sort({ createdAt: -1 })
            .populate('writer', 'name profile');
    }
    // NOTE: 자신의 게시글 || 다른 유저의 게시글은 공개된 게시글만 가져오기
    async getBoards(
        userId: string,
        search_data: { [key: string]: string },
    ): Promise<Board[]> {
        return await this.boardModel
            .find({ deletedAt: null })
            .find({
                $or: [
                    {
                        writer: { $ne: userId },
                        status: 'PUBLIC',
                    },
                    { writer: userId },
                ],
            })
            .find(search_data)
            .sort({ createdAt: -1 })
            .select(
                'description view like_count tag reply_count status IsLike files createdAt',
            )
            .populate('writer', 'name profile');
    }

    async likedBoards(
        userId: string,
        likedBoardIds: Array<string>,
    ): Promise<Like[]> {
        return await this.likeModel.find({
            userId: userId,
            boardId: { $in: likedBoardIds },
        });
    }

    async getDetailBoard(boarId: string) {
        return await this.boardModel
            .findOne({ _id: boarId, deletedAt: null })
            .select(
                'description view like_count tag reply_count status IsLike files createdAt',
            )
            .populate('writer', 'name profile status');
    }

    async likedBoard(userId: string, boardId: string) {
        return await this.likeModel.findOne({
            userId,
            boardId,
        });
    }

    async updateBoard(
        userId: string,
        boardId: string,
        creatreBoardDto: CreateBoardDto,
        status: BoardStatus,
    ): Promise<Board> {
        const { description, files, tag } = creatreBoardDto;

        const board = await this.findBoard(userId, boardId);

        board.description = description;
        board.status = status;
        board.files = files;
        board.tag = tag;

        return board.save();
    }

    bulkWriteTag(tag_data: IBulkWriteTag[]): Promise<BulkWriteOpResultObject> {
        return this.tagModel.bulkWrite(tag_data);
    }

    async deleteBoard(userId: string, boardId: string): Promise<Board> {
        const board = await this.findBoard(userId, boardId);

        board.deletedAt = new Date();

        return board.save();
    }

    async like(
        user: User,
        boardId: string,
        parentId: string,
    ): Promise<{ success: true } | errStatus> {
        const parent_id = parentId ? parentId : null;
        const board = await this.boardModel.findOne({ _id: boardId });
        if (!board)
            throw new BadRequestException('해당 게시글이 존재 하지않습니다.');

        const like = await this.likeModel.findOneAndUpdate(
            {
                userId: user._id,
                boardId: board._id,
                parentId: parent_id,
            },
            {
                userId: user._id,
                boardId: board._id,
                parentId: parent_id,
            },
            { upsert: true },
        );
        if (parent_id != null) {
            const reply = await this.replyModel.findOne({ _id: parent_id });
            reply.like_count++;
            reply.save();
        } else {
            board.like_count++;
            board.save();
        }

        return { success: true };
    }

    async unlike(
        user: User,
        boardId: string,
        parentId: string,
    ): Promise<{ success: true } | errStatus> {
        const parent_id = parentId ? parentId : null;
        const board = await this.boardModel.findOne({ _id: boardId });

        if (!board)
            throw new BadRequestException('해당 게시글이 존재 하지않습니다.');

        const liked = await this.likeModel.findOneAndDelete({
            userId: user._id,
            boardId,
            parentId: parent_id,
        });
        if (!liked) {
            throw new BadRequestException('이미 좋아요를 취소한 게시글입니다.');
        }

        if (liked.parentId) {
            const reply = await this.replyModel.findOne({ _id: parent_id });
            reply.like_count--;
            reply.save();
        } else {
            board.like_count--;
            board.save();
        }

        return { success: true };
    }

    async createReply(
        user: User,
        boardId: string,
        createReplyDto: CreateReplyDto,
    ): Promise<{ success: true; reply_data: Reply } | errStatus> {
        const { comment } = createReplyDto;
        const parentId = createReplyDto.parentId
            ? createReplyDto.parentId
            : null;

        const reply = await this.replyModel.create({
            writer: user._id,
            boardId: boardId,
            comment,
            parentId,
        });
        await reply.save();

        const reply_data = await this.replyModel
            .findOne({ _id: reply._id })
            .select(
                'userId boardId parentId comment reply_count like_count IsLike createdAt',
            )
            .populate('writer', 'name profile');

        const replyed = await this.replyModel.findOne({
            _id: reply_data.parentId,
        });

        const board = await this.boardModel.findOne({ _id: boardId });

        if (parentId == reply_data.parentId && parentId != null) {
            replyed.reply_count++;
            await replyed.save();
            board.reply_count++;
            await board.save();
        } else if (parentId == null) {
            board.reply_count++;
            await board.save();
        }
        return { success: true, reply_data };
    }

    async getReply(
        user: User,
        boardId: string,
        skip: number,
        limit: number,
    ): Promise<
        { success: true; reply: Reply[]; reply_count: number } | errStatus
    > {
        const reply_count = await this.replyModel
            .find({ boardId: boardId, deletedAt: null, parentId: null })
            .count();

        const reply = await this.replyModel
            .find({ boardId: boardId, parentId: null, deletedAt: null })
            .sort({ like_count: -1, reply_count: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select(
                'userId boardId parentId comment reply_count like_count IsLike createdAt',
            )
            .populate('writer', 'name profile');

        const all_reply_data = [];

        const reply_heart = [];
        reply.forEach((reply_data, i) => {
            reply_heart.push(reply_data._id);
            all_reply_data.push(reply_data);
        });

        const re_reply = await this.replyModel
            .find({
                boardId: boardId,
                deletedAt: null,
                parentId: { $in: reply_heart },
            })
            .sort({ like_count: -1, reply_count: -1, createdAt: -1 })
            .select(
                'userId boardId parentId comment reply_count like_count IsLike createdAt',
            )
            .populate('writer', 'name profile');

        re_reply.forEach((re_reply_data) => {
            reply_heart.push(re_reply_data._id);
            all_reply_data.push(re_reply_data);
        });

        if (user) {
            const liked_board = await this.likeModel.find({
                userId: user._id,
                parentId: { $in: reply_heart },
            });

            all_reply_data.forEach((reply_data) => {
                liked_board.forEach((board_liked) => {
                    if (
                        reply_data._id.toString() ==
                        board_liked.parentId.toString()
                    ) {
                        reply_data.IsLike = true;
                    }
                });
            });

            return { success: true, reply: all_reply_data, reply_count };
        } else {
            return { success: true, reply: all_reply_data, reply_count };
        }
    }

    async deleteReply(
        user: User,
        boardId: string,
        replyId: string,
    ): Promise<{ success: true } | errStatus> {
        const reply = await this.replyModel.findOne({
            writer: user._id,
            _id: replyId,
        });

        if (!reply) {
            throw new BadRequestException('댓글을 삭제하는데 실패하였습니다.');
        }

        if (reply.parentId) {
            const reply_data = await this.replyModel.findOne({
                _id: reply.parentId,
            });
            reply.deletedAt = new Date();
            await reply.save();

            reply_data.reply_count - 1;
            await reply_data.save();
            return { success: true };
        }
        const board = await this.boardModel.findOne({ _id: boardId });

        reply.deletedAt = new Date();
        await reply.save();
        board.reply_count - 1;
        await board.save();

        return { success: true };
    }

    private async findBoard(userId, boardId) {
        const board = await this.boardModel.findOne({
            writer: userId,
            _id: boardId,
        });

        if (!board)
            throw new BadRequestException('해당 게시글이 존재 하지않습니다.');

        return board;
    }
}
