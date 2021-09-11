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
import { Board } from 'src/schemas/Board';
import { Reply } from 'src/schemas/Reply';
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
        @ReqUser() email: string,
        @Body() createBoardDto: CreateBoardDto,
        @Body('status', BoardStatusPipe) status: BoardStatus,
    ): Promise<{ message: string }> {
        return this.boardSerivce.createBoard(email, createBoardDto, status);
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

    @Get('/')
    getBoard(@Query() getBoardDto: GetBoardsDto): Promise<Board[]> {
        return this.boardSerivce.getBoard(getBoardDto);
    }

    @Get('/:boardId')
    getDeatailBoard(
        @ReqUser() email: string,
        @Param('boardId') boardId: string,
        @Query('over_view') over_view: boolean,
    ): Promise<Board> {
        return this.boardSerivce.getDetailBoard(email, boardId, over_view);
    }

    @Put('/:boardId')
    @UsePipes(ValidationPipe)
    @UseGuards(AuthGuard_renewal)
    updateBoard(
        @ReqUser() email: string,
        @Param('boardId') boardId: string,
        @Body() createBoardDto: CreateBoardDto,
        @Body('status', BoardStatusPipe) status: BoardStatus,
    ): Promise<{ message: string }> {
        return this.boardSerivce.updateBoard(
            email,
            boardId,
            createBoardDto,
            status,
        );
    }

    @Delete('/:boardId')
    @UseGuards(AuthGuard_renewal)
    deleteBoard(
        @ReqUser() email: string,
        @Param('boardId') boardId: string,
    ): Promise<{ message: string }> {
        return this.boardSerivce.deleteBoard(email, boardId);
    }

    @Post('/:boardId/like')
    @UseGuards(AuthGuard_renewal)
    like(
        @ReqUser() email: string,
        @Param('boardId') boardId: string,
        @Body('parentId') parentId: string,
    ): Promise<{ message: string }> {
        return this.boardSerivce.like(email, boardId, parentId);
    }

    @Delete('/:boardId/unlike')
    @UseGuards(AuthGuard_renewal)
    unlike(
        @ReqUser() email: string,
        @Param('boardId') boardId: string,
        @Body('parentId') parentId: string,
    ): Promise<{ message: string }> {
        return this.boardSerivce.unlike(email, boardId, parentId);
    }

    @Post('/:boardId/reply')
    @UseGuards(AuthGuard_renewal)
    @UsePipes(ValidationPipe)
    createReply(
        @ReqUser() email: string,
        @Body() createReplyDto: CreateReplyDto,
        @Param('boardId') boardId: string,
    ): Promise<Reply> {
        return this.boardSerivce.createReply(email, boardId, createReplyDto);
    }

    @Get('/:boardId/reply')
    getReply(
        @Param('boardId') boardId: string,
    ): Promise<{ reply_count: number; reply: Reply[] }> {
        return this.boardSerivce.getReply(boardId);
    }
}
