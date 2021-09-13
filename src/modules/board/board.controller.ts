import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { logger } from 'src/configs/winston';
import { Board } from 'src/schemas/Board';
import { Reply } from 'src/schemas/Reply';
import { User } from 'src/schemas/User';
import { AuthGuard_renewal } from 'src/utils/auth.guard';
import { ReqUser } from 'src/utils/user.decorater';

import { BoardService } from './board.service';
import {
    CreateBoardDto,
    CreateReplyDto,
    GetBoardsDto,
    TagFileDto,
} from './dto/board.dto';
import { BoardStatusPipe } from './pipes/board.status.pipes';
import { BoardStatus } from './utils/board.status.enum';

@Controller('api/boards')
export class BoardController {
    constructor(private boardSerivce: BoardService) {}

    @Post('/')
    @UsePipes(ValidationPipe)
    @UseGuards(AuthGuard_renewal)
    createBoard(
        @ReqUser() user: User,
        @Body() createBoardDto: CreateBoardDto,
        @Body('status', BoardStatusPipe) status: BoardStatus,
    ): Promise<{ message: string }> {
        return this.boardSerivce.createBoard(user, createBoardDto, status);
    }

    // @Post('/tag')
    // @UsePipes(ValidationPipe)
    // @UseGuards(AuthGuard_renewal)
    // fileTaging(
    //     @ReqUser() email: string,
    //     @Body() tagFileDto: TagFileDto,
    // ): Promise<{ message: string }> {
    //     return this.boardSerivce.fileTaging(email, tagFileDto);
    // }

    @Get('/followBoard')
    @UseGuards(AuthGuard_renewal)
    getFollowBoard(
      @ReqUser() user: User
    ): Promise<Board[]> {
        return this.boardSerivce.getFollowBoard(user);
    }

    @Get('/')
    getBoard(
      @ReqUser() user: User,
      @Query() getBoardDto: GetBoardsDto
    ): Promise<Board[]> {
        return this.boardSerivce.getBoard(user, getBoardDto);
    }

    @Get('/:boardId')
    getDeatailBoard(
       @ReqUser() user: User,  
        @Param('boardId') boardId: string,
        @Query('over_view') over_view: boolean,
    ): Promise<Board> {
        logger.info(`${user.email}님이 ${boardId} 게시글에 접속하였습니다.`)
        return this.boardSerivce.getDetailBoard(user, boardId, over_view);
    }

    @Put('/:boardId')
    @UsePipes(ValidationPipe)
    @UseGuards(AuthGuard_renewal)
    updateBoard(
        @ReqUser() user: User,
        @Param('boardId') boardId: string,
        @Body() createBoardDto: CreateBoardDto,
        @Body('status', BoardStatusPipe) status: BoardStatus,
    ): Promise<{ message: string }> {
        return this.boardSerivce.updateBoard(
            user,
            boardId,
            createBoardDto,
            status,
        );
    }

    @Delete('/:boardId')
    @UseGuards(AuthGuard_renewal)
    deleteBoard(
        @ReqUser() user: User,
        @Param('boardId') boardId: string,
    ): Promise<{ message: string }> {
        return this.boardSerivce.deleteBoard(user, boardId);
    }

    @Post('/:boardId/like')
    @UseGuards(AuthGuard_renewal)
    like(
        @ReqUser() user: User,
        @Param('boardId') boardId: string,
        @Body('parentId') parentId: string,
    ): Promise<{ message: string }> {
      logger.info(`${user.email}님이 ${boardId} 게시글에 좋아요눌렀습니다.`)
        return this.boardSerivce.like(user, boardId, parentId);
    }

    @Delete('/:boardId/unlike')
    @UseGuards(AuthGuard_renewal)
    unlike(
        @ReqUser() user: User,
        @Param('boardId') boardId: string,
        @Body('parentId') parentId: string,
    ): Promise<{ message: string }> {
        return this.boardSerivce.unlike(user, boardId, parentId);
    }

    @Post('/:boardId/reply')
    @UseGuards(AuthGuard_renewal)
    @UsePipes(ValidationPipe)
    createReply(
        @ReqUser() user: User,
        @Body() createReplyDto: CreateReplyDto,
        @Param('boardId') boardId: string,
    ): Promise<Reply> {
      logger.info(`${user.email}님이 ${boardId} 게시글에 댓글을 작성하였습니다..`)
        return this.boardSerivce.createReply(user, boardId, createReplyDto);
    }

    @Get('/:boardId/reply')
    getReply(
        @Param('boardId') boardId: string,
    ): Promise<{ reply_count: number; reply: Reply[] }> {
        return this.boardSerivce.getReply(boardId);
    }
}
