import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateBoardDto {
  @IsNotEmpty()
  @MaxLength(30, { message: '쵀대 30자 이내로만 입력이 가능합니다.' })
  title: string;

  @IsNotEmpty()
  description: string;
}

export class CreateReplyDto {
  @IsNotEmpty()
  comment: string;

  parentId: string;
}
