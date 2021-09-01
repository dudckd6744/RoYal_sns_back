import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { Board } from './board.entity';
import { BoardRepository } from './board.repository';
import { CreateBoardDto, CreateReplyDto } from './dto/board.dto';
import { Reply } from './sections/reply.entity';
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

    async createReply(
        user: User,
        id: number,
        createReplyDto: CreateReplyDto
    ): Promise<Reply> {
        const { comment } = createReplyDto;
        const reply = await Reply.create({
            userId:user.id,
            user,
            boardId:id,
            comment
        })
        const save_reply = await Reply.save(reply)

        const reply_data = await Reply.createQueryBuilder('reply')
            .where({id:save_reply.id})
            .leftJoinAndSelect('reply.user', 'user')
            .select([
                'reply.id',
                'reply.userId',
                'user.name',
                'reply.boardId',
                'reply.comment',
                'reply.createdAt'
            ])
            .getOne();
        const board = await this.boardRepository.findOne(id)
        board.reply ++
        await this.boardRepository.save(board)
        return reply_data
    }
}
