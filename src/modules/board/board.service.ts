import { Injectable } from '@nestjs/common';
import { Board } from 'src/schemas/Board';
import { Reply } from 'src/schemas/Reply';
import { User } from 'src/schemas/User';

import { BoardRepository } from './board.repository';
import {
    CreateBoardDto,
    CreateReplyDto,
    GetBoardsDto,
    TagFileDto,
} from './dto/board.dto';
import { BoardStatus } from './utils/board.status.enum';

@Injectable()
export class BoardService {
    constructor(private boardRepository: BoardRepository) {}

    createBoard(
        user: User,
        createBoardDto: CreateBoardDto,
        status: BoardStatus,
    ): Promise<{ message: string }> {
        return this.boardRepository.createBoard(user, createBoardDto, status);
    }

    // fileTaging(
    //   user: User,
    //   tagFileDto: TagFileDto
    // ): Promise<{message: string}> {
    //   return this.boardRepository.fileTaging(user, tagFileDto);
    // }

    getFollowBoard(
        user: User
    ): Promise<Board[]> {
        return this.boardRepository.getFollowBoard(user);
    }

    getBoard(
        user: User,
        getBoardDto: GetBoardsDto
    ): Promise<Board[]> {
        return this.boardRepository.getBoard(user, getBoardDto);
    }

    getDetailBoard(
        user: User,
        boardId: string,
        over_view: boolean,
    ): Promise<Board> {
        return this.boardRepository.getDetailBoard(user, boardId, over_view);
    }

    updateBoard(
        user: User,
        boardId: string,
        createBoardDto: CreateBoardDto,
        status: BoardStatus,
    ): Promise<{ message: string }> {
        return this.boardRepository.updateBoard(
            user,
            boardId,
            createBoardDto,
            status,
        );
    }

    deleteBoard(
        user: User,
        boardId: string
    ): Promise<{ message: string }> {
        return this.boardRepository.deleteBoard(user, boardId);
    }

    like(
        user: User,
        boardId: string,
        parentId: string,
    ): Promise<{ message: string }> {
        return this.boardRepository.like(user, boardId, parentId);
    }

    unlike(
        user: User,
        boardId: string,
        parentId: string,
    ): Promise<{ message: string }> {
        return this.boardRepository.unlike(user, boardId, parentId);
    }

    async createReply(
        user: User,
        boardId: string,
        createReplyDto: CreateReplyDto,
    ): Promise<Reply> {
        return this.boardRepository.createReply(user, boardId, createReplyDto);
    }

    async getReply(
        boardId: string,
    ): Promise<{ reply_count: number; reply: Reply[] }> {
        return this.boardRepository.getReply(boardId);
    }
}
