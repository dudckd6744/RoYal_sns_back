import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
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
import { errStatus, Success } from 'src/commonDto/resStatus.dto';
import { User } from 'src/schemas/User';
import { ReqUser } from 'src/utils/auth.decorater';
import { AuthGuard_renewal } from 'src/utils/auth.guard';

import { DmsService } from './dms.service';
import {
    CreateBodyChatRoomDto,
    CreateSuccessChatRoomDto,
} from './dto/chatRoom.dto';
import { CreateDMsDto } from './dto/dms.dto';

@ApiTags('DMs')
@Controller('api/dms')
export class DmsController {
    constructor(private dmsService: DmsService) {}

    @ApiOkResponse({ description: 'success', type: CreateSuccessChatRoomDto })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '채팅룸 만들기' })
    @ApiBearerAuth()
    @ApiBody({
        type: CreateBodyChatRoomDto,
    })
    @Post('/chatRoom')
    @UseGuards(AuthGuard_renewal)
    createChatRoom(
        @ReqUser() userId: string,
        @Body('usersIds') usersIds: Array<string>,
    ): Promise<{ success: true } | errStatus> {
        return this.dmsService.createChatRoom(userId, usersIds);
    }

    @ApiOkResponse({ description: 'success', type: Success })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '채팅룸 나가기' })
    @ApiBearerAuth()
    @Put('/:chatRoomId')
    @UseGuards(AuthGuard_renewal)
    leaveChatRoom(
        @ReqUser() userId: string,
        @Param('chatRoomId') chatRoomId: string,
    ): Promise<{ success: true } | errStatus> {
        return this.dmsService.leaveChatRoom(userId, chatRoomId);
    }

    @ApiOkResponse({ description: 'success', type: CreateDMsDto })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '해당 채팅방 메세지 전체 가져오기' })
    @ApiBearerAuth()
    @Get('/:chatRoomId')
    @UseGuards(AuthGuard_renewal)
    getChatRoomDMs(
        @ReqUser() userId: string,
        @Param('chatRoomId') chatRoomId: string,
    ) {
        return this.dmsService.getChatRoomDMs(userId, chatRoomId);
    }

    @ApiOkResponse({ description: 'success', type: CreateDMsDto })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: 'direct_message 보내기' })
    @ApiBearerAuth()
    @ApiBody({ type: CreateDMsDto })
    @Post('/:chatRoomId')
    @UsePipes(ValidationPipe)
    @UseGuards(AuthGuard_renewal)
    createDMs(
        @ReqUser() userId: string,
        @Param('chatRoomId') chatRoomId: string,
        @Body() createDmsDto: CreateDMsDto,
    ) {
        return this.dmsService.createDMs(userId, chatRoomId, createDmsDto);
    }

    @ApiOkResponse({ description: 'success', type: Success })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: 'direct_message 삭제하기' })
    @ApiBearerAuth()
    @Delete('/:DMs_id')
    @UseGuards(AuthGuard_renewal)
    DeleteDMs(
        @ReqUser() userId: string,
        @Param('DMs_id') DMs_id: string,
    ): Promise<{ success: true } | errStatus> {
        return this.dmsService.DeleteDMs(userId, DMs_id);
    }
}
