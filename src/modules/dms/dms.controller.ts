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
import { errStatus, Success } from 'src/resStatusDto/resStatus.dto';
import { User } from 'src/schemas/User';
import { AuthGuard_renewal } from 'src/utils/auth.guard';
import { ReqUser } from 'src/utils/user.decorater';

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
        @ReqUser() user: User,
        @Body('usersIds') usersIds: Array<string>,
    ): Promise<{ success: true } | errStatus> {
        return this.dmsService.createChatRoom(user, usersIds);
    }

    @ApiOkResponse({ description: 'success', type: Success })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '채팅룸 나가기' })
    @ApiBearerAuth()
    @Put('/:chatRoomId')
    @UseGuards(AuthGuard_renewal)
    leaveChatRoom(
        @ReqUser() user: User,
        @Param('chatRoomId') chatRoomId: string,
    ): Promise<{ success: true } | errStatus> {
        return this.dmsService.leaveChatRoom(user, chatRoomId);
    }

    @ApiOkResponse({ description: 'success', type: CreateDMsDto })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '해당 채팅방 메세지 전체 가져오기' })
    @ApiBearerAuth()
    @Get('/:chatRoomId')
    @UseGuards(AuthGuard_renewal)
    getChatRoomDMs(
        @ReqUser() user: User,
        @Param('chatRoomId') chatRoomId: string,
    ) {
        return this.dmsService.getChatRoomDMs(user, chatRoomId);
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
        @ReqUser() user: User,
        @Param('chatRoomId') chatRoomId: string,
        @Body() createDmsDto: CreateDMsDto,
    ) {
        return this.dmsService.createDMs(user, chatRoomId, createDmsDto);
    }

    @ApiOkResponse({ description: 'success', type: Success })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: 'direct_message 삭제하기' })
    @ApiBearerAuth()
    @Delete('/:DMs_id')
    @UseGuards(AuthGuard_renewal)
    DeleteDMs(
        @ReqUser() user: User,
        @Param('DMs_id') DMs_id: string,
    ): Promise<{ success: true } | errStatus> {
        return this.dmsService.DeleteDMs(user, DMs_id);
    }
}
