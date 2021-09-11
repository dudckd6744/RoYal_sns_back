/* eslint-disable @typescript-eslint/ban-types */
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateBoardDto {
    tag: Array<string>;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    files: Array<string>;
}

export class CreateReplyDto {
    @IsNotEmpty()
    comment: string;

    parentId: string;
}

export class GetBoardsDto {
    search: string;

    search_type: string;
}

export class TagFileDto {
    // location_x : number;
    // location_y : number;
    files: string;
    tag: string;
}
