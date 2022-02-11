import { BadRequestException, Injectable } from '@nestjs/common';
import { errStatus } from 'src/resStatusDto/resStatus.dto';
import { Board } from 'src/schemas/Board';
import { Reply } from 'src/schemas/Reply';
import { User } from 'src/schemas/User';

import { BoardRepository } from './board.repository';
import {
    CreateBoardDto,
    CreateReplyDto,
    GetBoardsDto,
    IBulkWriteTag,
} from './dto/board.dto';
import { BoardStatus } from './utils/board.status.enum';

@Injectable()
export class BoardService {
    constructor(private boardRepository: BoardRepository) {}

    async createBoard(
        email: string,
        createBoardDto: CreateBoardDto,
        status: BoardStatus,
    ): Promise<{ success: true } | errStatus> {
        const { tag } = createBoardDto;
        const user = await this.boardRepository.findByEmailUser(email);

        if (tag.length >= 30)
            throw new BadRequestException(
                '태그 수는 30개 이하로 입력해주세요!',
            );

        const board = await this.boardRepository.createBoard(
            user,
            createBoardDto,
            status,
        );

        await board.save();

        const tag_data = tag.map((doc) => ({
            updateOne: {
                filter: { tag: doc },
                update: doc,
                upsert: true,
            },
        }));

        this.boardRepository.upsertTag(tag_data);

        return { success: true };
    }

    async getFollowBoard(email: string): Promise<Board[] | errStatus> {
        const user = await this.boardRepository.findByEmailUser(email);

        const follow_boards = await this.boardRepository.getFollowBoard(user);

        const board_heart = [];

        follow_boards.forEach((board_data) => {
            board_heart.push(board_data._id);
        });

        if (user) {
            const liked_board = await this.boardRepository.likeBoard(
                user._id,
                board_heart,
            );

            follow_boards.forEach((board_id) => {
                liked_board.forEach((board_liked) => {
                    if (
                        board_id._id.toString() ==
                        board_liked.boardId.toString()
                    ) {
                        board_id.IsLike = true;
                    }
                });
            });
            return follow_boards;
        } else {
            return follow_boards;
        }
    }

    async getMyBoard(
        email: string,
        userId: string,
    ): Promise<{ success: true; boards: Board[]; user: User } | errStatus> {
        const user = await this.boardRepository.getUserInfo(email);
        if (user._id == userId) {
            // NOTE: 자신의 게시글일 경우 status 가 PUBLIC || PRIVATE 둘다 가져온다.
            const boards = await this.boardRepository.getMyBoards(userId);
            return { success: true, boards, user };
        } else {
            // NOTE: 자신의 게시글이 아닐 경우 status 가 PUBLIC 인것만 가져온다.
            const boards = await this.boardRepository.getOtherBoards(userId);

            return { success: true, boards, user };
        }
    }

    async getBoard(
        email: string,
        getBoardDto: GetBoardsDto,
    ): Promise<Board[] | errStatus> {
        const { search, search_type } = getBoardDto;

        const user = await this.boardRepository.findByEmailUser(email);

        let search_data;
        switch (search_type) {
            case 'tag':
                search_data = { tag: { $regex: '.*' + search + '.*' } };
                break;
            case 'writer':
                search_data = { userName: { $regex: '.*' + search + '.*' } };
                break;
            case '장소':
                break;
        }

        const boards = await this.boardRepository.getBoards(user, search_data);

        const likedBoardIds = [];
        boards.forEach((board_data, i) => {
            likedBoardIds.push(board_data._id);
        });

        if (user) {
            const likedBoard = await this.boardRepository.likedBoards(
                user,
                likedBoardIds,
            );

            boards.forEach((board_id) => {
                likedBoard.forEach((board_liked) => {
                    if (
                        board_id._id.toString() ==
                        board_liked.boardId.toString()
                    ) {
                        board_id.IsLike = true;
                    }
                });
            });
            return boards;
        } else {
            return boards;
        }
    }

    async getDetailBoard(
        email: string,
        boardId: string,
        over_view: boolean,
    ): Promise<{ success: true; board: Board } | errStatus> {
        const user = await this.boardRepository.findByEmailUser(email);

        const board = await this.boardRepository.getDetailBoard(boardId);

        if (!board)
            throw new BadRequestException('해당 게시글이 존재 하지않습니다.');

        if (user && !over_view) {
            board.view++;
            board.save();
        }
        if (user) {
            const like = this.boardRepository.likedBoard(user._id, boardId);
            if (like) {
                board.IsLike = true;
            }
        }
        return { success: true, board };
    }

    async updateBoard(
        email: string,
        boardId: string,
        createBoardDto: CreateBoardDto,
        status: BoardStatus,
    ): Promise<{ success: true } | errStatus> {
        const { tag } = createBoardDto;

        const user = await this.boardRepository.findByEmailUser(email);

        await this.boardRepository.updateBoard(
            user,
            boardId,
            createBoardDto,
            status,
        );

        const tagData: IBulkWriteTag[] = tag.map((doc) => ({
            updateOne: {
                filter: { tag: doc },
                update: doc,
                upsert: true,
            },
        }));

        this.boardRepository.bulkWriteTag(tagData);

        return { success: true };
    }

    deleteBoard(user: User, boardId: string): Promise<{ success: true }> {
        return this.boardRepository.deleteBoard(user, boardId);
    }

    like(
        user: User,
        boardId: string,
        parentId: string,
    ): Promise<{ success: true } | errStatus> {
        return this.boardRepository.like(user, boardId, parentId);
    }

    unlike(
        user: User,
        boardId: string,
        parentId: string,
    ): Promise<{ success: true } | errStatus> {
        return this.boardRepository.unlike(user, boardId, parentId);
    }

    async createReply(
        user: User,
        boardId: string,
        createReplyDto: CreateReplyDto,
    ): Promise<{ success: true; reply_data: Reply } | errStatus> {
        return this.boardRepository.createReply(user, boardId, createReplyDto);
    }

    async getReply(
        user: User,
        boardId: string,
        skip: number,
        limit: number,
    ): Promise<
        { success: true; reply: Reply[]; reply_count: number } | errStatus
    > {
        return this.boardRepository.getReply(user, boardId, skip, limit);
    }

    async deleteReply(
        user: User,
        boardId: string,
        replyId: string,
    ): Promise<{ success: true } | errStatus> {
        return this.boardRepository.deleteReply(user, boardId, replyId);
    }
}
