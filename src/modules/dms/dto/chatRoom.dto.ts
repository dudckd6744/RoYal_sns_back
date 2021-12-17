import { ApiProperty, PickType } from '@nestjs/swagger';
import { ChatRoom } from 'src/schemas/ChatRoom';

export class CreateSuccessChatRoomDto extends PickType(ChatRoom, [
    'usersIds',
    'leaveInfo',
    'deletedAt',
] as const) {}

export class CreateBodyChatRoomDto extends PickType(ChatRoom, [
    'usersIds',
] as const) {}
