import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { Board } from './board.entity';
import { BoardRepository } from './board.repository';
import { CreateBoardDto } from './dto/board.dto';
import { BoardStatus } from './utils/board.status.enum';

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(BoardRepository)
        private boardRepository: BoardRepository
    ){}

    createBoard(
        user: User,
        createBoardDto: CreateBoardDto,
        status: BoardStatus
    ): Promise<{message: string}> {
        return this.boardRepository.createBoard(
            user,
            createBoardDto,
            status
        );
    }

    getBoard(
        search: string
    ): Promise<{board_count: number, boards: Board[]}> {
        return this.boardRepository.getBoard(search);
    }

    getDetailBoard(
        user: User,
        id: number
    ): Promise<Board> {
        return this.boardRepository.getDetailBoard(user ,id);
    }

    updateBoard(
        user: User,
        id: number,
        createBoardDto: CreateBoardDto,
        status: BoardStatus
    ): Promise<{message: string}> {
        return this.boardRepository.updateBoard(
            user,
            id,
            createBoardDto,
            status
        );
    }

    deleteBoard(
        user: User,
        id: number
    ): Promise<{message: string}> {
        return this.boardRepository.deleteBoard(user, id);
    }

    like(
        user: User,
        id: number
    ): Promise<{message: string}> {
        return this.boardRepository.like(user, id);
    }

    unlike(
        user: User,
        id: number
    ): Promise<{message: string}> {
        return this.boardRepository.unlike(user, id);
    }
}
