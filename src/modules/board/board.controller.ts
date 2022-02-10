import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
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
    ApiTags,
} from '@nestjs/swagger';
import { logger } from 'src/configs/winston';
import { errStatus, Success } from 'src/resStatusDto/resStatus.dto';
import { Board } from 'src/schemas/Board';
import { Reply } from 'src/schemas/Reply';
import { User } from 'src/schemas/User';
import { ReqUser } from 'src/utils/auth.decorater';
import { AuthGuard_renewal } from 'src/utils/auth.guard';

import { BoardService } from './board.service';
import {
    CreateBoardDto,
    CreateReplyDto,
    GetBoardsDto,
    GetFallowBoardsDto,
    SwaggerCreateBoardDto,
    SwaggerLikeDto,
    SwaggerReplyDto,
} from './dto/board.dto';
import { BoardStatusPipe } from './pipes/board.status.pipes';
import { BoardStatus } from './utils/board.status.enum';

@ApiTags('boards')
@Controller('api/boards')
export class BoardController {
    constructor(private boardSerivce: BoardService) {}

    @ApiOkResponse({ description: 'success', type: Success })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '게시글 작성하기' })
    @ApiBody({ type: SwaggerCreateBoardDto })
    @ApiBearerAuth()
    @Post('/')
    @UsePipes(ValidationPipe)
    @UseGuards(AuthGuard_renewal)
    createBoard(
        @ReqUser() email: string,
        @Body() createBoardDto: CreateBoardDto,
        @Body('status', BoardStatusPipe) status: BoardStatus,
    ): Promise<{ success: true } | errStatus> {
        return this.boardSerivce.createBoard(email, createBoardDto, status);
    }

    @ApiOkResponse({ description: 'success', type: GetFallowBoardsDto })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '팔로잉한 유저 게시글 가져오기' })
    @Get('/followBoard')
    @UseGuards(AuthGuard_renewal)
    getFollowBoard(@ReqUser() email: string): Promise<Board[] | errStatus> {
        return this.boardSerivce.getFollowBoard(email);
    }

    @ApiOkResponse({ description: 'success', type: GetFallowBoardsDto })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '유저 페이지에 해당되는 게시글 가져오기' })
    @Get('/myPage/:userId')
    getMyBoard(
        @ReqUser() email: string,
        @Param('userId') userId: string,
    ): Promise<{ success: true; boards: Board[]; user: User } | errStatus> {
        return this.boardSerivce.getMyBoard(email, userId);
    }

    @ApiOkResponse({ description: 'success', type: GetFallowBoardsDto })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '전체 게시글 가져오기' })
    @Get('/')
    getBoard(
        @ReqUser() email: string,
        @Query() getBoardDto: GetBoardsDto,
    ): Promise<Board[] | errStatus> {
        return this.boardSerivce.getBoard(email, getBoardDto);
    }

    @ApiOkResponse({ description: 'success', type: GetFallowBoardsDto })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '게시글 상세내용 가져오기' })
    @Get('/:boardId')
    getDeatailBoard(
        @ReqUser() email: string,
        @Param('boardId') boardId: string,
        @Query('over_view') over_view: boolean,
    ): Promise<{ success: true; board: Board } | errStatus> {
        logger.info(`${email}님이 ${boardId} 게시글에 접속하였습니다.`);
        return this.boardSerivce.getDetailBoard(email, boardId, over_view);
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
        @Body('tag') tag: any,
    ): Promise<{ success: true } | errStatus> {
        return this.boardSerivce.updateBoard(
            user,
            boardId,
            createBoardDto,
            status,
            tag,
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
    ): Promise<{ success: true }> {
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
    ): Promise<{ success: true } | errStatus> {
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
    ): Promise<{ success: true } | errStatus> {
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
    ): Promise<{ success: true; reply_data: Reply } | errStatus> {
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
        @ReqUser() user: User,
        @Query('skip', ParseIntPipe) skip: number,
        @Query('limit', ParseIntPipe) limit: number,
    ): Promise<
        { success: true; reply: Reply[]; reply_count: number } | errStatus
    > {
        return this.boardSerivce.getReply(user, boardId, skip, limit);
    }

    @ApiOkResponse({ description: 'success', type: Success })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '댓글 삭제하기' })
    @ApiBearerAuth()
    @Delete('/:boardId/:replyId')
    deleteReply(
        @Param('boardId') boardId: string,
        @Param('replyId') replyId: string,
        @ReqUser() user: User,
    ): Promise<{ success: true } | errStatus> {
        return this.boardSerivce.deleteReply(user, boardId, replyId);
    }
}
