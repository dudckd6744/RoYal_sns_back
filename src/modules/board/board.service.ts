import { Injectable } from '@nestjs/common';
import { Board } from 'src/schemas/Board';
import { Reply } from 'src/schemas/Reply';

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
        email: string,
        createBoardDto: CreateBoardDto,
        status: BoardStatus,
    ): Promise<{ message: string }> {
        return this.boardRepository.createBoard(email, createBoardDto, status);
    }

    // fileTaging(
    //   email: string,
    //   tagFileDto: TagFileDto
    // ): Promise<{message: string}> {
    //   return this.boardRepository.fileTaging(email, tagFileDto);
    // }

    getBoard(getBoardDto: GetBoardsDto): Promise<Board[]> {
        return this.boardRepository.getBoard(getBoardDto);
    }

    getDetailBoard(
        email: string,
        boardId: string,
        over_view: boolean,
    ): Promise<Board> {
        return this.boardRepository.getDetailBoard(email, boardId, over_view);
    }

    updateBoard(
        email: string,
        boardId: string,
        createBoardDto: CreateBoardDto,
        status: BoardStatus,
    ): Promise<{ message: string }> {
        return this.boardRepository.updateBoard(
            email,
            boardId,
            createBoardDto,
            status,
        );
    }

    deleteBoard(email: string, boardId: string): Promise<{ message: string }> {
        return this.boardRepository.deleteBoard(email, boardId);
    }

    like(
        email: string,
        boardId: string,
        parentId: string,
    ): Promise<{ message: string }> {
        return this.boardRepository.like(email, boardId, parentId);
    }

    unlike(
        email: string,
        boardId: string,
        parentId: string,
    ): Promise<{ message: string }> {
        return this.boardRepository.unlike(email, boardId, parentId);
    }

    async createReply(
        email: string,
        boardId: string,
        createReplyDto: CreateReplyDto,
    ): Promise<Reply> {
        return this.boardRepository.createReply(email, boardId, createReplyDto);
    }

    async getReply(
        boardId: string,
    ): Promise<{ reply_count: number; reply: Reply[] }> {
        return this.boardRepository.getReply(boardId);
    }
}
