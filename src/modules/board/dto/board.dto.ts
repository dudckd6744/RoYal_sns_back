/* eslint-disable @typescript-eslint/ban-types */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

import { BoardStatus } from '../utils/board.status.enum';

export class CreateBoardDto {
    @ApiProperty({
        example: '여긴 내용적는곳입니다.',
        required: true,
        description: '내용',
    })
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        example: 'image.png or vidoe.mp4',
        description: '이미지 or 영상',
    })
    @IsNotEmpty()
    files: Array<string>;
}

export class CreateReplyDto {
    @ApiProperty({
        example: '댓글 적는곳',
        required: true,
        description: '댓글',
    })
    @IsNotEmpty()
    comment: string;

    @ApiProperty({
        example: 'dklsdjiosdj21kl1',
        description: '게시글의 댓글이면 null 이고 댓글의 댓글이면 댓글 _id',
    })
    parentId: string;
}

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

export class TagFileDto {
    // location_x : number;
    // location_y : number;
    files: string;
    tag: string;
}

// swagger API

export class SwaggerCreateBoardDto extends CreateBoardDto {
    @ApiProperty({
        example: 'private',
        required: true,
        description: 'private or public 둘중 하나',
    })
    status: BoardStatus;
}

export class SwaggerReplyDto {
    @ApiProperty({
        example: 'asfs7fs8f7sf8s',
        required: true,
        description: '작성자 _id',
    })
    writer: string;

    @ApiProperty({
        example: '2hj2h2hu2hk2j',
        required: true,
        description: '게시글 _id',
    })
    boardId: string;

    @ApiProperty({
        example: 'dklsdjiosdj21kl1',
        description: '게시글의 댓글이면 null 이고 댓글의 댓글이면 댓글 _id',
    })
    parentId: string;

    @ApiProperty({
        example: '댓글 적는 곳입니다',
        required: true,
        description: '댓글 내용',
    })
    comment: string;

    @ApiProperty({
        example: 1,
        description: '좋아요 수',
    })
    like_count: number;

    @ApiProperty({
        example: 1,
        description: '대댓글 수',
    })
    reply_count: number;

    @ApiProperty({
        example: 'true',
        description: '사용자의 좋아요에따른 공용변수',
    })
    IsLike: boolean;
}

export class SwaggerGetLikeDto {
    @ApiProperty({
        example: 'sdkja12jk12jk2hk',
        description: '좋아요 pk 값',
    })
    _id: string;
    @ApiProperty({
        example: 'sdkja12jk12jk2hk',
        description: '게시글 아이디',
    })
    boardId: string;
    @ApiProperty({
        example: 'sdkja12jk12jk2hk',
        description:
            '댓글 좋아요할시에 parentId 에 댓글 _id 입력, 게시글 좋아요시 null',
    })
    parentId: string;
    @ApiProperty({
        example: 'sdkja12jk12jk2hk',
        description: '유저아이디',
    })
    userId: string;
}

export class SwaggerLikeDto {
    @ApiProperty({
        example: 'sdkja12jk12jk2hk',
        description:
            '댓글 좋아요할시에 parentId 에 댓글 _id 입력, 게시글 좋아요시 null',
    })
    parentId: string;
}

export class GetFallowBoardsDto {
    @ApiProperty({
        example: 'dklsdjiosdj21kl1',
        required: true,
        description: '작성자 _id',
    })
    writer: string;

    @ApiProperty({
        example: '홍길동',
        required: true,
        description: '작성자 이름',
    })
    userName: string;

    @ApiProperty({
        example: '#인생',
        description: '태그',
    })
    tag: Array<string>;

    @ApiProperty({
        example: '여기는 내용적는곳입니다',
        required: true,
        description: '내용',
    })
    description: string;

    @ApiProperty({
        example: 'PRIVATE',
        required: true,
        description: '상태',
    })
    status: BoardStatus;

    @ApiProperty({
        example: '이미지.png or 영상.mp4',
        description: '이미지 or 영상',
    })
    files: Array<string>;

    @ApiProperty({
        example: 1,
        description: '조회수',
    })
    view: number;

    @ApiProperty({
        example: 1,
        description: '좋아요 갯수',
    })
    like_count: number;

    @ApiProperty({
        example: 1,
        description: '댓글 수',
    })
    reply_count: number;

    @ApiProperty({
        example: 'true',
        description: '사용자의 좋아요에따른 공용변수',
    })
    IsLike: boolean;
}
