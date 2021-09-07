import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard_renewal } from 'src/utils/auth.guard';
import { ReqUser } from 'src/utils/user.decorater';
import { User } from '../auth/user.entity';
import { Board } from './board.entity';
import { BoardService } from './board.service';
import { CreateBoardDto, CreateReplyDto } from './dto/board.dto';
import { BoardStatusPipe } from './pipes/board.status.pipes';
import { Reply } from './sections/reply.entity';
import { BoardStatus } from './utils/board.status.enum';

@Controller('api/boards')
export class BoardController {
    constructor( private boardSerivce: BoardService){}

    @Post('/')
    @UsePipes(ValidationPipe)
    @UseGuards(AuthGuard_renewal)
    createBoard(
        @ReqUser() user: User,
        @Body() createBoardDto: CreateBoardDto,
        @Body('status', BoardStatusPipe) status: BoardStatus
    ): Promise<{message: string}> {
        return this.boardSerivce.createBoard(
            user, createBoardDto, status
        );
    }

    @Get('/')
    getBoard(
        @Query('search') search: string
    ): Promise<{board_count: number, boards: Board[]}> {
        return this.boardSerivce.getBoard(search);
    }

    @Get('/:id')
    getDeatailBoard(
        @ReqUser() user: User,
        @Param('id') id: string
    ): Promise<Board> {
        return this.boardSerivce.getDetailBoard(user, id);
    }

    @Put('/:id')
    @UsePipes(ValidationPipe)
    @UseGuards(AuthGuard_renewal)
    updateBoard(
        @ReqUser() user: User,
        @Param('id') id: string,
        @Body() createBoardDto: CreateBoardDto,
        @Body('status', BoardStatusPipe) status: BoardStatus
    ): Promise<{message: string}> {
        return this.boardSerivce.updateBoard(
            user,
            id,
            createBoardDto,
            status
        )
    }

    @Delete("/:id")
    @UseGuards(AuthGuard_renewal)
    deleteBoard(
        @ReqUser() user:User,
        @Param('id') id: string
    ): Promise<{message: string}> {
        return this.boardSerivce.deleteBoard(user, id)
    }

    @Post('/:id/like')
    @UseGuards(AuthGuard_renewal)
    like(
        @ReqUser() user:User,
        @Param('id') id:string,
        @Body('parentId') parentId:string
    ): Promise<{message: string}> {
        return this.boardSerivce.like(user, id, parentId)
    }

    @Delete('/:id/unlike')
    @UseGuards(AuthGuard_renewal)
    unlike(
        @ReqUser() user:User,
        @Param('id') id:string
    ): Promise<{message: string}> {
        return this.boardSerivce.unlike(user, id)
    }

    @Post('/:id/reply')
    @UseGuards(AuthGuard_renewal)
    @UsePipes(ValidationPipe)
    createReply(
        @ReqUser() user: User,
        @Body() createReplyDto: CreateReplyDto,
        @Param('id') id: string 
    ): Promise<Reply> {
        return this.boardSerivce.createReply(user, id, createReplyDto)
    }

    @Get('/:id/reply')
    getReply(
        @Param('id') id: string
    ): Promise<{reply_count: number, reply: Reply[]}> {
        return this.boardSerivce.getReply(id);
    }
}
