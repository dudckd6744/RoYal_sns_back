import { BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { Board } from 'src/schemas/Board';
import { Like } from 'src/schemas/Like';
import { Reply } from 'src/schemas/Reply';
import { Tag } from 'src/schemas/Tag';
import { User } from 'src/schemas/User';

import {
    CreateBoardDto,
    CreateReplyDto,
    GetBoardsDto,
    TagFileDto,
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

    async createBoard(
        email: string,
        createBoardDto: CreateBoardDto,
        status: BoardStatus,
    ): Promise<{ message: string }> {
        const { description, files } = createBoardDto;

        const user = await this.userModel.findOne({ email });

        const board = await this.boardModel.create({
            writer: user._id,
            description,
            status,
            files,
        });
        await board.save();

        return { message: 'success' };
    }

    // async fileTaging(
    //   email: string,
    //   tagFileDto: TagFileDto
    // ): Promise<{message: string}> {
    //   const { files, tag } = tagFileDto
    //   console.log(files)
    //   const tag_data = await this.tagModel.create({
    //     _id:files,
    //     tag:tag
    //   })

    //   tag_data.save()

    //   return {message: "success"}
    // }

    async getBoard(getBoardDto: GetBoardsDto): Promise<Board[]> {
        const { search, search_type } = getBoardDto;

        let search_data;
        switch (search_type) {
            case 'tag':
                break;
            case 'title':
                search_data = { writer: { $regex: '.*' + search + '.*' } };
                break;
            case 'writer':
                break;
        }
        const boards = await this.boardModel
            .find({ deletedAt: null })
            .find(search_data)
            .sort({ createdAt: -1 })
            .select(
                'description view like_count reply_count status IsLike files createdAt',
            )
            .populate('writer', 'name profile');

        return boards;
    }

    async getDetailBoard(
        email: string,
        id: string,
        over_view: boolean,
    ): Promise<Board> {
        const user = await this.userModel.findOne({ email });

        const board = await this.boardModel
            .findOne({ _id: id, deletedAt: null })
            .select(
                'description view like_count reply_count status IsLike files createdAt',
            )
            .populate('writer', 'name profile');

        // // let file_tag =
        // board.files.forEach(async (element, i) => {
        //   const tag_data = await this.tagModel.findOne({_id:element})
        //   console.log(tag_data.tag[i])
        // })

        if (!board)
            throw new BadRequestException('해당 게시글이 존재 하지않습니다.');

        if (user && !over_view) {
            board.view++;
            await board.save();
        }
        if (user) {
            const like = await this.likeModel.findOne({
                userId: user._id,
                boardId: board._id,
            });
            if (like) {
                board.IsLike = true;
            }
        }
        return board;
    }

    async updateBoard(
        email: string,
        id: string,
        creatreBoardDto: CreateBoardDto,
        status: BoardStatus,
    ): Promise<{ message: string }> {
        const { description, tag, files } = creatreBoardDto;

        const board = await this.findBoard(email, id);

        board.description = description;
        board.status = status;
        board.files = files;
        board.tag = tag;

        await board.save();

        return { message: 'success' };
    }

    async deleteBoard(
        email: string,
        boardId: string,
    ): Promise<{ message: string }> {
        const board = await this.findBoard(email, boardId);

        board.deletedAt = new Date();

        await board.save();

        return { message: 'success' };
    }

    async like(
        email: string,
        boardId: string,
        parentId: string,
    ): Promise<{ message: 'success' }> {
        const parent_id = parentId ? parentId : null;

        const user = await this.userModel.findOne({ email });

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
        if (parent_id) {
            const reply = await this.replyModel.findOne({ _id: like.parentId });
            reply.like_count++;
            reply.save();
        } else {
            board.like_count++;
            board.save();
        }

        return { message: 'success' };
    }

    async unlike(
        email: string,
        boardId: string,
        parentId: string,
    ): Promise<{ message: 'success' }> {
        const parent_id = parentId ? parentId : null;

        const user = await this.userModel.findOne({ email });

        const board = await this.boardModel.findOne({ _id: boardId });
        if (!board)
            throw new BadRequestException('해당 게시글이 존재 하지않습니다.');

        const liked = await this.likeModel.findOne({
            userId: user._id,
            boardId: boardId,
            parentId: parent_id,
        });

        if (!liked)
            throw new BadRequestException('이미 좋아요를 취소한 게시글입니다.');

        liked.delete();

        if (parent_id) {
            const reply = await this.replyModel.findOne({ _id: parent_id });
            reply.like_count++;
            reply.save();
        } else {
            board.like_count++;
            board.save();
        }

        return { message: 'success' };
    }

    async createReply(
        email: string,
        boardId: string,
        createReplyDto: CreateReplyDto,
    ): Promise<Reply> {
        const { comment } = createReplyDto;
        const parentId = createReplyDto.parentId
            ? createReplyDto.parentId
            : null;

        const user = await this.userModel.findOne({ email });

        const reply = await this.replyModel.create({
            writer: user.id,
            boardId: boardId,
            comment,
            parentId,
        });
        await reply.save();

        const reply_data = await this.replyModel
            .findOne({ _id: reply.id })
            .select('writer boardId parentId comment createdAt ')
            .populate('writer', 'name');

        const board = await this.boardModel.findOne({ _id: boardId });

        if (parentId == reply_data.id) {
            reply_data.reply_count++;
            await reply_data.save();
            board.reply_count++;
            await board.save();
        } else if (parentId == null) {
            board.reply_count++;
            await board.save();
        }
        return reply_data;
    }

    async getReply(
        boardId: string,
    ): Promise<{ reply_count: number; reply: Reply[] }> {
        const reply_count = await this.replyModel
            .find({ boardId: boardId, deletedAt: null })
            .count();

        const reply = await this.replyModel
            .find({ boardId: boardId })
            .sort({ like_count: -1, reply_count: -1, createdAt: -1 })
            .select(
                'userId boardId parentId comment reply_count like_count IsLike createdAt',
            )
            .populate('writer', 'name');

        return { reply_count, reply };
    }

    private async findBoard(email, boardId) {
        const user = await this.userModel.findOne({ email });

        const board = await this.boardModel.findOne({
            writer: user._id,
            _id: boardId,
        });

        if (!board)
            throw new BadRequestException('해당 게시글이 존재 하지않습니다.');
        else if (board.writer != user.id)
            throw new BadRequestException('사용자 게시글이 아닙니다.');

        return board;
    }
}
