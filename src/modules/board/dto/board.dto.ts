/* eslint-disable @typescript-eslint/ban-types */
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Board } from 'src/schemas/Board';
import { Like } from 'src/schemas/Like';
import { Reply } from 'src/schemas/Reply';

export class CreateBoardDto extends PickType(Board, [
    'description',
    'files',
] as const) {}

export class GetFallowBoardsDto extends PickType(Board, [
    'writer',
    'userName',
    'tag',
    'description',
    'status',
    'files',
    'view',
    'like_count',
    'reply_count',
    'IsLike',
] as const) {}

export class GetBoardsDto {
    @ApiProperty({
        example: '야관문',
        description: '작성자 이름이나 태그',
    })
    search: string;

    @ApiProperty({
        example: 'userName or tag',
        description: '작성자 이름 이나 태그 검색조건',
    })
    search_type: string;
}

export class CreateReplyDto extends PickType(Reply, [
    'comment',
    'parentId',
] as const) {}

export class SwaggerCreateBoardDto extends PickType(Board, [
    'description',
    'files',
    'status',
] as const) {}

export class SwaggerReplyDto extends PickType(Reply, [
    'writer',
    'boardId',
    'parentId',
    'comment',
    'like_count',
    'reply_count',
    'IsLike',
] as const) {}

export class SwaggerGetLikeDto extends PickType(Like, [
    'boardId',
    'parentId',
    'userId',
] as const) {}

export class SwaggerLikeDto extends PickType(Like, ['parentId'] as const) {}

// export class TagFileDto {
//     // location_x : number;
//     // location_y : number;
//     files: string;
//     tag: string;
// }
