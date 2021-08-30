import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from 'src/utils/auth.guard';
import { ReqUser } from 'src/utils/user.decorater';
import { User } from '../auth/user.entity';
import { Board } from './board.entity';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/board.dto';
import { BoardStatusPipe } from './pipes/board.status.pipes';
import { BoardStatus } from './utils/board.status.enum';

@Controller('boards')
export class BoardController {
    constructor( private boardSerivce: BoardService){}

    @Post('/')
    @UsePipes(ValidationPipe)
    @UseGuards(AuthGuard)
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
        @Param('id', ParseIntPipe) id: number
    ): Promise<Board> {
        return this.boardSerivce.getDetailBoard(user, id);
    }

    @Put('/:id')
    @UsePipes(ValidationPipe)
    @UseGuards(AuthGuard)
    updateBoard(
        @ReqUser() user: User,
        @Param('id', ParseIntPipe) id: number,
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
    @UseGuards(AuthGuard)
    deleteBoard(
        @ReqUser() user:User,
        @Param('id', ParseIntPipe) id: number
    ): Promise<{message: string}> {
        return this.boardSerivce.deleteBoard(user, id)
    }

    @Post('/:id/like')
    @UseGuards(AuthGuard)
    like(
        @ReqUser() user:User,
        @Param('id', ParseIntPipe) id:number
    ): Promise<{message: string}> {
        return this.boardSerivce.like(user, id)
    }

    @Post('/:id/unlike')
    @UseGuards(AuthGuard)
    unlike(
        @ReqUser() user:User,
        @Param('id', ParseIntPipe) id:number
    ): Promise<{message: string}> {
        return this.boardSerivce.unlike(user, id)
    }
}
