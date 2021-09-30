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
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
} from '@nestjs/swagger';
import { logger } from 'src/configs/winston';
import { Board } from 'src/schemas/Board';
import { Reply } from 'src/schemas/Reply';
import { User } from 'src/schemas/User';
import { AuthGuard_renewal } from 'src/utils/auth.guard';
import { ReqUser } from 'src/utils/user.decorater';

import { errStatus, Success } from '../auth/dto/user.create.dto';
import { BoardService } from './board.service';
import {
    CreateBoardDto,
    CreateReplyDto,
    GetBoardsDto,
    GetFallowBoardsDto,
    SwaggerCreateBoardDto,
    SwaggerLikeDto,
    SwaggerReplyDto,
    TagFileDto,
} from './dto/board.dto';
import { BoardStatusPipe } from './pipes/board.status.pipes';
import { BoardStatus } from './utils/board.status.enum';

@Controller('api/boards')
export class BoardController {
    constructor(private boardSerivce: BoardService) { }

    @ApiOkResponse({ description: 'success', type: Success })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '게시글 작성하기' })
    @ApiBody({ type: SwaggerCreateBoardDto })
    @ApiBearerAuth()
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

    @ApiOkResponse({ description: 'success', type: GetFallowBoardsDto })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '팔로잉한 유저 게시글 가져오기' })
    @Get('/followBoard')
    @UseGuards(AuthGuard_renewal)
    getFollowBoard(@ReqUser() user: User): Promise<Board[]> {
        return this.boardSerivce.getFollowBoard(user);
    }

    @ApiOkResponse({ description: 'success', type: GetFallowBoardsDto })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '전체 게시글 가져오기' })
    @Get('/')
    getBoard(
        @ReqUser() user: User,
        @Query() getBoardDto: GetBoardsDto,
    ): Promise<Board[]> {
        return this.boardSerivce.getBoard(user, getBoardDto);
    }

    @ApiOkResponse({ description: 'success', type: GetFallowBoardsDto })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '게시글 상세내용 가져오기' })
    @Get('/:boardId')
    getDeatailBoard(
        @ReqUser() user: User,
        @Param('boardId') boardId: string,
        @Query('over_view') over_view: boolean,
    ): Promise<Board> {
        logger.info(`${user.email}님이 ${boardId} 게시글에 접속하였습니다.`);
        return this.boardSerivce.getDetailBoard(user, boardId, over_view);
    }

    @ApiOkResponse({ description: 'success', type: Success })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '게시글 수정하기' })
    @ApiBearerAuth()
    @Put('/:boardId')
    @UsePipes(ValidationPipe)
    @UseGuards(AuthGuard_renewal)
    @ApiBody({ type: SwaggerCreateBoardDto })
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

    @ApiOkResponse({ description: 'success', type: Success })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '게시글 삭제하기' })
    @ApiBearerAuth()
    @Delete('/:boardId')
    @UseGuards(AuthGuard_renewal)
    deleteBoard(
        @ReqUser() user: User,
        @Param('boardId') boardId: string,
    ): Promise<{ message: string }> {
        return this.boardSerivce.deleteBoard(user, boardId);
    }

    @ApiOkResponse({ description: 'success', type: Success })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '좋아요 활성화' })
    @ApiBearerAuth()
    @Post('/:boardId/like')
    @UseGuards(AuthGuard_renewal)
    @ApiBody({ type: SwaggerLikeDto })
    like(
        @ReqUser() user: User,
        @Param('boardId') boardId: string,
        @Body('parentId') parentId: string,
    ): Promise<{ message: string }> {
        logger.info(`${user.email}님이 ${boardId} 게시글에 좋아요눌렀습니다.`);
        return this.boardSerivce.like(user, boardId, parentId);
    }

    @ApiOkResponse({ description: 'success', type: Success })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '좋아요 비활성화' })
    @ApiBearerAuth()
    @Delete('/:boardId/unlike')
    @UseGuards(AuthGuard_renewal)
    @ApiBody({ type: SwaggerLikeDto })
    unlike(
        @ReqUser() user: User,
        @Param('boardId') boardId: string,
        @Body('parentId') parentId: string,
    ): Promise<{ message: string }> {
        return this.boardSerivce.unlike(user, boardId, parentId);
    }

    @ApiOkResponse({ description: 'success', type: SwaggerReplyDto })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '댓글 작성하기' })
    @ApiBearerAuth()
    @Post('/:boardId/reply')
    @UseGuards(AuthGuard_renewal)
    @UsePipes(ValidationPipe)
    createReply(
        @ReqUser() user: User,
        @Body() createReplyDto: CreateReplyDto,
        @Param('boardId') boardId: string,
    ): Promise<Reply> {
        logger.info(
            `${user.email}님이 ${boardId} 게시글에 댓글을 작성하였습니다..`,
        );
        return this.boardSerivce.createReply(user, boardId, createReplyDto);
    }

    @ApiOkResponse({ description: 'success', type: SwaggerReplyDto })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '댓글 불러오기' })
    @ApiBearerAuth()
    @Get('/:boardId/reply')
    getReply(
        @Param('boardId') boardId: string,
    ): Promise<{ reply_count: number; reply: Reply[] }> {
        return this.boardSerivce.getReply(boardId);
    }
}
